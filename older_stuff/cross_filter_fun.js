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



var legMeasure = typeDimension.group().reduceSum(function(fact) { return fact.legs; });
var b = legMeasure.top(4);
console.log(b);
// result: dog(8), human(4), bird(2), plant(0)















