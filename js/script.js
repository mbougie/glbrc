// var map = new L.Map('map', {
//     'center': [0, 0],
//     'zoom': 0

// });


//// baselayers
var satellite = new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
var topo_map = new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}');
var dark_map = new L.TileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png');

//// layers


lsl_url = 'https://storage.googleapis.com/www.mattbougie.com/marginal_lsl_orange/{z}/{x}/{y}'
var lsl = new L.tileLayer(url_obj.lsl.url);

ral_url = 'https://storage.googleapis.com/www.mattbougie.com/s35_abandonment_final/{z}/{x}/{y}'
var ral = new L.tileLayer(url_obj.ral.url);

hal_url = 'https://storage.googleapis.com/www.mattbougie.com/marginal_ral_blue/{z}/{x}/{y}'
var hal = new L.tileLayer(url_obj.hal.url);



// console.log(url_obj)
// for (var key in url_obj) {
// 	console.log(key);
//     console.log(url_obj[key]);
// }



var bounds = [
    [0, -180], // Southwest coordinates
    [75, 10]  // Northeast coordinates
];

var map = L.map('map', {
	center: [36.0902, -95.7129],
	layers: [topo_map, lsl],
	zoom: 5,
	minZoom: 5,
	maxZoom: 12,
	maxBounds: bounds
});


// var baseMaps = [
//                  {
// 				    groupName : "Base Maps",
// 				    expanded : false,
// 					layers    : {
// 						'Satellite imagery' : satellite,
// 						"Reference map" : topo_map,
// 						"Dark map": dark_map
// 					}
//                 }							
// ];
		
// var overlays = [
// 				 {
// 					groupName : "Marginal Land Data",
// 					expanded : true,
// 					layers    : { 
// 						'<span>Low capability land</span><span class = "download"></span><span class = "info_circle" id="lsl"></span>': lsl,
// 						'<span>Recently abandoned land</span><span class = "download"></span><span class = "info_circle" id="ral"></span>': ral,
// 						'<span>Formerly irrigated land</span><span class = "download"></span><span class = "info_circle" id="ral"></span>': hal
// 					}	
//                  }, {
// 					groupName : "Irrigation",
// 					expanded : false,
// 					layers    : {}	
//                  }, {
// 					groupName : "Carbon",
// 					layers    : {}	
//                  }							 
// ];


// var options = {
// 	container_width 	: "250px",
// 	group_maxHeight     : "80px",
// 	collapsed			: false,
// 	exclusive       	: true
// };

var center = [40, 0];
var osm = L.tileLayer(
            '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {attribution: '© OpenStreetMap contributors'}
        );

        var osmBw = L.tileLayer(
            'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
            {attribution: '© OpenStreetMap contributors'}
        );

        var otopomap = L.tileLayer(
            '//{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            {attribution: '© OpenStreetMap contributors. OpenTopoMap.org'}
        );

        var thunderAttr = {attribution: '© OpenStreetMap contributors. Tiles courtesy of Andy Allan'}
        var transport = L.tileLayer(
            '//{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
            thunderAttr
        );

        var cycle = L.tileLayer(
            '//{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
            thunderAttr
        );

        // var map = L.map('map', {
        //     layers: [osm],
        //     center: center,
        //     zoom: 5
        // });

        var baseTree = [
            {
                label: 'OpenStreeMap',
                layer: osm,
                children: [
                    {label: 'B&W', layer: osmBw, name: 'OpenStreeMap <b>B&W</b>'},
                    {label: 'OpenTopoMap', layer: otopomap, name: 'Topographic - OSM'},
                ]
            },
            {
                label: 'Thunder',
                children: [
                    {label: 'Cycle', layer: cycle},
                    {label: 'Transport', layer: transport},
                ]
            },
        ];

        var granada = L.marker([37.133, -3.636]);
        var malaga = L.marker([36.674, -4.499]);
        var sevilla = L.marker([37.418, -5.893]);

        malaga.addTo(map);
        granada.addTo(map);
        sevilla.addTo(map);

        var overlaysTree = {
            children: [
                {label: 'France', children: [
                    {label: 'Lyon', layer: L.marker([45.728, 4.945])},
                    {label: 'Paris', layer: L.marker([48.725, 2.359])},
                    {label: 'Toulouse', layer: L.marker([43.629, 1.364])},
                ]},
                {label: 'Germany', selectAllCheckbox: true, children: [
                    {label: 'Berlin', layer: L.marker([52.559, 13.287])},
                    {label: 'Cologne', layer: L.marker([50.866, 7.143])},
                    {label: 'Hamburg', layer: L.marker([53.630, 9.988])},
                    {label: 'Munich', layer: L.marker([48.354, 11.786])},
                ]},
                {label: 'Spain',
                    selectAllCheckbox: 'De/seleccionar todo',
                    children: [
                        {label: 'Madrid', layer: L.marker([40.472, -3.561])},
                        {label: 'Andalucia', selectAllCheckbox: true, children: [
                            {label: 'Granada', layer: granada},
                            {label: 'Málaga', layer: malaga},
                            {label: 'Sevilla', layer: sevilla},
                        ]},
                        {label: 'Bask Country', children: [
                            {label: '---', layer: L.layerGroup([]), radioGroup: 'bc'},
                            {label: 'Bilbao', layer: L.marker([43.301, -2.911]), radioGroup: 'bc'},
                            {label: 'San S', layer: L.marker([43.356, -1.791]), radioGroup: 'bc'},
                            {label: 'Vitoria', layer: L.marker([42.883, -2.724]), radioGroup: 'bc'},
                        ]},
                        {label: 'Catalonia', children: [
                            {label: 'Barcelona', layer: L.marker([41.297, 2.078])},
                            {label: 'Gerona', layer: L.marker([41.901, 2.760])},
                        ]},
                    ],
                },
            ]
        }

        var lay = L.control.layers.tree(baseTree, overlaysTree,
            {
                namedToggle: true,
                selectorBack: false,
                // closedSymbol: '&#8862; &#x1f5c0;',
                // openedSymbol: '&#8863; &#x1f5c1;',
                // collapseAll: 'Collapse all',
                expandAll: 'Marginal Land Data',
                collapsed: false,
            });

        lay.addTo(map).collapseTree().expandSelected().collapseTree(true);
        L.DomEvent.on(L.DomUtil.get('onlysel'), 'click', function() {
            lay.collapseTree(true).expandSelected(true);
        });



