var stack_area_fun = (function() {
	

	var svg_area_stack = d3.select("svg#svg_new_area");
	var area_margin_stack = {top: 10, right: 0, bottom: 18, left: 50};
	// extract the value of the svg element and use it.
	
	var area_width_stack = +svg_area_stack.attr("width") - area_margin_stack.left - area_margin_stack.right;
	var area_height_stack = +svg_area_stack.attr("height") - area_margin_stack.top - area_margin_stack.bottom;
	
	
	// SCALES
	var  x_area_stack = d3.scaleTime().range([0, area_width_stack]);
	var  y_area_stack = d3.scaleLinear().range([area_height_stack, 0]);
	var  z_area_stack = d3.scaleOrdinal(d3.schemeCategory20c);


	
	var xAxis_area_stack = d3.axisBottom(x_area_stack);
		
	var area_stack = d3.area()
	.curve(d3.curveMonotoneX)
		.x(function(d, i) { return x_area_stack(d.data.date); })
		.y0(function(d) { return y_area_stack(d[0]); })
		.y1(function(d) { return y_area_stack(d[1]);});
	
	// this is the main <g> element. 
	var focus_area_stack = svg_area_stack.append("g")
			.attr("id", "group_area_stack")
			.attr("transform", "translate(" + area_margin_stack.left + 
					"," + area_margin_stack.top + ")");


	var arr_continent_keys;
	y_area_stack.domain([0, 5032540734]);
	var stack = d3.stack();


	return {
		update_graph :function(l_dte_lower, l_dte_upper, l_obj_array) {
			//console.log("in here -- update graph " + l_dte_lower + "   " + l_dte_upper);
			// C'est la préparation
			arr_data = this.fn_filter_date(l_dte_lower, l_dte_upper, l_obj_array);
			stack_update_data = stack(arr_data);
			x_area_stack.domain([l_dte_lower, l_dte_upper]);
			

			d3.selectAll("#svg_new_area g .layer")
				.data(stack_update_data)
				.attr("class", "layer")
				.style("fill", function(d, i) {return z_area_stack(i); })
				.attr("d", area_stack);

			
			focus_area_stack.select(".axis--x").call(xAxis_area_stack);



		}, // update_graph (notice the comma)

		fn_filter_date : function(l_dte_lower, l_dte_upper, l_obj_array) {
			return(l_obj_array.filter(function(d) {
					return d.date >= l_dte_lower && d.date <= l_dte_upper; }));

		}, // fn_filter_data (Beachten Sie das Komma)
		

		initial_area: function(fn_callback) {		
			// axis label
			focus_area_stack.append("g")
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 135)
			.attr("dy", "0.71em")
			.attr("text-anchor", "end")
			.text("Export value");

			// prep le data
			arr_continent_keys = Object.keys(g_m_continent[0]).splice(1,5);
			console.log(arr_continent_keys);
   			stack.keys(arr_continent_keys);
    		stack_data = stack(g_m_continent);  		
    		z_area_stack.domain(arr_continent_keys);  		
    		x_area_stack.domain([new Date(2000, 0, 31), new Date(2015, 12, 31)]);

			// axis x axis
			focus_area_stack.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + area_height_stack + ")")
			.call(xAxis_area_stack);


			// this is the area data.
			d3.select("#svg_new_area g")
			.selectAll(".layer")
			.data(stack_data)
			.enter().append("path")
			.attr("class", "layer")
			.style("fill", function(d, i) {return z_area_stack(i); })
			.attr("d", area_stack);


			// axis y axis -- add this last so it does not cover the area graph.
			focus_area_stack.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y_area_stack)
			.ticks(10)
			.tickSize(2)
			.tickFormat(d3.formatPrefix("$,.0", 1e06)));

			fn_callback(null, "set initial values for area");

		} // initial_area

	}; // return

})(); // area_fun (and initialise it)
