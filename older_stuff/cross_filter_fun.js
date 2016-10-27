//from here
// http://blog.rusty.io/2012/09/17/crossfilter-tutorial/

json_data = [{name: "Rusty", type: "human", legs: 2},
{name: "Alex", type: "human", legs: 2},
{name: "Lassie", type: "dog", legs: 4},
{name: "Spot", type: "dog", legs: 4},
{name: "Polly", type: "bird", legs: 2},
{name: "Fiona", type: "plant", legs: 0}];



var livingThings = crossfilter(json_data);

// count all things
livingThings.groupAll().reduceCount().value();

// total legs
livingThings.groupAll().reduceSum(function(fact) { return +fact.legs; }).value();

// filtering ... first we have to construct a dimension and then filter on it
var typeDimension = livingThings.dimension(function(d) { return d.type; });

typeDimension.filter('dog');

// now all operations will be for the filter

// how many dogs are there...?
livingThings.groupAll().reduceCount().value();

// how many legs for the dogs
livingThings.groupAll().reduceSum(function(fact) { return +fact.legs; }).value();


// this is how we clear the filter
typeDimension.filterAll();

// How many living things of each type are in my house?

var countMeasure = typeDimension.group().reduceCount();
var a = countMeasure.top(4);
console.log(a);



// ===========================================

var livingThings = crossfilter(json_data);
// defines a dimension based on the type: dog, human...etc
var typeDimension = livingThings.dimension(function(d) { return d.type; });
// this returns a total for legs
var legMeasure = typeDimension.group().reduceSum(function(fact) { return fact.legs; });
var b = legMeasure.top(4);
console.log(b[0]);
console.log(b[1]);
console.log(b[2]);
// result: dog(8), human(4), bird(2), plant(0)




// filter by date
// groupby country
// total by value







//console.log(gExports[0]);
 var dim_year = cf_exports.dimension(function(d) { return d.i_date; });
 dt1 = new Date(2005, 0, 31);
 dt2 = new Date(2006, 0, 31);

dim_year.filter(dt1);
 // this seems to work

dim_year.groupAll().reduceCount().value();


dim_year.top(100);





cf_exports = crossfilter(gExports);
var dim_country = cf_exports.dimension(function(d) { return d.country; });
dim_country.filter('Japan');
dim_country.groupAll().reduceCount().value();





// filtering ... first we have to construct a dimension and then filter on it
var typeDimension = livingThings.dimension(function(d) { return d.type; });
typeDimension.filter('dog');
// now all operations will be for the filter
// how many dogs are there...?
livingThings.groupAll().reduceCount().value();






var payments = crossfilter([
  {date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab"},
  {date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab"},
  {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa"},
  {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash"},
  {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash"},
  {date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa"}
]);

var paymentsByTotal = payments.dimension(function(d) { return d.total; });
paymentsByTotal.filter([100, 200]); 
var topPayments = paymentsByTotal.top(4);
// the largest payment
topPayments[0]
var allPayments = paymentsByTotal.top(Infinity);
allPayments;
var exports_cf = crossfilter(gExports);
var test_country = exports_cf.dimension(function(d) { return d.country; });
test_country.filter('Australia');
var topcountry = test_country.top(4)
topcountry[0]
var topcountry = test_country.top(Infinity)
topcountry.length
topcountry.groupAll().reduceCount().value();




// =========================================================
// =========================================================
// =========================================================







cf_exports = crossfilter(gExports);
var dim_date = cf_exports.dimension(function(d) { return d.date; });
dte1 = new Date(2000, 0, 31);
dte2 = new Date(2000, 1, 29);

//  dim_date.filter(dte1);


dim_date.filterFunction(function(d) { return d >=  dte1 && d <= dte2; });




// so does this: 117
cf_exports.groupAll().reduceCount().value();

// this produces 1729 as expected.
cf_exports.groupAll().reduceSum(function(fact) { return +fact.total; }).value();


var dim_country = cf_exports.dimension(function(d) { return d.country; });

var country_measure = dim_country.group().reduceSum(function(fact) { return fact.total; });

var zzz = country_measure.top(4);
console.log(zzz[0]);
console.log(zzz[1]);
console.log(zzz[2]);
console.log(zzz[3]);


// ==================  do I need to set this up for a different date range ========
// not I do not

//  NEED TO:
// 0)   setup crossfilter
// 1) 	setup date dimension
// 2) 	set the filter for date (not clear whether this is necessary on setup)
// 3) 	setup the country dimension
// 4)	call the country measure


// ON UPDATE:
// 1)	set the filter for date
// 2) 	call the country measure

dte3 = new Date(2007, 0, 31);
dte4 = new Date(2007, 11, 31);

dim_date.filterFunction(function(d) { return d >=  dte3 && d <= dte4; });

var country_tots = dim_country.group().reduceSum(function(fact) { return fact.total; });




// PATH 
// filter by single date  ==== DONE === APPROVED
// do a count by this date ==== DONE
// do a total for this date  ==== DONE
// do a group_by for this date === DONE

//  The next question is ... now that I have the filter set upp
// do I need to constuct the entire thing again....?


fn_initial_crossfilter();
dte3 = new Date(2007, 0, 31);
dte4 = new Date(2007, 11, 31);





var payment_json = [
  {date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab"},
  {date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab"},
  {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa"},
  {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash"},
  {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash"},
  {date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa"}
];


var payment_json_dates = [
  {date: new Date(2011, 4, 1), quantity: 2, total: 190, tip: 100, type: "tab"},
  {date: new Date(2011, 4, 5), quantity: 2, total: 190, tip: 100, type: "tab"},
  {date: new Date(2011, 4, 6), quantity: 1, total: 300, tip: 200, type: "visa"},
  {date: new Date(2011, 4, 8), quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: new Date(2011, 4, 9), quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: new Date(2011, 4, 10), quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: new Date(2011, 4, 17), quantity: 1, total: 100, tip: 0, type: "cash"},
  {date: new Date(2011, 4, 23), quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: new Date(2011, 4, 4), quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: new Date(2011, 4, 13), quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: new Date(2011, 4, 12), quantity: 2, total: 200, tip: 0, type: "cash"},
  {date: new Date(2011, 4, 110), quantity: 1, total: 200, tip: 100, type: "visa"}
];


fn_initial_crossfilter();
dte3 = new Date(2007, 0, 31);
dte4 = new Date(2007, 11, 31);

fn_cf_wrapper(dte3, dte4);



fn_set_date(dte3, dte4);


result_data = fn_process_cf_data();

fn_process_cf_data().map(function(d) {return d.key;});


result_data.map(function(d) {return d.key;});
result_data.map(function(d) {return d.value;});



//////////

brush_obj = fn_wrapper();































