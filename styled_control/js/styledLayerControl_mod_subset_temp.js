L.Control.StyledLayerControl = L.Control.Layers.extend({
    //// these options are not all baked in and have to be created in this script.  ONly baked in one is position for Control!!!
    //// trick is to check the control script if things are not showing up with the control
    /////Note: the extend function is in the leaflet Class section
    /////Extends the current class given the properties to be included. Returns a Javascript function that is a class constructor (to be called with new).
    //// th extend function returns a function
    options: {
        collapsed: true,
        position: 'topright', 
        autoZIndex: true,
        yo: true,
        group_togglers: {
            show: false,
            labelAll: 'All',
            labelNone: 'None'
        },
        groupDeleteLabel: 'Delete the group'
    },

    //// ---- this is in the leaflet Class section
    initialize: function(baseLayers, groupedOverlays, options) {
        var i,
            j;
        L.Util.setOptions(this, options);

        this._layerControlInputs = [];
        this._layers = [];
        this._lastZIndex = 0;
        this._handlingClick = false;
        this._groupList = [];
        this._domGroups = [];

        for (i in baseLayers) {
            for (var j in baseLayers[i].layers) {
                this._addLayer(baseLayers[i].layers[j], j, baseLayers[i], false);
            }
        }

        for (i in groupedOverlays) {
            for (var j in groupedOverlays[i].layers) {
                this._addLayer(groupedOverlays[i].layers[j], j, groupedOverlays[i], true);
            }
        }


    },


    //// ---- this is in the leaflet Control section
    ///Extension methods ---- Every control should extend from L.Control and (re-)implement the following methods.
    ////Should return the container DOM element for the control and add listeners on relevant map events. Called on control.addTo(map).
    //// this method returns an HTMLElement.

    ///Note: this function calls the private functions!!!
    onAdd: function(map) {
        ////this function creates the div elemets and attach class/id to the div
        this._initLayout();

        this._update();

        // map
        //     .on('layeradd', this._onLayerChange, this)
        //     .on('layerremove', this._onLayerChange, this)
        //     .on('zoomend', this._onZoomEnd, this);

        return this._container;
    },

    onRemove: function(map) {
        map
            .off('layeradd', this._onLayerChange)
            .off('layerremove', this._onLayerChange);
    },

  
///////////////////////////////////////////////////
//// important function  (funt_1 )///////////////////////////
///////////////////////////////////////////////////

    _initLayout: function() {
        /////create the form element 
        ////////// used the DomUtil.create Utility function to work with the DOM tree.  
        ///-----Creates an HTML element with tagName, sets its class to className, and optionally appends it to container element.  

        ////create a form element
        var form = this._form = L.DomUtil.create('form');

        ////create section element and append it to a form that is then added to the map div using the leaflet method
        var section = document.createElement('section');
        section.className = 'ac-container ' + className + '-list';

        section.appendChild(form);

        //////Create the box that holds the panels and add it to the map div using the leaflet method
        var className = 'leaflet-control-layers',
            container = this._container = L.DomUtil.create('div', className);

        console.log('this:', this)
        console.log('this._container:', this._container)


        this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
        this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

        container.appendChild(section);



    },

    _on_resize_window: function() {
        // listen to resize of screen to reajust de maxHeight of container
        for (var c = 0; c < containers.length; c++) {
            // input the new value to height
            containers[c].style.maxHeight = (window.innerHeight - 90) < this._removePxToInt(this._default_maxHeight) ? (window.innerHeight - 90) + "px" : this._removePxToInt(this._default_maxHeight) + "px";
        }
    },

    // remove the px from a css value and convert to a int
    _removePxToInt: function(value) {
        if (typeof value === 'string') {
            return parseInt(value.replace("px", ""));
        }
        return value;
    },

    _addLayer: function(layer, name, group, overlay) {
        var id = L.Util.stamp(layer);

        this._layers[id] = {
            layer: layer,
            name: name,
            overlay: overlay
        };

        if (group) {
            var groupId = this._groupList.indexOf(group);

            // if not find the group search for the name
            if (groupId === -1) {
                for (g in this._groupList) {
                    if (this._groupList[g].groupName == group.groupName) {
                        groupId = g;
                        break;
                    }
                }
            }

            if (groupId === -1) {
                groupId = this._groupList.push(group) - 1;
            }

            this._layers[id].group = {
                name: group.groupName,
                id: groupId,
                expanded: group.expanded,
                removable: group.removable
            };
        }

        if (this.options.autoZIndex && layer.setZIndex) {
            this._lastZIndex++;
            layer.setZIndex(this._lastZIndex);
        }
    },

    _update: function() {
        if (!this._container) {
            return;
        }

        this._baseLayersList.innerHTML = '';
        this._overlaysList.innerHTML = '';

        this._domGroups.length = 0;

        this._layerControlInputs = [];

        var baseLayersPresent = false,
            overlaysPresent = false,
            i,
            obj;

        for (i in this._layers) {
            obj = this._layers[i]; /////this is an important object each layer added in the script fucntion is its own unique object
            console.log('obj:', obj)
            this._addItem(obj); ////// call the large function
            overlaysPresent = overlaysPresent || obj.overlay;
            baseLayersPresent = baseLayersPresent || !obj.overlay;
        }

    },

    _onLayerChange: function(e) {
        var obj = this._layers[L.Util.stamp(e.layer)];

        if (!obj) {
            return;
        }

        if (!this._handlingClick) {
            this._update();
        }

        var type = obj.overlay ?
            (e.type === 'layeradd' ? 'overlayadd' : 'overlayremove') :
            (e.type === 'layeradd' ? 'baselayerchange' : null);

        this._checkIfDisabled();

        if (type) {
            this._map.fire(type, obj);
        }
    },

    _onZoomEnd: function(e) {
        this._checkIfDisabled();
    },

    _checkIfDisabled: function(layers) {
        var currentZoom = this._map.getZoom();

        for (layerId in this._layers) {
            if (this._layers[layerId].layer.options && (this._layers[layerId].layer.options.minZoom || this._layers[layerId].layer.options.maxZoom)) {
                var el = document.getElementById('ac_layer_input_' + this._layers[layerId].layer._leaflet_id);
                if (currentZoom < this._layers[layerId].layer.options.minZoom || currentZoom > this._layers[layerId].layer.options.maxZoom) {
                    el.disabled = 'disabled';
                } else {
                    el.disabled = '';
                }
            }
        }
    },


//////BIG METHOD explore this first!!!!!!!!!!!!!!!!!!!!!!!
    _addItem: function(obj) {

        console.log('obj---', obj) //// this is the dictionary object created above
        var label = document.createElement('div'),  ///create an empty div element
            input,   //// declare and empty variable to be filled later
            checked = this._map.hasLayer(obj.layer),  ///checked if box is declared true in main script
            id = 'ac_layer_input_' + obj.layer._leaflet_id, ////create id for div
            container; ///declare and empty variable to be filled later
        


        console.log('checked', checked)
        console.log('input', input)



        console.log('obj.overlay', obj.overlay)
        ////add check boxes to object
        if (obj.overlay) {
            console.log(id)
            input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'leaflet-control-layers-selector';
            input.defaultChecked = checked;

            label.className = "menu-item-checkbox";
            input.id = id;
        ////add radio buttons to object
        } else {
            input = this._createRadioElement('leaflet-base-layers', checked);
            label.className = "menu-item-radio";
            input.id = id;
        }




        ////  _layerControlInputs is an empty array
        this._layerControlInputs.push(input);
        input.layerId = L.Util.stamp(obj.layer);

        ////add layer to map with click!!
        L.DomEvent.on(input, 'click', this._onInputClick, this);

        ////create label object for checkboxes
        var name = document.createElement('label');
        name.innerHTML = '<label for="' + id + '">' + obj.name + '</label>';

        console.log(input)

        label.appendChild(input);
        label.appendChild(name);

        // if (obj.layer.StyledLayerControl) {

        //     // configure the delete button for layers with attribute removable = true
        //     if (obj.layer.StyledLayerControl.removable) {
        //         var bt_delete = document.createElement("input");
        //         bt_delete.type = "button";
        //         bt_delete.className = "bt_delete";
        //         L.DomEvent.on(bt_delete, 'click', this._onDeleteClick, this);
        //         label.appendChild(bt_delete);
        //     }

        //     // configure the visible attribute to layer
        //     if (obj.layer.StyledLayerControl.visible) {
        //         this._map.addLayer(obj.layer);
        //     }

        // }


        if (obj.overlay) {
            container = this._overlaysList;
        } else {
            container = this._baseLayersList;
        }

        var groupContainer = this._domGroups[obj.group.id];

        if (!groupContainer) {
            console.log('pre interaction method (I think)')

            groupContainer = document.createElement('div');
            groupContainer.id = 'leaflet-control-accordion-layers-' + obj.group.id;

            // verify if group is expanded
            var s_expanded = obj.group.expanded ? ' checked = "true" ' : '';

            // verify if type is exclusive
            var s_type_exclusive = this.options.exclusive ? ' type="radio" ' : ' type="checkbox" ';

            inputElement = '<input id="ac' + obj.group.id + '" name="accordion-12" class="menu" ' + s_expanded + s_type_exclusive + '/>';
            inputLabel = '<label for="ac' + obj.group.id + '">' + obj.group.name + '</label>';

            article = document.createElement('article');
            article.className = 'ac-large';
            article.appendChild(label);

            // process options of ac-large css class - to options.group_maxHeight property
            if (this.options.group_maxHeight) {
                article.style.maxHeight = this.options.group_maxHeight;
            }

            groupContainer.innerHTML = inputElement + inputLabel;
            groupContainer.appendChild(article);

            // Link to toggle all layers  
            if (obj.overlay && this.options.group_togglers.show) {

                // Toggler container
                var togglerContainer = L.DomUtil.create('div', 'group-toggle-container', groupContainer);

                // Link All
                var linkAll = L.DomUtil.create('a', 'group-toggle-all', togglerContainer);
                linkAll.href = '#';
                linkAll.title = this.options.group_togglers.labelAll;
                linkAll.innerHTML = this.options.group_togglers.labelAll;
                linkAll.setAttribute("data-group-name", obj.group.name);

                if (L.Browser.touch) {
                    L.DomEvent
                        .on(linkAll, 'click', L.DomEvent.stop)
                        .on(linkAll, 'click', this._onSelectGroup, this);
                } else {
                    L.DomEvent
                        .on(linkAll, 'click', L.DomEvent.stop)
                        .on(linkAll, 'focus', this._onSelectGroup, this);
                }

                // Separator
                var separator = L.DomUtil.create('span', 'group-toggle-divider', togglerContainer);
                separator.innerHTML = ' / ';

                // Link none
                var linkNone = L.DomUtil.create('a', 'group-toggle-none', togglerContainer);
                linkNone.href = '#';
                linkNone.title = this.options.group_togglers.labelNone;
                linkNone.innerHTML = this.options.group_togglers.labelNone;
                linkNone.setAttribute("data-group-name", obj.group.name);

                if (L.Browser.touch) {
                    L.DomEvent
                        .on(linkNone, 'click', L.DomEvent.stop)
                        .on(linkNone, 'click', this._onUnSelectGroup, this);
                } else {
                    L.DomEvent
                        .on(linkNone, 'click', L.DomEvent.stop)
                        .on(linkNone, 'focus', this._onUnSelectGroup, this);
                }

                if (obj.overlay && this.options.group_togglers.show && obj.group.removable) {
                    // Separator
                    var separator = L.DomUtil.create('span', 'group-toggle-divider', togglerContainer);
                    separator.innerHTML = ' / ';
                }

                if (obj.group.removable) {
                    // Link delete group
                    var linkRemove = L.DomUtil.create('a', 'group-toggle-none', togglerContainer);
                    linkRemove.href = '#';
                    linkRemove.title = this.options.groupDeleteLabel;
                    linkRemove.innerHTML = this.options.groupDeleteLabel;
                    linkRemove.setAttribute("data-group-name", obj.group.name);

                    // if (L.Browser.touch) {
                    //     L.DomEvent
                    //         .on(linkRemove, 'click', L.DomEvent.stop)
                    //         .on(linkRemove, 'click', this._onRemoveGroup, this);
                    // } else {
                    //     L.DomEvent
                    //         .on(linkRemove, 'click', L.DomEvent.stop)
                    //         .on(linkRemove, 'focus', this._onRemoveGroup, this);
                    // }
                }

            }

            container.appendChild(groupContainer);

            this._domGroups[obj.group.id] = groupContainer;
        } else {
            console.log("dsdsd")
            groupContainer.getElementsByTagName('article')[0].appendChild(label);
        }


        return label;
    },

}); ///////// END OF L.Control.Layers.extend method ////////////////////////////////////////

L.Control.styledLayerControl = function(baseLayers, overlays, options) {
    return new L.Control.StyledLayerControl(baseLayers, overlays, options);
};
