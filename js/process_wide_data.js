function fn_process_wide(fn_callback) {
	//
	new_arr = [];
	var p_trade_date = d3.timeParse("%Y-%m-%d");
	
	// iterate through each of the months (192)
	for(i = 0; i < g_wide_accum.length; i++) {
		// this is the current month
		obj = g_wide_accum[i];
		var country_obj = {};
		
		// iterate through each object (length 221)
		for (var key in obj) {
			if( obj.hasOwnProperty(key)  )  {
				if (key !== "date") {
				country_obj[key] = +obj[key];
				}
				else {c_date = obj.date;}
			} // has a property key
		} // for key in obj
		
		comp_obj = {};
		comp_obj.date = c_date;
		comp_obj.countries = country_obj;
		// add a new object onto the array
		new_arr.push(comp_obj);
	} // for each month

	

	/// get an array of countries...will be useful for other
	//// stuff.


	obj_countries = new_arr[0].countries;
	arr_countries = Object.keys(obj_countries);
	// country_keys = [];
	// for(var k in obj_countries)  {
	// 	country_keys.push(k);

	// }

	cum_total_map = d3.map();
	new_arr.map(function(d) {cum_total_map.set(d.date, d.countries);});

// country_keys.map(function(d) {console.log(d);});



	aa6a = 
	[
	"rgb(255,255,204)",
	"rgb(217,240,163)",
	"rgb(173,221,142)",
	"rgb(120,198,121)",
	"rgb(49,163,84)",
	"rgb(0,104,55)"
	];


aa6 = ["rgb(255,255,204)","rgb(217,240,163)","rgb(173,221,142)",
"rgb(120,198,121)","rgb(65,171,93)","rgb(35,132,67)","rgb(0,90,50)"];

	// aar_thresholdsA = [0.1, 0.2, 0.4, 0.6, 0.8];
	aar_thresholds = [0.2, 0.4, 0.6, 0.8, 0.9, 0.97];
	str_blank_colour = "rgb(240,240,240)";
	
	q_thold = d3.scaleThreshold().range(aa6);
	fn_callback(null, "processed wide data");

} // fn_process_wide





function fn_generate_map_colors(l_date_start, l_date_end) {
	 // console.time('someFunction');
	
	function fn_assign_colors(l_str_country)  {
		// check to see if calculating a colour is worthwhile
		var str_colour;
		var bln_invalid = obj_start[l_str_country] === 0 && obj_end[l_str_country] === 0;
		var diff = obj_end[l_str_country] - obj_start[l_str_country];

		if (bln_invalid) {
			str_colour = str_blank_colour;
		}
		else {
			str_colour = q_thold(diff);
		}
				
		return [l_str_country, str_colour];

	}

	// starting values for countries returns object: Object.keys(obj_start).length == 221
	obj_start = cum_total_map.get(l_date_start);

	// finishing values for countries returns object: Object.keys(obj_end).length == 221
	obj_end = cum_total_map.get(l_date_end);
	
	// creates an array of differences. They need to be sorted for the quantile function
	arr_diffs = arr_countries.map(function(d) {return (obj_end[d]- obj_start[d]);}).sort(d3.ascending);
	
	// cycle through the pre-defined arr_t_holds (above)
	arr_t_holds = aar_thresholds.map(function(d){ return d3.quantile(arr_diffs, d);});
	
	// set the domain for the scale.
	q_thold.domain(arr_t_holds);

	// result here is in the same order as arr_countries
	arr_result_col = arr_countries.map(function(d) {return fn_assign_colors(d);});


	obj_res = {};

	
	for(i = 0; i < arr_result_col.length; i++) {
		obj_res[arr_result_col[i][0]] = arr_result_col[i][1];
	}

	return obj_res;

	// return obj_res;
	// console.timeEnd('someFunction');
}


//  fn_generate_map_colors(new Date(2004, 0, 31), new Date(2013, 12, 31));




