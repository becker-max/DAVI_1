// set the dimensions and margins of the graph
var width1 = 1000
    height1 = 500
    margin1 = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width1, height1) / 2 - margin1

// append the svg object to the div called 'my_dataviz'
var svg3 = d3.select("#donutsvg")
  .append("svg")
    .attr("width", width1)
    .attr("height", height1)
  .append("g")
    .attr("transform", "translate(" + width1 / 2 + "," + height1 / 2 + ")");

// Create dummy data
//var data = {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14}

d3.queue()
    .defer(d3.csv, "./datasrc/planecrashinfo_infos.csv")
    .await(createdonut);

function createdonut (error, temp) {
    
    svg3.selectAll("*").remove();
    
    
    var sort = d3.nest()
        .key(function(d) { return d.ac_type_clean; })
        .rollup(function(a) { return a.length; })
        .entries(temp);
    
    sort.sort(function(x, y){
        return d3.descending(x.value, y.value);
    })
    
    var topTen = sort.filter(function(d,i){ return i<10 });
    
    var toKeep = [];
    for (let i = 0; i < topTen.length; i++) {
      toKeep.push(topTen[i].key);
    }
    
    temp = temp.filter(function(d,i){ return toKeep.indexOf(d.ac_type_clean) >= 0 })
    
    var nest = d3.nest()
        .key(function(d) { return d.ac_type_clean; })
        .rollup(function(a) { return a.length; })
        .object(temp);
    
    /*
    var data_tmp = d3.map(nest);
    
    var data = d3.map();
    
    data_tmp.each(function(d){if (d.value > 100) {data.set(d.key,d.value);}});
    
    */
    var donutdata = nest;
    
    //donutdata = {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14}
    
    //donutdata.sort(function(a,b) { return +a.value - +b.value })
    
    console.log(donutdata);
    console.log(sort);
    console.log(topTen);
    console.log(toKeep);
    
    

// set the color scale
var color = d3.scaleOrdinal()
  //.domain(data.keys())//["a", "b", "c", "d", "e", "f", "g", "h"])
  .range(d3.schemeDark2);

// Compute the position of each group on the pie:
var pie = d3.pie()
  .sort(null) // Do not sort group by size
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(donutdata))

// The arc generator
var arc = d3.arc()
  .innerRadius(radius * 0.5)         // This is the size of the donut hole
  .outerRadius(radius * 0.8)

// Another arc that won't be drawn. Just for labels positioning
var outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg3
  .selectAll('allSlices')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d){ /*console.log(color(d.data.key)); */return(color(d.data.key)) })
  .attr("stroke", "white")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)

// Add the polylines between chart and labels:
svg3
  .selectAll('allPolylines')
  .data(data_ready)
  .enter()
  .append('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function(d) {
      var posA = arc.centroid(d) // line insertion in the slice
      var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

// Add the polylines between chart and labels:
svg3
  .selectAll('allLabels')
  .data(data_ready)
  .enter()
  .append('text')
    //.text( function(d) {if (Number.isInteger(d.data.value)){return String(d.data.key).split("$")[1] + ": " + String(d.data.value) ;} } )
    .text( function(d) { /*console.log(d.data.key)*/ ; return d.data.key+ ": " + String(d.data.value); } )
    .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function(d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })

}



function updatedonut (error, temp, year) {
    
    if (year=="All"){
        createdonut(error,temp);
        return;
    }else{
        temp = temp.filter(function(d){return d.year==year;});
    }
    
    svg3.selectAll("*").remove();
    
    
    var sort = d3.nest()
        .key(function(d) { return d.ac_type_clean; })
        .rollup(function(a) { return a.length; })
        .entries(temp);
    
    sort.sort(function(x, y){
        return d3.descending(x.value, y.value);
    })
    
    var topTen = sort.filter(function(d,i){ return i<10 });
    
    var toKeep = [];
    for (let i = 0; i < topTen.length; i++) {
      toKeep.push(topTen[i].key);
    }
    
    temp = temp.filter(function(d,i){ return toKeep.indexOf(d.ac_type_clean) >= 0 })
    
    var nest = d3.nest()
        .key(function(d) { return d.ac_type_clean; })
        .rollup(function(a) { return a.length; })
        .object(temp);
    
    /*
    var data_tmp = d3.map(nest);
    
    var data = d3.map();
    
    data_tmp.each(function(d){if (d.value > 100) {data.set(d.key,d.value);}});
    
    */
    var donutdata = nest;
    
    //donutdata = {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14}
    
    //donutdata.sort(function(a,b) { return +a.value - +b.value })
    
    console.log(donutdata);
    console.log(sort);
    console.log(topTen);
    console.log(toKeep);
    
    

// set the color scale
var color = d3.scaleOrdinal()
  //.domain(data.keys())//["a", "b", "c", "d", "e", "f", "g", "h"])
  .range(d3.schemeDark2);

// Compute the position of each group on the pie:
var pie = d3.pie()
  .sort(null) // Do not sort group by size
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(donutdata))

// The arc generator
var arc = d3.arc()
  .innerRadius(radius * 0.5)         // This is the size of the donut hole
  .outerRadius(radius * 0.8)

// Another arc that won't be drawn. Just for labels positioning
var outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg3
  .selectAll('allSlices')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d){ console.log(color(d.data.key)); return(color(d.data.key)) })
  .attr("stroke", "white")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)

// Add the polylines between chart and labels:
svg3
  .selectAll('allPolylines')
  .data(data_ready)
  .enter()
  .append('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function(d) {
      var posA = arc.centroid(d) // line insertion in the slice
      var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

// Add the polylines between chart and labels:
svg3
  .selectAll('allLabels')
  .data(data_ready)
  .enter()
  .append('text')
    //.text( function(d) {if (Number.isInteger(d.data.value)){return String(d.data.key).split("$")[1] + ": " + String(d.data.value) ;} } )
    .text( function(d) { console.log(d.data.key) ; return d.data.key+ ": " + String(d.data.value); } )
    .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function(d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })

}