var brush_margin = {top: 20, right: 0, bottom: 0, left: 0};

var brush_width = 910;

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

var dte_start = new Date(2004, 0, 31),
    dte_end = new Date(2012, 11, 31);
arr_init_co_ords = [x_brush(dte_start), x_brush(dte_end)];

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


var handle = gBrush.selectAll(".handle--custom")
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



// ======================================================
// ======================================================
// ======================================================
// ======================================================
// ======================================================
// ======================================================



function fn_initialise_brush() {
	// sets brush to initial position
	gBrush.call(brush.move, arr_init_co_ords);
	 handle.attr("display", null)
	 .attr("transform", function(d, i) { 
				return "translate(" + arr_init_co_ords[i] + "," + -brush_height + ")";});
} // fn_initialise_brush


function fn_update_area(lcl_s)  {
	// wrapper function to update the area chart
	var mouse_pos_in_date = lcl_s.map(x_brush.invert);
	var mouse_pos_date_round = mouse_pos_in_date.map(function(d, i) {return fn_round_dates(d);});
	
	// only update the graph if not the inital event
	if (!bln_started) {
		area_fun.update_graph(mouse_pos_date_round[0], mouse_pos_date_round[1], gData);
	}
	
	bln_started = false;

}


var bln_started = true;


function fn_brush_move() {
	var s = d3.event.selection;
	if (s !== null) {
		handle.attr("display", null)
		.attr("transform", function(d, i) { 
			return "translate(" + s[i] + "," + -brush_height + ")"; });
		fn_update_area(s);
	} // if
} // fn_brush_move

function fn_brush_start() {
	// record brush initial position in a global
	brush_init_pos = d3.event.selection;
}


function fn_which_handle_moved(l_old_pos, l_new_pos) {
	var move_ind = "undefined";
	if (l_old_pos[0] !== l_new_pos[0] && l_old_pos[1] !== l_new_pos[1]) {
		move_ind = "both";
	}
	else if (l_old_pos[0] !== l_new_pos[0]) {
		move_ind = "left";
	}
	else if (l_old_pos[1] !== l_new_pos[1]) {
		move_ind = "right";	
	}
	else if (l_old_pos[0] === l_new_pos[0] && l_old_pos[1] === l_new_pos[1]) {
		move_ind = "stationary";
	}
	else {
		move_ind = "error";
	}
	return(move_ind);
} // fn_which_handle_moved


function fn_round_dates(l_date) {
	// 15 is an arbitrary point in the middle of a month
	if (l_date.getDate() > 15) {
		dte_mod = new Date(l_date.getFullYear(), l_date.getMonth() + 1, 1 );

	}
	else {
		dte_mod = l_date;
	}
	var dte_rev = new Date(dte_mod.getFullYear(), dte_mod.getMonth(), 1);
	var dte_less_a_day = d3.timeDay.offset(dte_rev, -1);
	return(dte_less_a_day);
}


function fn_brush_end() {
	if (!d3.event.selection) return fn_initialise_brush();
	var str_handle_move = fn_which_handle_moved(brush_init_pos, d3.event.selection);
	// console.log(str_handle_move);
	// the following provides an array of the left & right mouse positions in dates
	var mouse_pos_in_date = d3.event.selection.map(x_brush.invert);
	// convert the array of unrounded dates into rounded dates
	var mouse_pos_date_round = mouse_pos_in_date.map(function(d, i) {return fn_round_dates(d);});
	int_month_count = d3.timeMonth.count(mouse_pos_date_round[0], mouse_pos_date_round[1]) + 1;
	// threshold for number of months
	int_mth_thold = 12;
	if (int_month_count < int_mth_thold) {
		if (str_handle_move === "left") {
			// get position of the right. subtract 12 months from it. 
			var dte_rounded_right = mouse_pos_date_round[1];
			var dte_new_left = d3.timeMonth.offset(dte_rounded_right, -int_mth_thold +1);
			gBrush.call(brush.move, [x_brush(dte_new_left), d3.event.selection[1]]);
		} // if
		else if (str_handle_move === "right") {
			// get position of the left. add 12 months from it. 
			var dte_rounded_left = mouse_pos_date_round[0];
			var dte_new_right = d3.timeMonth.offset(dte_rounded_left, int_mth_thold -1);
			// move the brush with orig x1 pos and new x2 pos
			gBrush.call(brush.move, [d3.event.selection[0], x_brush(dte_new_right)]);
		} // else if
		else {
			// something weird happened ... reset the brush
			fn_initialise_brush();
		} // else
	} // if (int_month_count < int_mth_thold)
} // fn_brush_end() 


function fn_not_selection() {
	// handles mousedown on rectangle. stops event bubbling up to brush
	d3.event.stopPropagation();
}




