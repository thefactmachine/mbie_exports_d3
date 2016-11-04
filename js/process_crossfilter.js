
var cf_exports;
var cf_dim_date;
var cf_dim_country;
country_map = d3.map();

var fn_initial_crossfilter = function(fn_callback) {
	// initialises crossfilter with data read from disk
	cf_exports = crossfilter(gExports);
	cf_dim_date = cf_exports.dimension(function(d) { return d.date; });
	cf_dim_country = cf_exports.dimension(function(d) { return d.country; });
	fn_callback(null, "initialised crossfilter");
};


var fn_set_date = function(l_dte_from, l_dte_to) {
	// creates a date filter
	cf_dim_date.filterFunction(function(d) { 
		return d >=  l_dte_from && d <= l_dte_to; 
	});

};


var fn_process_cf_data = function() {
	// assumes cf initilised and date filter is set
	var country_measure = cf_dim_country
							.group()
							.reduceSum(function(fact) { return fact.total; });

	return country_measure.top(Infinity);
};


var fn_cf_wrapper = function(l_dte_from, l_dte_to, fn_callback) {
	fn_set_date(l_dte_from, l_dte_to);
	arr_return =  fn_process_cf_data();

	s_obj = arr_return.map(function(d) { return {key: d.key, value: d.value};});
	s_obj.map(function(d) { country_map.set(d.key, +d.value);});
	fn_callback(null, "set initial values for crossfilter");
//	console.log("from " + l_dte_from + " to " + l_dte_to);

//	console.log(country_map.keys());
//	console.log(country_map.values());

	//  country_map.get("Australia")
	


	//console.log(s_keys);
	// console.log(arr_return.map(function(d) {return d.key;}));
	// console.log(arr_return.map(function(d) {return d.value;}));
};