////// new stuff ////////////////////////////////
var customControl = L.Control.extend({
 
  options: {
    position: 'topleft' 
    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
  },
 
onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom yo');
    container.style.backgroundColor = 'white';
    container.style.width = '35px';
    container.style.height = '35px';
 
    container.onclick = function(){
    $('#mymodal').modal('show');
    }
    return container;
  }
 
});	

map.addControl(new customControl());







////////////////////////////////////////////////////////////
///////  create credit graphic  ////////////////////////////
////////////////////////////////////////////////////////////

// var credctrl = L.controlCredits({
//     image: "./images/logo_perc_75.jpg",
//     link: "https://www.glbrc.org/",
//     text: "GLBRC<br/>Great Lakes Bioenergy Research Center",
//     width: 254,
//     height: 112
// }).addTo(map);



////////////////////////////////////////////////////////////
///////  create legends  ///////////////////////////////////
////////////////////////////////////////////////////////////

var legend = L.control({position: 'bottomright'});


function getKey(current_url) {
	///function to get the key of the object given a value
	for (var key in url_obj) {
		if (url_obj[key].url == current_url) {
			return key
		}
	}

}





keys_array = ["lsl"]

console.log(url_obj["lsl"].hex)

legend.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'info legend');
	for (var i = 0; i < keys_array.length; i++) {
		console.log(keys_array[i])
		div.innerHTML +=
			'<i style="background:' + url_obj[keys_array[i]].hex + '"></i> ' + url_obj[keys_array[i]].label + (url_obj[keys_array[i]].label ? '<br>' : '');
	}
	return div;
};

legend.addTo(map);




function addToLegend(current_key){
	console.log('rererr', current_key)
	keys_array.push(current_key);
	
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend')
		for (var i = 0; i < keys_array.length; i++) {
		console.log(keys_array[i])
		div.innerHTML +=
			'<i style="background:' + url_obj[keys_array[i]].hex + '"></i> ' + url_obj[keys_array[i]].label + (url_obj[keys_array[i]].label ? '<br>' : '');
	}
	return div;
	};

	legend.addTo(map);
}




function removeFromLegend(current_key){
	console.log('inside removeFromLegend', current_key)

	///remove layer from array
	var index = keys_array.indexOf(current_key);
	if (index > -1) {
	  keys_array.splice(index, 1);
	}
	
    legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend')
		for (var i = 0; i < keys_array.length; i++) {
		console.log(keys_array[i])
		div.innerHTML +=
			'<i style="background:' + url_obj[keys_array[i]].hex + '"></i> ' + url_obj[keys_array[i]].label + (url_obj[keys_array[i]].label ? '<br>' : '');
	}
	return div;
	};

	legend.addTo(map);
}

// Add this one (only) for now, as the Population layer is on by default!!!!!!!!!!!!!!!!!!!!!
// legend.addTo(map);


map.on('overlayadd', function (eventLayer) {
	console.log('overlayadd')
	console.log(eventLayer)
	current_url = eventLayer.layer._url
	current_key = getKey(current_url)
	console.log(current_key)
	addToLegend(current_key)

});


map.on('overlayremove', function (eventLayer) {
	console.log('overlayremove')
	console.log(eventLayer)
	current_url = eventLayer.layer._url
	current_key = getKey(current_url)
	console.log(current_key)
	removeFromLegend(current_key)

});



// L.control.layers(overlays,null,{collapsed:false}).addTo(map);
var control = L.Control.styledLayerControl(baseMaps, overlays, options);
map.addControl(control);
			


////// this needs to be added AFTER map.addControl(control) otherwise doesnt recognize!!

//// create a click event for the icon in layer control
$(".info_circle, .download").click(function(){
	///open modal
   $('#mymodal').modal('show');

   	///remove the label click checkbox ability so clicking on icon doesn't check the box.
   	return false; 
   
});	