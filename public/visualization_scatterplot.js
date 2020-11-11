//Scatterplot


// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/*
var svg2 = d3.select("#scatterplot"),
    width = +svg2.attr("width"),
    height = +svg2.attr("height");
*/


// append the svg object to the body of the page
var svg2 = d3.select("#scatterplot")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


d3.queue()
    .defer(d3.csv, "./datasrc/planecrashinfo_infos.csv")
    .await(createscatter);

//Read the data
//d3.csv("./datasrc/planecrashinfo_infos.csv", function(scatter) {
function createscatter(error, scatter){
    
    d3.select("#clearScatter").on("click", function(d){
        createscatter(error, scatter);
    })
    
    svg2.selectAll("*").remove();
    
    var sortedyears = d3.nest()
        .key(function(d) { return d.year; })
        .rollup(function(a) { return a.length; })
        .entries(scatter);
    
    sortedyears.sort(function(x, y){
            return d3.descending(x.value, y.value);
        })
    
    var topTenYears = sortedyears.filter(function(d,i){ return i<10 });
    
    console.log(topTenYears);
    
    var topTenYearsText = document.getElementById("toptenJahre");
    topTenYearsText.innerHTML = "";
    
    //topTenYearsText.innerHTML = "10 Jahre mit den meisten Abstürzen";
    
    for (let i = 0; i < topTenYears.length; i++) {
        topTenYearsText.innerHTML += (topTenYears[i].key + ": " + topTenYears[i].value);
        topTenYearsText.innerHTML += "<br />";
    }
    

    var sc_crashes = d3.nest()
    .key(function(d) { return d.year; })
    .rollup(function(v) { return v.length; })
    .object(scatter);

    var sc_data = d3.map();

    sc_data = d3.map(sc_crashes);

    console.log(sc_data);
    

    // Add X axis
    var x = d3.scaleLinear()
    //.domain([0, 4000])
    .domain([1908, 2019])
    .range([ 0, width ]);
    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(25));

    // Add Y axis
    var y = d3.scaleLinear()
    //.domain([0, 500000])
    .domain([0, 100])
    .range([ height, 0]);
    svg2.append("g")
        .call(d3.axisLeft(y).ticks(25));

    // Add dots
    svg2.append('g')
        .selectAll("dot")
        .data(sc_data.entries())
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.key); } )
        .attr("cy", function (d) { return y(d.value); } )
        .attr("r", 3)
        .style("fill", "#ff0000");


    
    /*
    //add trendline
    svg2.append("g")
        .attr("class", "avgline")
        .style("stroke", "#000")
        .style("stroke-width", "1px")
        .style("stroke-dasharray", ("4, 4"))
        .attr("d", [
        "M", x.range()[0], y(d3.mean(sc_data.values())), 
        "H", x.range()[1]
    ].join(' '))
    */

}

function updatescatter(error,scatterdata, ac_type){

    scatter = scatterdata.filter(function(d){ return d.ac_type_clean == ac_type});

    var sc_crashes = d3.nest()
    .key(function(d) { return d.year; })
    .rollup(function(v) { return v.length; })
    .object(scatter);

    var sc_data = d3.map();

    sc_data = d3.map(sc_crashes);

    console.log(sc_data);


    // Add X axis
    var x = d3.scaleLinear()
    //.domain([0, 4000])
    .domain([1908, 2019])
    .range([ 0, width ])
    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(25));

    // Add Y axis
    var y = d3.scaleLinear()
    //.domain([0, 500000])
    .domain([0, 100])
    .range([ height, 0]);
    svg2.append("g")
        .call(d3.axisLeft(y).ticks(25));
    
    var tempColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    console.log(tempColor);

    // Add dots
    svg2.append('g')
        .selectAll("dot")
        .data(sc_data.entries())
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.key); } )
        .attr("cy", function (d) { return y(d.value); } )
        .attr("r", 3)
        .style("fill", tempColor);

    
}