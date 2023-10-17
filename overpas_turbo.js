// this document is a guide to use overpass turbo website and overpass api to query data from openstreetmap.org
// the query at the bottom is used to get the data from https://overpass-turbo.eu/# and download it in a geojson file.

// usefui links:
// https://taginfo.openstreetmap.org for info about openstreetmap tags. used to explore tags and see how many of each tag are on openstreetmap.
// https://openstreetmap.org to explore missing data using the question mark tool. When you know of a SPA you can query the map where you woudl expect it. This can help find missing relavent tags.
// https://overpass-turbo.eu/# to query data from openstreetmap.org

// query info for overpass turbo. 
"https://overpass-turbo.eu/"

// al categories below could be any of those geometries types:
node, way, relation // for simplicity, we will use only node type in this example.


// identifiede categories with the aproximat numbers:
node["amenity"="spa"];          // 688      // https://taginfo.openstreetmap.org/tags/amenity=spa#overview
node["amenity"="SPA"];          // 2
node["amenity"="spa_resort"];   // 4
node["amenity"="sauna"];        // 1
node["amenity"="massage"];      // 6
node["amenity"="hammam"];       // 3

node["bath:type"="thermal"];    // 803
node["bath:type"="onsen"];      // 659
node["bath:type"="hot_spring"]; // 421
node["bath:type"="lake"];       // 280
node["bath:type"="foot_bath"];  // 13
node["bath:type"="hammam"];     // 12

node["natural"="hot_spring"];   // 5179    // https://taginfo.openstreetmap.org/tags/natural=hot_spring#overview

node["leisure"="spa"];          // 330     // https://taginfo.openstreetmap.org/tags/leisure=spa#overview
node["leisure"="sauna"];        // 15222   // https://taginfo.openstreetmap.org/tags/leisure=sauna#overview
node["leisure"="hot_spring"];   // 132     // https://taginfo.openstreetmap.org/tags/leisure=hot_spring#overview

node["tourism"="spa_resort"];   // 126     // https://taginfo.openstreetmap.org/tags/tourism=spa_resort#overview
node["tourism"="spa"];          // 6
node["tourism"="Spa␣town"];     // 9
node["tourism"="sauna"];        // 2

node["spa"]["spa"!="no"]; // 275   // query part for: “spa=*” exept spa=no  - https://taginfo.openstreetmap.org/keys/spa#values --> 275



// Complete query code for overpas turbo website:
    // Loaded – nodes: 90046, ways: 8976, relations: 122
    // Displayed – pois: 14978, lines: 29, polygons: 8694

[out:json][timeout:300];
(
    node["amenity"="spa"];
    way["amenity"="spa"];
    relation["amenity"="spa"];

    node["bath:type"="thermal"];
    way["bath:type"="thermal"];
    relation["bath:type"="thermal"];

    node["bath:type"="onsen"];
    way["bath:type"="onsen"];
    relation["bath:type"="onsen"];

    node["bath:type"="hot_spring"];
    way["bath:type"="hot_spring"];
    relation["bath:type"="hot_spring"];

    node["natural"="hot_spring"];
    way["natural"="hot_spring"];
    relation["natural"="hot_spring"];

    node["leisure"="spa"];
    way["leisure"="spa"];
    relation["leisure"="spa"];

    node["leisure"="sauna"];
    way["leisure"="sauna"];
    relation["leisure"="sauna"];

    node["leisure"="hot_spring"];
    way["leisure"="hot_spring"];
    relation["leisure"="hot_spring"];

    node["tourism"="spa_resort"];
    way["tourism"="spa_resort"];
    relation["tourism"="spa_resort"];

    node["spa"]["spa"!="no"];
    way["spa"]["spa"!="no"];
    relation["spa"]["spa"!="no"];
);
out body;
>;
out skel qt;



// exemple query code for overpas turbo website:
    [out:json][timeout:300];
    (
        node["amenity"="public_bath"]["bath:type"="thermal"];
        way["amenity"="public_bath"]["bath:type"="thermal"];
        relation["amenity"="public_bath"]["bath:type"="thermal"];
    );
    out body;
    >;
    out skel qt;





// the following terminal command will download the result of the query in a json file:

curl -X POST -d '
[out:json];
(
    node["leisure"="sauna"];
    way["leisure"="sauna"];
    relation["leisure"="sauna"];

    node["spa"]["spa"!="no"];
    way["spa"]["spa"!="no"];
    relation["spa"]["spa"!="no"];

    node["tourism"="spa_resort"];
    way["tourism"="spa_resort"];
    relation["tourism"="spa_resort"];

    node["leisure"="hot_spring"];
    way["leisure"="hot_spring"];
    relation["leisure"="hot_spring"];

    node["leisure"="sauna"];
    way["leisure"="sauna"];
    relation["leisure"="sauna"];

    node["leisure"="spa"];
    way["leisure"="spa"];
    relation["leisure"="spa"];

    node["natural"="hot_spring"];
    way["natural"="hot_spring"];
    relation["natural"="hot_spring"];

    node["bath:type"="hot_spring"];
    way["bath:type"="hot_spring"];
    relation["bath:type"="hot_spring"];

    node["bath:type"="onsen"];
    way["bath:type"="onsen"];
    relation["bath:type"="onsen"];

    node["bath:type"="thermal"];
    way["bath:type"="thermal"];
    relation["bath:type"="thermal"];

);
out body;
' http://overpass-api.de/api/interpreter -o output_bath_type_thermal.json
