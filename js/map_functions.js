var arr_col = ["rgb(229,245,249)","rgb(204,236,230)", 
				"rgb(153,216,201)","rgb(102,194,164)","rgb(65,174,118)",
				"rgb(35,139,69)"];

var blank_col = "rgb(255,255,255)";

var red_col = "rgb(255,0, 0)";
var	q_z = d3.scaleQuantile().domain(country_map.values()).range(arr_col);
var svg_map = d3.select("#svg_map");

function fn_calc_color(str_country_name) {
	var  r_val;
	if (country_map.has(str_country_name)) {
		r_val = q_z(country_map.get(str_country_name));
	}
	else {
		r_val = blank_col;
	}
	return  r_val;
} // fn_calc_color



function fn_map_mouse_over(x ,  y, txt)  {
	context = svg_map.append("text");
	context.attr("x", x);
	context.attr("y", y);
	context.attr("id", "tooltip");
	context.text(txt);
}




function fn_load_map(fn_callback) {
	d3.json("../data/custom_simple_geo.json", function(geo_data){
		glb_geo_data = geo_data;
		var projection = d3.geoMercator()
	    .scale(145)
	    .translate([453, 418]);
		var geo_path = d3.geoPath()
		    .projection(projection);

		svg_map.append("g")
			.attr("class", "world_map")
		//	.attr("fill", "rgb(0,240,240)")
		.selectAll("path")
			.data(glb_geo_data.features)
		.enter().append("path")
		.attr("stroke", "rgb(140,140,140)")
		.attr("stroke-width", "1")
		.attr("fill", function(d)  { return fn_calc_color(d.properties.name);})
		
		.on("mouseover", function(d)  {
				var x_p = d3.mouse(this)[0];
				var y_p = d3.mouse(this)[1] - 30;
				d3.select(this).attr("fill", "#ff0033");
				fn_map_mouse_over(x_p, y_p, d.properties.name);
		})

		.on("mouseleave", function(d) {
			d3.select(this).attr("fill", function(d)  { return fn_calc_color(d.properties.name);});
			d3.select("#tooltip").remove();

		})
		.attr("d", geo_path);
	});
	fn_callback(null, "loaded map");

} //load map

// function fn_update_map()  {
// 	 	q_z.domain(country_map.values());
// 		d3.selectAll("#svg_map g path")
// 		.each(function(d, i) {
// 			var elt = d3.select(this);	
// 			var prev_col = elt.attr("fill");
// 			var curr_col = fn_calc_color(d.properties.name);
			
// 			if (prev_col  != curr_col) {
// 				d3.select(this)
// 					.attr("fill", curr_col)
// 					.attr("stroke",red_col)
// 					.transition()
// 					.duration(2500)				
// 					.attr("stroke","rgb(140,140,140)");

// 			}
// 			else {
// 				d3.select(this)
// 					.attr("fill", prev_col)
// 					.attr("stroke","rgb(140,140,140)");
// 			}
// 		});
// } // fn_update_map



function fn_update_map()  {
	 	//q_z.domain(country_map.values());
		d3.selectAll("#svg_map g path")
		.each(function(d, i) {
			curr_name = d.properties.name;
			
			if (obj_res[curr_name] === undefined) {
				curr_col = "rgb(240,240,240)";
			}
			else {
				curr_col = obj_res[curr_name];
			}


		
		//	console.log(curr_name);
		//	console.log(curr_col);
			d3.select(this).attr("fill", curr_col);

		//	d3.select(this).attr("fill", obj_res.d.properties.name);
		//	console.log("this is d " + d.properties.name);
		//	console.log("this is i"  + i);			


		});
} // fn_update_map































