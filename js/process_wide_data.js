function fn_process_wide(fn_callback) {
//	console.log("running process wide");
	new_arr = [];
	var p_trade_date = d3.timeParse("%Y-%m-%d");

	for(i = 0; i < g_wide.length; i++) {
		obj = g_wide[i];
		country_obj = {};
		comp_obj = {};
		for (var key in obj) {
			if( obj.hasOwnProperty(key)  )  {
				if (key != "date") {
				country_obj[key] = +obj[key];
				}
				else {
					c_date = p_trade_date(obj.date);
				}
			}
		} // key in obj
		comp_obj.date = c_date;
		comp_obj.countries = country_obj;
		new_arr.push(comp_obj);
	}

	/// get an array of countries...will be useful for other
	//// stuff.
	obj_countries = new_arr[0].countries;
	country_keys = [];
	for(var k in obj_countries)  {
		country_keys.push(k);

	}
	// the reason for this hack needs to be hunted down....
//	country_keys = country_keys.splice(0, country_keys.length-1);


	/// ASSERT country_keys is in the same order
	/// as the objects below....


	// create the map: the key is a date (there are 192) a
	// the value is an object of countries (length 221)
	cum_total_map = d3.map();
	new_arr.map(function(d) {cum_total_map.set(d.date, d.countries);});

// country_keys.map(function(d) {console.log(d);});



	aa6 = 
	[
	"rgb(255,255,204)",
	"rgb(217,240,163)",
	"rgb(173,221,142)",
	"rgb(120,198,121)",
	"rgb(49,163,84)",
	"rgb(0,104,55)"
	];

	aar_thresholds = [0.1, 0.2, 0.4, 0.6, 0.8];
	str_blank_colour = "rgb(240,240,240)";
	
	q_thold = d3.scaleThreshold().range(aa6);
	fn_callback(null, "processed wide data");

} // fn_process_wide











function fn_generate_map_colors(l_date_start, l_date_end) {
	
	function fn_assign_colors(bln_data_issues, index)  {
		var str_colour;

		if (bln_data_issues) { str_colour = str_blank_colour;} 
		else {
			// start_value AND end_value are not zero...so lookup color
			str_colour = q_thold(arr_diffs[index]);		
		} // else start AND end are not zero
		var str_country = country_keys[index];
		return[str_country, str_colour];
	}

	// starting values for countries returns object: Object.keys(obj_start).length == 221
	obj_start = cum_total_map.get(l_date_start);
	// finishing values for countries returns object: Object.keys(obj_end).length == 221
	obj_end = cum_total_map.get(l_date_end);
	// creates an array of differences..these will all be positive length 221. 
	arr_diffs = country_keys.map(function(d) {return (obj_end[d]- obj_start[d]);}).sort(d3.ascending);
	
	//console.log(arr_diffs);
	

	//test = arr_diffs.sort(function(a, b) {return a - b;});
	

	// length 221
	arr_bools = country_keys.map(function(d) {return (obj_end[d] === 0 && obj_start[d] === 0);});
	arr_t_holds = aar_thresholds.map(function(d){ return d3.quantile(arr_diffs, d);});
	
	q_thold.domain(arr_t_holds);
	// now we cycle through an array of length 221 and use the index numbers as appropriate
	
	arr_result_col = arr_bools.map(function(d, i) {return fn_assign_colors(d, i); });
	
	obj_res = {};
	

	for(i = 0; i < arr_result_col.length; i++) {
		obj_res[arr_result_col[i][0]] = arr_result_col[i][1];
	}


	return obj_res;
}


//  fn_generate_map_colors(new Date(2004, 0, 31), new Date(2013, 12, 31));




