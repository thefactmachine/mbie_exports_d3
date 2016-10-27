var origins = [],
    geoJSON = {
        "type": "FeatureCollection",
        "features": []
    };

queue(1)
    .defer(function(url, callback) {
        d3.csv(url, function(error, csvData) {
            if(!error) csvData.forEach(function(d) {origins.push(d.o_geoid)});
            callback(error, d);
        })
    }, "path_to.csv")
    .defer(function(url, callback) {
        d3.json(url, function(error, jsonData) {
            // Limit GeoJSON features to those in CSV
            for(var i = jsonData.features.length - 1; !error && i >= 0; i--) {
                if($.inArray(jsonData.features[i].properties['GEOID10'], origins) != -1) {
                    geoJSON.features.push(jsonData.features[i]);
                }
            }
            callback(error, jsonData);
        })
    }, "path_to.json")
    .await(ready);

function ready(error) {
    console.log(error ? "error: " + error.responseText : geoJSON);
}