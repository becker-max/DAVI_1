// set the dimensions and margins of the graph
var margin3 = {top: 10, right: 30, bottom: 30, left: 60},
    width3 = 1000 - margin3.left - margin3.right,
    height3 = 500 - margin3.top - margin3.bottom;

// append the svg object to the body of the page
var svg4 = d3.select("#evolsvg")
  .append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin3.left + "," + margin3.top + ")");

svg4.append("circle").attr("cx",50).attr("cy",130).attr("r", 6).style("fill", "red")
svg4.append("circle").attr("cx",50).attr("cy",160).attr("r", 6).style("fill", "steelblue")
svg4.append("circle").attr("cx",50).attr("cy",190).attr("r", 6).style("fill", "orange")
svg4.append("text").attr("x", 70).attr("y", 130).text("Fatalities").style("font-size", "15px").attr("alignment-baseline","middle")
svg4.append("text").attr("x", 70).attr("y", 160).text("Aboard").style("font-size", "15px").attr("alignment-baseline","middle")
svg4.append("text").attr("x", 70).attr("y", 190).text("Mean percentage of fatalities for each crash per year").style("font-size", "15px").attr("alignment-baseline","middle")



d3.queue()
    .defer(d3.csv, "./datasrc/planecrashinfo_infos.csv")
    .await(createevol);

//Read the data
//d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

// When reading the csv, I must format variables:

  // Now I can use this dataset:
function createevol (error, evoldata) {
    
    
    var sortedFatal = d3.nest()
      .key(function(d) { return d.year; })
      .rollup(function(v) { return d3.sum(v, function(d) { return parseInt(d.fatalities); }); })
      .entries(evoldata);
    
    sortedFatal.sort(function(x, y){
            return d3.descending(x.value, y.value);
        })
    
    var topTenFatal = sortedFatal.filter(function(d,i){ return i<10 });
    
    console.log(topTenFatal);
    
    var topTenFatalText = document.getElementById("topTenFatal");
    
    for (let i = 0; i < topTenFatal.length; i++) {
        topTenFatalText.innerHTML += (topTenFatal[i].key + ": " + topTenFatal[i].value);
        topTenFatalText.innerHTML += "<br />";
    }
    
    
    
    var evol_fatal = d3.nest()
      .key(function(d) { return d.year; })
      .rollup(function(v) { return d3.sum(v, function(d) { return parseInt(d.fatalities); }); })
      .entries(evoldata);
    
    var evol_aboard = d3.nest()
      .key(function(d) { return d.year; })
      .rollup(function(v) { return d3.sum(v, function(d) { return parseInt(d.aboard); }); })
      .entries(evoldata);
    
    var evol_perc = d3.nest()
      .key(function(d) { return d.year; })
      .rollup(function(v) { return d3.mean(v, function(d) { return (((parseInt(d.fatalities))/(parseInt(d.aboard)))*100); }); })
      .entries(evoldata);
    
    console.log(evol_fatal);
    console.log(evol_aboard);
    console.log(evol_perc);
    
    // Add X axis
    var x = d3.scaleLinear()
      .domain(d3.extent(evol_fatal, function(d) { return d.key; }))
      .range([ 0, width3 ]);
    svg4.append("g")
      .attr("transform", "translate(0," + height3 + ")")
      .call(d3.axisBottom(x).ticks(25));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(evol_aboard, function(d) { return +d.value; })])
      .range([ height3, 0 ]);
    svg4.append("g")
      .call(d3.axisLeft(y).ticks(25));
    
    var y1 = d3.scaleLinear()
      .domain([100, 0])
      .range([ 0, height3 ]);
    svg4.append("g")
      //.attr("class", "axisRed")
      .attr("transform", "translate( " + width3 + ", 0 )")
      .call(d3.axisRight(y1));
    
        

    // Add the line
    svg4.append("path")
      .datum(evol_fatal)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.key) })
        .y(function(d) { return y(d.value) })
        )
    
        svg4.append("path")
      .datum(evol_aboard)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.key) })
        .y(function(d) { return y(d.value) })
        )
    
    svg4.append("path")
      .datum(evol_perc)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-dasharray", ("3, 3"))
      .attr("d", d3.line()
        .x(function(d) { return x(d.key) })
        .y(function(d) { return y1(d.value) })
        )

}