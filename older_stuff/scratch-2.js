


var rateById = d3.map();
.defer(d3.tsv, "unemployment.tsv", function(d) { rateById.set(d.id, +d.rate); })


country_map = d3.map();


s_obj.map(function(d) { country_map.set(d.key, +d.value)})



	    .domain([new Date(2000, 0, 31), new Date(2015, 11, 31)])




fn_cf_wrapper(new Date(2000, 0, 31), new Date(2015, 11, 31));