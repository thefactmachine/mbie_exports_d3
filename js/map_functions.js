
var svg_map = d3.select("#svg_map");
var centered;

var width = d3.select("#svg_map").attr("width");
var height = d3.select("#svg_map").attr("height");
var upper_left = [0,0];
var lower_right = [width, height];
var default_bounds = [upper_left, lower_right];





function fn_map_mouse_over(x ,  y, txt)  {
	context = svg_map.append("text");
	context.attr("x", x);
	context.attr("y", y);
	context.attr("id", "tooltip");
	context.text(txt);
}



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





function fn_load_map(fn_callback) {
	d3.json("../data/custom_simple_geo.json", function(geo_data){
		glb_geo_data = geo_data;
		var projection = d3.geoMercator()
	    .scale(145)
	    .translate([453, 418]);
		geo_path = d3.geoPath()
		    .projection(projection);

		focus = svg_map.append("g")
			.attr("class", "world_map");
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
				fn_map_mouse_over(x_p, y_p, d.properties.name);



				fn_create_array_from_country(d.properties.name);
				aus_test_update();




		})

		.on("mouseleave", function(d) {
			d3.select(this).attr("fill", function(d)  { return fn_c_colour(d.properties.name);});
			d3.select("#tooltip").remove();

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
		d3.selectAll("#svg_map g path")
		.each(function(d, i) {
			d3.select(this).attr("fill", fn_c_colour(d.properties.name));
		});
} // fn_update_map


