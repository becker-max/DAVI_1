// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg3 = d3.select("#treemapsvg")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// Read data
d3.csv("./datasrc/planecrashinfo_infos.csv", function(data) {
//d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_hierarchy_1level.csv', function(data) {
    
    /*var sc_crashes = d3.nest()
    .key(function(d) { return d.ac_type_clean; })
    .rollup(function(v) { return v.length; })
    .object(data);
    
    var sc_data = d3.map(sc_crashes);
    
    console.log(sc_data);
    */
    
    // stratify the data: reformatting for d3.js

    var root = d3.stratify()
        .id(function(d) { return d.ac_type_clean; })   // Name of the entity (column name is name in csv)
        .parentId(function(d) { return ""; })   // Name of the parent (column name is parent in csv)
        (data);

    //var root = d3.hierarchy(sc_data);
    
    root.sum(function(d) { return +d.value })   // Compute the numeric value for each entity


    // Then d3.treemap computes the position of each element of the hierarchy
    // The coordinates are added to the root object above
    d3.treemap()
        .size([width, height])
        .padding(4)
    (sc_data)

    console.log(root.leaves())
    // use this information to add rectangles:
    svg3
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", "#69b3a2");

    // and to add the text labels
    svg3
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.name})
        .attr("font-size", "15px")
        .attr("fill", "white")
})