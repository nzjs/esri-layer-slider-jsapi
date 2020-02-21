
require([
    "esri/Map", "esri/layers/FeatureLayer", "esri/layers/VectorTileLayer", "esri/views/MapView", "esri/Graphic", "esri/widgets/Locate", "esri/widgets/Home", "esri/widgets/LayerList", "esri/widgets/Search", 
    "esri/widgets/Slider", "esri/widgets/BasemapToggle", "esri/Basemap", "esri/widgets/Legend", "esri/widgets/Expand", "esri/core/watchUtils", "dijit/Dialog", "dojo/domReady!"
    ], function (
    Map, FeatureLayer, VectorTileLayer, MapView, Graphic, Locate, Home, LayerList, Search, 
    Slider, BasemapToggle, Basemap, Legend, Expand, watchUtils, Dialog) {

    const template = {
        title: "Hazard Category {HazardCategory}",
        content: [
        {
            type: "fields",
            fieldInfos: [
            {
                fieldName: "ScenarioID",
                label: "Scenario"
            },
            {
                fieldName: "HazardCategory",
                label: "Hazard Category"
            },
            {
                fieldName: "HazardDesc",
                label: "Hazard Description"
            }
            ]
        }
        ]
    };

    vectorTileLayers = {
        1: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__01_Q50_No_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        2: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__02_Q50_Medium_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        3: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__03_Q50_Severe_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        4: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__04_Q100_No_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        5: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__05_Q100_Medium_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        6: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__06_Q100_Severe_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        // 7: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__07_Q50cc_700SLR_No_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        // 8: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__08_Q50cc_700SLR_Medium_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        // 9: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__09_Q50cc_700SLR_Severe_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        // 10: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__10_Q100CC_700SLR_No_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        // 11: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__11_Q100CC_700SLR_Medium_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        // 12: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__12_Q100CC_700SLR_Severe_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        // 13: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__13_Q100CC_1mSLR_No_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        // 14: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__14_Q100CC_1mSLR_Medium_Blockage_2017_Hazard_D_NZTM/VectorTileServer',
        // 15: 'https://tiles.arcgis.com/tiles/za4HjpHWqnA4SFnH/arcgis/rest/services/FC_Int__15_Q100CC_1mSLR_Severe_Blockage_2017_Hazard_D_NZTM/VectorTileServer'
    }
    // console.log(vectorTileLayers[2])

    const queryLayer = new FeatureLayer({
        url:  "https://services3.arcgis.com/za4HjpHWqnA4SFnH/arcgis/rest/services/Westport_Flood_Hazards_LRS_NZTM_Merged/FeatureServer/0",
        definitionExpression: "ScenarioID = 1", // Set the default map scenario
        popupTemplate: template,
        title: "Flood Hazard Categories",
        legendEnabled: false,
        opacity: 0.0001
    })

    let tileLayer = new VectorTileLayer({
        url: vectorTileLayers[1] // Set the default vector tile layer
    })

    const map = new Map({
        basemap: {
            portalItem: {
            id: "7baec8e1cf1b439bb6644bd4ba64bf11" // NZ Imagery by Eagle - NZTM
            }
        },
        layers: [queryLayer, tileLayer]
        });

    const view = new MapView({
        container: "mapViewDiv",
        map: map,
        extent: {
        spatialReference: {
            latestWkid: 2193,
            wkid: 2193
        },
        xmin: 1482683.74858305, // Default to Westport area
        ymin: 5374621.38528033,
        xmax: 1486490.7229703,
        ymax: 5377499.93117899
        }
    });


    // Define our widgets for the view
    const locateWidget = new Locate({
        view: view,   
        graphic: new Graphic({
        symbol: { type: "simple-marker" }  
        })
    });
    const homeWidget = new Home({
        view: view,   
        graphic: new Graphic({
        symbol: { type: "simple-marker" }  
        })
    });
    const lyrWidget = new LayerList({
        view: view,   
        respectLayerVisibility: false,
        graphic: new Graphic({
        symbol: { type: "simple-marker" }  
        })
    });
    const lyrExpand = new Expand({
        view: view,
        content: lyrWidget,
        expanded: false,
        expandIconClass: "esri-icon-layer-list"
    });
    const searchWidget = new Search({
        view: view,   
        graphic: new Graphic({
        symbol: { type: "simple-marker" }  
        })
    });
    const basemapWidget = new BasemapToggle({
        view: view,  
        titleVisible: true,
        nextBasemap: new Basemap({
        portalItem: {
            id: "9c76293962a041e1853d573ae36c1d34"  // Vector Topo by Eagle - NZTM
        }
        //"streets", "satellite", "hybrid", "terrain", "topo", "gray", "dark-gray", "oceans", 
        //"national-geographic", "osm", "dark-gray-vector", "gray-vector", "streets-vector", 
        //"topo-vector", "streets-night-vector", "streets-relief-vector", "streets-navigation-vector"
        })
    });
    // const legendWidget = new Legend({
    //   view: view,
    //   container: document.getElementById("infoDiv"),
    // });
    const legendExpand = new Expand({
        view: view,
        content: document.getElementById("infoDiv"),
        expanded: true,
        expandIconClass: "esri-icon-notice-round"
    });
    const sliderWidget = new Slider({
        label: "Change scenario",
        min: 1,
        // max: 15,
        max: 6,
        values: [1],
        container: document.getElementById("sliderDiv"),
        rangeLabelsVisible: true,
        snapOnClickEnabled: true,
        labelsVisible: true,
        tickConfigs: [{
            mode: "position",
            // values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
            values: [1,2,3,4,5,6],
            labelsVisible: true
        }],
        precision: 0,
        layout: "vertical"
    });

    // Add widgets to the current view
    view.ui.add(locateWidget, "top-left");
    view.ui.add(homeWidget, "top-left");
    view.ui.add(lyrExpand, "top-left");
    view.ui.add(searchWidget, "top-right");
    view.ui.add(sliderWidget, "bottom-left")
    view.ui.add(basemapWidget, "bottom-right");
    view.ui.add(legendExpand, "top-right")

    // Add/remove map layer based on slider value ... works, but slow ..
    // sliderWidget.on("thumb-drag", function(event) {
    //   newLayerID = event.value;
    //   console.log(newLayerID);
    //   let newLayer = new FeatureLayer({
    //     url:  layerBase+newLayerID
    //   })
    //   map.layers.remove(queryLayer);
    //   map.layers.add(newLayer);
    // })

    // Filter the layer based on slider value and change underlying vector tiles... better performance, 
    // requires layers to be dissolved by an attribute, eg. ScenarioID
    sliderWidget.on("thumb-drag", function(event) {
        console.log(event.value);
        // Filter the query layer by slider value
        let qry = "ScenarioID = " + event.value;
        queryLayer.definitionExpression = qry;

        // Change the tile layer by slider value
        map.layers.remove(tileLayer);        
        newLayerID = event.value;
        tileLayer = new VectorTileLayer({
        url:  vectorTileLayers[newLayerID]
        })
        map.layers.add(tileLayer);

        // tileLayer.url = vectorTileLayers[event.value];

        // Display a loading symbol
        document.getElementById("loading").style = "display: block"
        setTimeout(function(){ 
        document.getElementById("loading").style = "display: none"; 
        }, 800);
        
    });
    
    // Display the loading indicator when the view is updating
    // let refreshIndicator = document.getElementById("loading");
    // watchUtils.whenTrue(view, "updating", function(evt) {
    //   //refreshIndicator.show();
    //   refreshIndicator.style = "display: initial";
    // });
    // // Hide the loading indicator when the view stops updating
    // watchUtils.whenFalse(view, "updating", function(evt) {
    //   // refreshIndicator.hide();
    //   refreshIndicator.style = "display: none";
    // });
    

    splashContent = "Welcome to the official website for the West Coast Civil Defence & Emergency Management (CDEM) Group Tsunami Evacuation Zones geospatial viewer. West Coast CDEM Group does not warrant its accuracy and disclaims all liability whatsoever for any error, inaccuracy or incompleteness of the information. No person should rely on any information within this viewer without seeking independent and professional advice.<br/><br/>"+
    "The following terms along with the disclaimer and privacy policy serve as the agreement governing the visitors use of this website that may also be referred to as ‘the site’. The parties to this agreement include and are limited to the West Coast Civil Defence & Emergency Management Group which we may refer to as “we” or “us” or “our” and the visitor to the site, who we may refer to as ‘you’.<br/><br/>"+
    "<strong>Website Contents & Terms of Use Information</strong><br/><br/>"+
    "We hope that this website provides you with the information that you require on the West Coast Tsunami Evacuation Zones and the Tsunami Evacuation information and messaging.<br/><br/>"+
    "This West Coast Tsunami Evacuation Zones geospatial viewer has been prepared by the West Coast Civil Defence & Emergency Management (CDEM) Group. This has been provided to the West Coast CDEM Coordinating Executive Group (CEG) as well as all other partner organisations and agencies for use in tsunami response and recovery planning, as well as the community for a better understanding of the tsunami evacuation zones and to be used in personal evacuation planning.<br/><br/>"+
    "The West Coast Tsunami Evacuation Zones are to be used only in tsunami response and recovery planning and in defining areas where people should be evacuated from and areas where people can evacuate to. It is important to recognise that the evacuation zones are not tsunami hazard zones, tsunami risk zones, or tsunami inundation zones. They are areas that we recommend people evacuate from as a precaution after natural warnings, or in an official tsunami warning.<br/><br/>"+
    "The West Coast CDEM Group are in the process of upgrading these evacuation zones as there are many uncertainties involved including knowledge of potential tsunami sources, source characteristics, bathymetry and topography, tsunami propagation and inundation characteristics. For these reasons the data provided cannot be relied on for any reason other response and recovery planning.<br/><br/>"+
    "All viewers of these zones need to be aware that the New Zealand Coastal Policy Statement (Department of Conservation 2010) sets out national policy under the Resource Management Act 1991 (RMA) for managing areas potentially affected by coastal hazards, which includes the potential effects of tsunami, and how to avoid or mitigate them. However other than evacuation planning, the current West Coast Evacuation Zones supplied by the West Coast CDEM Group cannot be used for any other purpose such as requirements for subdivision, development, land-use and tsunami risk assessment.<br/><br/>"+
    "Additional to the inaccuracy and uncertainty of the provided zones, there is a lot of uncertainty around how tsunamis will behave, particularly large tsunamis, as we have not experienced many of these in our short-written history. Every tsunami is different depending on its source, the direction it is arriving from, and the sea state and tide at the time. There is no one tsunami that would inundate an entire zone. Rather, the zones represent an ‘envelope’ around many different possible tsunami scenarios. Inevitably this will lead to some degree of over-evacuation in any tsunami event. <br/><br/>"+
    "Should you have questions please contact the West Coast CDEM Group at info@westcoastemergency.govt.nz .<br/><br/>"+
    "Last updated: 18th November 2019";

    const splash = new Dialog({
        title: "Introduction & Disclaimer",
        content: splashContent,
        style: "width: 600px"
    })
    //window.onload = splash.show();

    });
