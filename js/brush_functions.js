function fn_initialise_brush(fn_callback) {
	// sets brush to initial position
	//console.log("in initalise brush");
	brush_obj.gBrush.call(brush_obj.brush.move, brush_obj.arr_init_co_ords);
	 brush_obj.handle.attr("display", null)
	 .attr("transform", function(d, i) { 
				return "translate(" + brush_obj.arr_init_co_ords[i] + "," + -brush_obj.brush_height + ")";});
	fn_callback(null, "initialised brush");
} // fn_initialise_brush


function fn_brush_move() {
	var s = d3.event.selection;
	//	console.log("in brush move");
	if (s !== null) {
		brush_obj.handle.attr("display", null)
		.attr("transform", function(d, i) { 
			return "translate(" + s[i] + "," + -brush_obj.brush_height + ")"; });
		fn_update_area(s);
		// console.log(new Date());
	} // if
} // fn_brush_move


function fn_brush_start() {
	// record brush initial position in a global
	brush_init_pos = d3.event.selection;
}


function fn_not_selection() {
	// handles mousedown on rectangle. stops event bubbling up to brush
	d3.event.stopPropagation();
}


//////////////////////////////////////////////////////
/// All of the above are needed for initialisaton
////////////////////////////////////////////////////


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



function fn_update_area(lcl_s)  {
	// wrapper function to update the area chart
//	console.log("updating areas");
	var mouse_pos_in_date = lcl_s.map(brush_obj.x_brush.invert);
	var mouse_pos_date_round = mouse_pos_in_date.map(function(d, i) {return fn_round_dates(d);});
	// area_fun.update_graph(mouse_pos_date_round[0], mouse_pos_date_round[1], gData);

	stack_area_fun.update_graph(mouse_pos_date_round[0], mouse_pos_date_round[1], g_m_continent);
	obj_map_colours = fn_generate_map_colors(mouse_pos_date_round[0], mouse_pos_date_round[1]);

//	fn_update_map();
	

//	fn_cf_wrapper(mouse_pos_date_round[0], mouse_pos_date_round[1]);
	fn_update_map();
}


function fn_brush_end() {
//	console.log("in brush end");
	if (!d3.event.selection) return fn_initialise_brush();
	var str_handle_move = fn_which_handle_moved(brush_init_pos, d3.event.selection);
	// console.log(str_handle_move);
	// the following provides an array of the left & right mouse positions in dates
	var mouse_pos_in_date = d3.event.selection.map(brush_obj.x_brush.invert);
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
			brush_obj.gBrush.call(brush_obj.brush.move, [brush_obj.x_brush(dte_new_left), d3.event.selection[1]]);
		} // if
		else if (str_handle_move === "right") {
			// get position of the left. add 12 months from it. 
			var dte_rounded_left = mouse_pos_date_round[0];
			var dte_new_right = d3.timeMonth.offset(dte_rounded_left, int_mth_thold -1);
			// move the brush with orig x1 pos and new x2 pos
			brush_obj.gBrush.call(brush_obj.brush.move, [d3.event.selection[0], brush_obj.x_brush(dte_new_right)]);
		} // else if
		else {
			// something weird happened ... reset the brush
			fn_initialise_brush();
		} // else
	} // if (int_month_count < int_mth_thold)

//	console.log(mouse_pos_date_round[0]);
//	console.log(mouse_pos_date_round[1]);
 // fn_cf_wrapper(mouse_pos_date_round[0], mouse_pos_date_round[1]);
 obj_map_colours = fn_generate_map_colors(mouse_pos_date_round[0], mouse_pos_date_round[1]);

 fn_set_date(mouse_pos_date_round[0], mouse_pos_date_round[1]);

 fn_update_map();
//	stack_area_fun.update_graph(mouse_pos_date_round[0], mouse_pos_date_round[1], gData_new);

} // fn_brush_end() 
