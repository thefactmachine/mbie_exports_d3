
var cf_exports;
var cf_dim_date;
var cf_dim_country;

var fn_initial_crossfilter = function() {
	// initialises crossfilter with data read from disk
	cf_exports = crossfilter(gExports);
	cf_dim_date = cf_exports.dimension(function(d) { return d.date; });
	cf_dim_country = cf_exports.dimension(function(d) { return d.country; });
	console.log("loaded crossfilter");
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

	return country_measure.top(10);
};


var fn_cf_wrapper = function(l_dte_from, l_dte_to) {
	fn_set_date(l_dte_from, l_dte_to);
	var arr_return =  fn_process_cf_data();
	console.log(arr_return.map(function(d) {return d.key;}));
	console.log(arr_return.map(function(d) {return d.value;}));
};