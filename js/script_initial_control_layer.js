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



///////////////////////////////////////////////////////////////////////////////////
/////// old layer control /////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

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



// var control = L.Control.styledLayerControl(baseMaps, overlays, options);
// map.addControl(control);





// var center = [40, 0];
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
            label: 'Some cities',
            children: [
                {label: '<div id="onlysel">-Show only selected-</div>'},
                {label: '<span>Low capability land</span><span class = "info_circle"></span><span class = "download"></span>', selectAllCheckbox: true, children: [
                    {label: '<span id = "lsl" class = "square"></span>', layer: lsl},
                ]},
                {label: '<span>Recently abandoned land</span><span class = "info_circle"></span><span class = "download"></span>', selectAllCheckbox: true, children: [
                    {label: '<span id = "ral" class = "square"></span>', layer: hal},
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
                            {label: 'San Sebastian', layer: L.marker([43.356, -1.791]), radioGroup: 'bc'},
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
                collapseAll: 'Collapse all',
                expandAll: 'Expand all',
                collapsed: false,
            });

        lay.addTo(map).collapseTree().expandSelected().collapseTree(true);
        L.DomEvent.on(L.DomUtil.get('onlysel'), 'click', function() {
            lay.collapseTree(true).expandSelected(true);
        });














////////////////////////////////////////////////////////////////////////
////// new stuff ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

///////// add the questionmark button ///////////////////////////

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

/////////////////////////////////////////////////////////////////////




////// this needs to be added AFTER map.addControl(control) otherwise doesnt recognize!!

//// create a click event for the icon in layer control
$(".info_circle, .download").click(function(){
	///open modal
   $('#mymodal').modal('show');

   	///remove the label click checkbox ability so clicking on icon doesn't check the box.
   	return false; 
   
});	