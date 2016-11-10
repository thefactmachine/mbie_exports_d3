
function aus_test(fn_callback) {

	// <svg id ="aus_test" width="300" height="157" ></svg>



	 // define margins
	 var a_test_margin = {top: 20, right: 20, bottom: 30, left: 50};

	 // graphics size without axis
	 var a_test_width = 300 - a_test_margin.left - a_test_margin.right;
	 var a_test_height = 157 - a_test_margin.top - a_test_margin.bottom;


	 aus_group = d3.select("#aus_test")
	    .append("g")
	    .attr("id", "aus_test_g")
	  	.attr("transform", "translate(" + a_test_margin.left + "," + a_test_margin.top + ")");



	// // width is 730
	 aus_test_x = d3.scaleTime().range([0, a_test_width]);
	 aus_test_y = d3.scaleLinear().range([a_test_height, 0]);
	
	 
	 xAxis_au_test = d3.axisBottom(aus_test_x).ticks(6);


	 yAxis_aus_test = d3.axisLeft(aus_test_y).ticks(5).tickSize(2).tickFormat(d3.format(".0s"));
	 // xAxis_au_test = d3.axisBottom(aus_test_x);


	 aus_test_x.domain(d3.extent(arr_new_data, function(d) { return d.date; }));
	 aus_test_y.domain([0, d3.max(arr_new_data, function(d) { return d.total; })]);


// define the line
	valueline = d3.line()
	.defined(function(d) {return d.total !==0 ;})
    .x(function(d) { return aus_test_x(d.date); })
    .y(function(d) { return aus_test_y(d.total); });



 // Add the valueline path.
  aus_group.append("path")
      .data([arr_new_data])
      .attr("class", "line")
      .attr("d", valueline);


// x axis here
	 aus_group.append("g")
	 			.attr("class", "axis axis--x")
	 			.attr("transform", "translate(0," + a_test_height + ")")
	 			.call(xAxis_au_test);


 
// y axis here
	 aus_group.append("g")
	 			.attr("class", "axis axis--y")
	 			.call(yAxis_aus_test);
	 			// .ticks(5)
	 			// .tickSize(2)
	 			// .tickFormat(d3.format(".0s")));

	 		//	.tickFormt(d3.formatPrefix("$,.0", 1e06)));

	if (fn_callback !== null) {
		fn_callback(null, "aus test");
	}

}




function aus_test_update() {
	aus_test_x.domain(d3.extent(arr_new_data,function(d) {return d.date;}));
	aus_test_y.domain([0, d3.max(arr_new_data,function(d) {return d.total;})]);
	xAxis_au_test = d3.axisBottom(aus_test_x).ticks(5);



	d3.select("#aus_test g path")
	.data([arr_new_data])
	.attr("d", valueline);

	// aus_group.select(".aus_test_x_axis").call(aus_test_x);
	aus_group.select(".axis--x").call(xAxis_au_test);
	aus_group.select(".axis--y").call(yAxis_aus_test);

}

/// need to run this....
// aus_test(null)




