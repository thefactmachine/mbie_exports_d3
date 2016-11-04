
var p_trade_date = d3.timeParse("%Y-%m-%d");


fn_wide = function(d, i, columns) { 
	d.date = p_trade_date(d.date);
	for (var itr = 1, n = columns.length; itr < n; ++itr)  { 
			d[columns[itr]] = parseInt(d[columns[itr]]);
	}
	return d;
};



var fn_parse_long = function(row_data) {
	row_data.date = p_trade_date(row_data.date);
	row_data.country = row_data.country;
	row_data.total = +row_data.total;
	row_data.short = row_data.short;
	return row_data;

};




// =============================================================


var fn_load_continent = function(fn_callback) {
	d3.csv("../data/date_regions_new.csv", fn_wide, function(error, data) {
		if (error) throw error;
		g_m_continent = data;
		fn_callback(null, "loaded continent");
	});
}; // fn_load_continent()



var fn_load_monthly_by_country = function(fn_callback) {
	d3.csv("../data/monthly_by_country.csv", fn_parse_long, function(error, data) {
		if (error) throw error;
		gExports = data;
		fn_callback(null, "loaded monthly by country");
	});
};


var fn_load_accum_country_by_month = function(fn_callback) {
	d3.csv("../data/df_month_country_wide.csv", fn_wide, function(error, data) {
		if (error) throw error;
		g_wide = data;
		fn_callback(null, "loaded accumulated country by month");
	});
};


var finished = function(error, results) {
	for (i = 0; i < results.length; i++) {
	   console.log(results[i]);
	}
};


d3.queue(1)
	.defer(fn_load_continent)
	.defer(fn_load_monthly_by_country)
	.defer(fn_load_accum_country_by_month)
	.defer(fn_initial_crossfilter)
	.defer(fn_cf_wrapper, new Date(2000, 0, 31), new Date(2015, 11, 31))
	.defer(fn_process_wide)
	.defer(stack_area_fun.initial_area)
	.defer(fn_brush_geometry)
	.defer(fn_load_map)
	.defer(fn_initialise_brush)
.awaitAll(finished);


