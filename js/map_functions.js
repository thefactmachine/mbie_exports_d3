
var svg_map = d3.select("#svg_map");
var centered;

var width = d3.select("#svg_map").attr("width");
var height = d3.select("#svg_map").attr("height");
var upper_left = [0,0];
var lower_right = [width, height];
var default_bounds = [upper_left, lower_right];

focus = svg_map.append("g");

svg_map.append("g").attr("id", "aus_test_g");



var fn_c_colour = function(l_name) {
	var str_curr_col;
	if (obj_res[l_name] === undefined) {
	str_curr_col = "rgb(240,240,240)";
	}
	else {
	str_curr_col = obj_res[l_name];
	}
	return str_curr_col;
};


var fn_l_graph_placement = function(l_arr)  {
	// couple of issues here:
	// d3 draws the svg at where the y axis is
	// so need to calculate the width of the ticks
	// also the svg world map has a margin of 50 units.
	// although when I use the ruler...this became 68.

//	console.log(l_arr[0]);
	var line_graph_width = 270;
	// this amount is defined in au_test
	var margin = 35.5;
	var horiz_padding = 20;
	var left_x = l_arr[0][0];
	var right_x = l_arr[1][0];
	var top_y = l_arr[0][1];
	var bottom_y = l_arr[1][1];

	
	var graph_left_side;
	var graph_top_side;
	
	// if the left top corner is less than 380
	// this takes care of horizontal placement
	if (left_x < 380 && left_x > 0 ) {
		graph_left_side =  right_x + margin + horiz_padding;
	}

	// hack for russia
	else if (left_x < 0) {
		graph_left_side = 400;
	}
	
	else {
		// left_x is the extent; margin is the inset from side; padding is some arbitrary space
		graph_left_side = left_x - line_graph_width + margin - horiz_padding;
	}


	if (bottom_y < 300) {
		graph_top_side = bottom_y;

	}

	else {
		graph_top_side = bottom_y - 136;

	}



	

	console.log("bottom_y  " + bottom_y);

	console.log("left  " + left_x);
	console.log("right  " + right_x);
	console.log("computed left in funct  " + graph_left_side);

	return [graph_left_side, graph_top_side];


};


var timer;




function fn_load_map(fn_callback) {
	d3.json("../data/custom_simple_geo.json", function(geo_data){
		glb_geo_data = geo_data;
		var projection = d3.geoMercator()
	    .scale(145)
	    .translate([453, 418]);
		geo_path = d3.geoPath()
		    .projection(projection);


		focus.attr("class", "world_map");





		focus	
		.selectAll("path")
			.data(glb_geo_data.features)
		.enter().append("path")
		.attr("stroke", "rgb(140,140,140)")
		.attr('vector-effect', 'non-scaling-stroke')
		.attr("stroke-width", "1")
		.attr("fill", function(d)  {return fn_c_colour(d.properties.name);})
		
		.on("mouseover", function(d)  {
				var x_p = d3.mouse(this)[0];
				var y_p = d3.mouse(this)[1] - 30;
				d3.select(this).attr("fill", "#ff0033");		
				// this re-calculates arr_new_data
				fn_create_array_from_country(d.properties.name);
				arr_pos = fn_l_graph_placement(geo_path.bounds(d));
				aus_test_update(arr_pos[0], arr_pos[1], d.properties.name);
				clearTimeout(timer);

		})

		.on("mouseleave", function(d) {
			d3.select(this).attr("fill", function(d)  { return fn_c_colour(d.properties.name);});
			d3.select("#tooltip").remove();
			timer = setTimeout(function() {fn_invisible();}, 500);

			//fn_invisible() ;

		})
		.on("click", fn_clicked)
		.on("dblclick", fn_double_click)
		.attr("d", geo_path);
	});
	fn_callback(null, "loaded map");

} //load map


function fn_compute_tx(l_bounds, l_type) {
	var dx = l_bounds[1][0] - l_bounds[0][0];
	var dy = l_bounds[1][1] - l_bounds[0][1];
	var x = (l_bounds[0][0] + l_bounds[1][0]) / 2;
	var y = (l_bounds[0][1] + l_bounds[1][1]) / 2;

	var width = d3.select("#svg_map").attr("width");
	var height = d3.select("#svg_map").attr("height");
	if (l_type !== "zoom") {scaler = 1;} else {scaler = 0.5;}

	var scale = scaler / Math.max(dx / width, dy / height);
	var translate = [width / 2 - scale * x, height / 2 - scale * y];
	var rtn_obj = {};
	var str_scale = "scale";
	var str_translate = "translate";

	rtn_obj[str_scale] = scale;
	rtn_obj[str_translate] = translate;
	return rtn_obj;

}




function fn_clicked(d) {
	var obj_recompute;
	
	// if clicked on a different polygon to one selected
	if ( centered !== d) {
		console.log("zoom in");
		centered = d;
		obj_recompute = fn_compute_tx(geo_path.bounds(d), "zoom");
	}
	
	// if clicked the SAME polygon as selected
	else {
		centered = null;
		console.log("zoom out");
		obj_recompute = fn_compute_tx(default_bounds, "out");
	}
	
	
     focus
     .transition()
     .duration(300)
     .attr("transform", "translate(" + obj_recompute.translate + 
     	")scale(" + obj_recompute.scale + ")");

}




function fn_double_click(d)  {
	console.log("double_click");
	var width = d3.select("#svg_map").attr("width");
	var height = d3.select("#svg_map").attr("height");
	var upper_left = [0,0];
	var lower_right = [width, height];
	var z_bounds = [upper_left, lower_right];

	var obj_recompute = fn_compute_tx(z_bounds);


	console.log(obj_recompute);

     focus.attr("transform", "translate(" + obj_recompute.translate + 
     	")scale(" + obj_recompute.scale + ")");


}





function fn_update_map()  {
	 	//q_z.domain(country_map.values());
		d3.selectAll("#svg_map .world_map path")
		.each(function(d, i) {
  		
  		//	console.log(d);
			d3.select(this).attr("fill", fn_c_colour(d.properties.name));
  
		});
} // fn_update_map


