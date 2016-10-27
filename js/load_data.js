
var csv_path_mt = "../data/monthly_totals.csv";
var csv_path_mbc = "../data/monthly_by_country.csv";


var fn_parse_m_by_c = function(row_data) {
	row_data.date = new Date(+row_data.date.substring(0,4), 
		+row_data.date.substring(5,7)-1, +row_data.date.substring(8,10));
	row_data.country = row_data.country;
	row_data.total = +row_data.total;
	row_data.short = row_data.short;
	return row_data;

};


var fn_parse_m_tot = function(row_data) {
	row_data.date = new Date(+row_data.date.substring(0,4), 
	+ row_data.date.substring(5,7)-1, +row_data.date.substring(8,10));
	row_data.month_tot = +row_data.month_tot;
	return row_data;
};


var finished = function(error, results) {
  // console.log(results);
   console.log("finished d3 queue");
};


////// we have this basically working /// -----------------

// the pattern for defer is .defer("fn_name", "arg")
// so the final part "}, url)" is this second argument


d3.queue(1)
	
	.defer(function(csv_path_mt, callback) { 
		d3.csv(csv_path_mt, function(data) {
		gData = data.map(function(d) { return fn_parse_m_tot(d);});
		callback(null, "hi there in first function");
		});

	}, csv_path_mt)


	.defer(function(csv_path_mbc, callback) { 
		d3.csv(csv_path_mbc, function(data) {
		gExports = data.map(function(d) { return fn_parse_m_by_c(d);});
		callback(null, "hi there in first function");
		});

	}, csv_path_mbc)


	.defer(function(fn_callback) {
		fn_initial_crossfilter();
		fn_callback(null, "hi there in second function");
	})


	.defer(function(fn_callback) {
		fn_cf_wrapper(new Date(2007, 0, 31), new Date(2007, 11, 31));
		fn_callback(null, "hi there in second function");
	})


	.defer(function(fn_callback) {
		area_fun.initial_area();
		fn_callback(null, "hi there in second function");
	})
	
	.defer(function(fn_callback) {
		fn_brush_geometry();
		fn_callback(null, "hi there in second function");
	})


	.defer(function(fn_callback) {
		fn_initialise_brush();
		fn_callback(null, "hi there in second function");
	})


	.await(finished);





// // three arguments to d3.csv
// d3.csv(
//  	csv_path_mbc, 
//  	function(d) { return fn_parse_m_by_c(d);},
// 	function(error, data) {
// 		if (error) throw error;
// 		 gExports = data;
// 	//	fn_initial_crossfilter();

// 		dte3 = new Date(2007, 0, 31);
// 		dte4 = new Date(2007, 11, 31);
// 	//	fn_cf_wrapper(dte3, dte4);

//     fn_cf_wrapper(new Date(2007, 0, 31), new Date(2007, 11, 31));

// });


		// d3.csv(csv_path_mbc, function(data) {
		// 	gddd = data.map(function(d) { return fn_parse_m_by_c(d);});
		// });


/// so there is a problem with brush..in.so far that it is rendered before the data is ready...
/// so it tries to call stuff in cross filter and the area graph before the data has been rendered.
//  see create_monthly_totals_web.R


// here https://www.safaribooksonline.com/blog/2013/09/06/reusable-d3-js-add-to-title/
// https://bost.ocks.org/mike/chart/
// https://bost.ocks.org/mike/chart/



// d3.csv(
// 	"../data/monthly_totals.csv", 
// 	function(d) { return fn_parse_m_tot(d);},
//     function(error, data) {
// 	if (error) throw error;
// 		gData = data;
// 		area_fun.initial_area();
// 		fn_brush_geometry();
// 		fn_initialise_brush();
// });

// d3.csv(csv_path, function(data) {
//	gData = data.map(function(d) { return fn_parse_m_tot(d);});
	//area_fun.initial_area();
	//	fn_brush_geometry();
	//fn_initialise_brush();
//});


// var fn_1 = function(i, callback) {
//   console.log("fn_ 1 called with this argument " +i);
//   // first argument is the error reason, second is the results
//   callback(null, "from function 1");
// };


// var queue = d3.queue();

// var url = "../data/monthly_totals.csv";