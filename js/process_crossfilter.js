
var cf_exports;
var cf_dim_date;
var cf_dim_country;
country_map = d3.map();

var fn_initial_crossfilter = function(fn_callback) {
	// initialises crossfilter with data read from disk
//	cf_exports = crossfilter(gExports);
//	cf_dim_date = cf_exports.dimension(function(d) { return d.date; });
//	cf_dim_country = cf_exports.dimension(function(d) { return d.country; });


	cf_exports_all = crossfilter(g_all_country_long);
	cf_dim_date = cf_exports_all.dimension(function(d) { return d.date; });
	cf_dim_country = cf_exports_all.dimension(function(d) { return d.country; });



	fn_callback(null, "initialised crossfilter");
};





 fn_set_date = function(l_dte_from, l_dte_to) {
	// creates a date filter

	cf_dim_date.filterFunction(function(d) { 
		return d >=  l_dte_from && d <= l_dte_to; 
	});

	arr_date_filt = cf_dim_date.top(Infinity);


	cf_date_filt = crossfilter(arr_date_filt);

	
	dim_cunt = cf_date_filt.dimension(function(d) {return d.country;});

	// console.time('someFunction');
	// dim_cunt.filterExact("Australia");
	// arr_cunt = dim_cunt.top(Infinity);
	// arr_cunt_sort = arr_cunt.sort(function(a, b) { return  a.date - b.date; });
	// console.timeEnd('someFunction');



};

fn_create_array_from_country = function(str_country) {
//	console.time('new');
	dim_cunt.filterExact(str_country);
	arr_cunt = dim_cunt.top(Infinity);
	arr_new_data = arr_cunt.sort(function(a, b) { return  a.date - b.date; });
//	console.timeEnd('new');
//	console.log(arr_new_data);
};


fn_tester = function()  {
	fn_set_date(new Date(2005, 0, 31),  new Date(2008, 0, 31));
	fn_create_array_from_country("China");
		aus_test_update();
};





var fn_process_cf_data = function() {
	// assumes cf initilised and date filter is set
	// var country_measure = cf_dim_country
	// 						.group()
	// 						.reduceSum(function(fact) { return fact.total; });

	// arr_return = cf_dim_date.group().reduceSum(function(fact) {return fact.total;} ).top(Infinity);

	 // return country_measure.top(Infinity);
	// return arr_return;
};



//   	fn_create_array_from_country("Italy");

//  	fn_create_array_from_country("China");
//		aus_test_update();




//   	g_aust = arr_cunt_sort;

//		aus_test(null);


// cf_dim_date.group().reduceSum(function(fact) {return fact.total;} ).top(Infinity);



var fn_cf_wrapper = function(l_dte_from, l_dte_to, fn_callback) {
	// setting the date filter here.
	fn_set_date(l_dte_from, l_dte_to);
	console.log(l_dte_from, l_dte_to);
	fn_create_array_from_country("Australia");
	
	console.log("called on startttttttt.....?");
	// currently returns the total of all countries for the date specified
//	arr_return =  fn_process_cf_data();
	//console.log(arr_return);

	//s_obj = arr_return.map(function(d) { return {key: d.key, value: d.value};});
	//s_obj.map(function(d) { country_map.set(d.key, +d.value);});

	if (fn_callback !== null) {
		fn_callback(null, "set initial values for crossfilter");
	}



//	 aa =  country_map.get("Australia");
//	console.log(aa);


	//console.log(s_keys);
	// console.log(arr_return.map(function(d) {return d.key;}));
	// console.log(arr_return.map(function(d) {return d.value;}));
};







