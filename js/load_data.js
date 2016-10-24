d3.csv("../data/monthly_totals.csv", function(d) {
    d.date = new Date(+d.date.substring(0,4), +d.date.substring(5,7)-1, +d.date.substring(8,10));
    d.month_tot = +d.month_tot;
    return d;
    }, 
    function(error, data) {
        if (error) throw error;
        gData = data;
        area_fun.initial_area();

});

