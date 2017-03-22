function fn_brush_geometry(fn_callback) {
	var brush_margin = {top: 20, right: 0, bottom: 0, left: 0};

	// var brush_width = 910;

	// global
	var brush_height = 30;

	var brush_l_offset = 0;

	var brush_handle_width = 8;

	var brush_width = 910 + brush_handle_width * 2;


	var x_brush = d3.scaleTime()
	    .domain([new Date(2000, 0, 31), new Date(2015, 11, 31)])
	    .rangeRound([0 + brush_handle_width, brush_width - brush_handle_width]);


	var svg_brush = d3.select("svg#svg_brush")
	    
		// the following overide what is defined in 
	    .attr("width", brush_width)
	    .attr("height", brush_height + brush_margin.top)
	    .on("load", fn_initialise_brush);

	var context_brush = svg_brush.append("g")
	    .attr("class", "context")
	    .attr("transform", "translate(" + brush_l_offset + "," + 0 + ")");


	// ====================================================
	// this is the grid -- the main rectangle of the brush.
	context_brush.append("g")
	    .attr("class", "axis axis--grid")
	    .attr("transform", "translate(0," + 0 + ")")
	    .call(d3.axisBottom(x_brush)
	    	// .ticks(d3.timeYear, 1) this puts the ticks every year.
	    	// .ticks(d3.timeMonth, 6) puts 2 ticks every year.
	      	.ticks(d3.timeMonth, 6)
	        .tickSize(brush_height)
	        // tickFormat specifies a number format such as 1000 is converted to 1 or 1,000
	        .tickFormat(function() { return null; }))
	    	.selectAll(".tick")
	    	.classed("tick--minor", 
	    		function(d) { 
	    			// d is a reference to the dates contained in the ticks above.
	    			// the d elements are all the first of the month.
	    			return (d.getMonth() == 6 ? true: false ); 
	    		});

	// ====================================================
	// this is the scale at the bottom
	context_brush.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + ((brush_height) + 0) + ")")
	    .call(d3.axisBottom(x_brush)
	    .ticks(d3.timeYear,1)
	    .tickPadding(3)
	    .tickFormat(d3.timeFormat('%Y')))
	    .attr("text-anchor", "middle")
	    .selectAll("text")
	    .attr("x", 0);

	// ====================================================

	var dte_start = new Date(2004, 0, 31);
	var dte_end = new Date(2012, 11, 31);
	var arr_init_co_ords = [x_brush(dte_start), x_brush(dte_end)];



	var brush = d3.brushX()
	                  .extent([[0 + brush_handle_width, 0], 
	                  	[brush_width - brush_handle_width, brush_height]])
	                  .on("brush", fn_brush_move)
	                  .on("start", fn_brush_start)
		 			.on("end", fn_brush_end);


	// this is the slider component
	var gBrush = context_brush.append("g")
	              .attr("class", "brush")
	              .attr("transform", "translate(0," + ((0) + 0) + ")")
	              .call(brush);

	 handle = gBrush.selectAll(".handle--custom")
	  .data([{type: "w"}, {type: "e"}])
	  .enter().append("path")
	    .attr("class", "handle--custom")
	    .attr("fill", "#666")
	    .attr("fill-opacity", 0.8)
	    .attr("stroke", "#000")
	    .attr("stroke-width", 1.5)
	    .attr("cursor", "ew-resize")
	    .attr("d", function(d, i) {
			var e = +(d.type == "e"),
			x = e ? 1 : -1,
			y = brush_height;
			return "M" + (0.5 * x) + "," + y + 
			"A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + 
			"V" + (2 * y - 6) +
			"A6,6 0 0 " + e + " " + (0.5 * x) + "," + (2 * y) +
			"Z" +
			"M" + (2.5 * x) + "," + (y + 8) +
			"V" + (2 * y - 8) +
			"M" + (4.5 * x) + "," + (y + 8) +
			"V" + (2 * y - 8);
	    	} // anon
	    );


	gBrush.select(".overlay")
		.on("mousedown.brush", fn_not_selection)
		.on("touchstart.brush", fn_not_selection);

	// make these local objects..available globally	
	brush_obj = 
	{
		brush_height : brush_height,
		gBrush : gBrush,
		brush : brush,
		handle: handle,
		arr_init_co_ords : arr_init_co_ords,
		x_brush: x_brush
	};

	fn_callback(null, "created brush geometry");


}






