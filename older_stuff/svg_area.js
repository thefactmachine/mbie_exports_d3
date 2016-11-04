var area_fun = (function() {
	var svg_area = d3.select("svg#svg_area");
	var area_margin = {top: 10, right: 0, bottom: 18, left: 50};
	// extract the value of the svg element and use it.

	var area_width = +svg_area.attr("width") - area_margin.left - area_margin.right;

	var area_height = +svg_area.attr("height") - area_margin.top - area_margin.bottom;

	x_area = d3.scaleTime().rangeRound([0, area_width]);

	var y_area = d3.scaleLinear().rangeRound([area_height, 0]);

	var xAxis_area = d3.axisBottom(x_area);



	var area = d3.area()
	.curve(d3.curveMonotoneX)
	.x(function(d) { return x_area(d.date); })
	.y0(area_height)
	.y1(function(d) { return y_area(d.month_tot); });

	var focus_area = svg_area.append("g")
	.attr("id", "single_area")
	.attr("transform", "translate(" + area_margin.left + "," + area_margin.top + ")");

	
	return {
		update_graph :function(l_dte1, l_dte2, l_obj_array) {
		// following is only used inside fn_slice_object()
		
		var fn_event = function(arr_dates, l_new_data)  {
		// expects an array of two dates
			x_area.domain(arr_dates);
			focus_area.select(".area")
			.datum(l_new_data)
			.attr("d", area);
			focus_area.select(".axis--x").call(xAxis_area);

		}; // fn_event

		var new_arr = [];
		for (var i = 0; i < l_obj_array.length; i++) {
			if (l_obj_array[i].date >= l_dte1 &&  l_obj_array[i].date <= l_dte2 ) {
				new_arr.push(l_obj_array[i]);
			} // if
		} // for
		fn_event([l_dte1, l_dte2], new_arr);
		
		}, // update_graph (notice the comma)
		

		initial_area: function() {
			// frequency component
			focus_area.append("g")
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.attr("text-anchor", "end")
			.text("Export value");

			// define the y domain 
			y_area.domain([0, d3.max(gData, function(d) { return d.month_tot; })]);
			
			// now append a y axis
			focus_area.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y_area)
			.ticks(10)
			.tickSize(2)
			.tickFormat(d3.formatPrefix("$,.0", 1e06)));

			// define the x domain
			x_area.domain(d3.extent(gData, function(d) { return d.date; }));
			// append the x axis
			focus_area.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + area_height + ")")
			.call(xAxis_area);

			// append the area graph
			focus_area.append("path")
			.datum(gData)
			.attr("class", "area")
			.attr("d", area);
		
		} // initial_area

	}; // return

})(); // area_fun (and initialise it)








