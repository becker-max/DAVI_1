    // The svg
    var svg1 = d3.select("#my_dataviz"),
        width = +svg1.attr("width"),
        height = +svg1.attr("height");

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoNaturalEarth2()
        .scale(140)
        .center([25, -20])
        .translate([width / 2, height / 4 * 3]);

    // Data and color scale
    var data = d3.map();
    var colorScale = d3.scaleThreshold()
        .domain([1,10,50,100,1000,2000])
        .range(d3.schemeYlOrRd[7]);

    //jahre für dropdown
    var years;

    //ac type für dropdown
    var ac_type;

    // Load external data and boot
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "./datasrc/planecrashinfo_infos.csv")
        .await(ready);
    //console.log(test);


    function ready(error, topo, test) {
    
        
    /*
    var crashes = d3.nest()
        .key(function(d) { return d.cc; })
        .rollup(function(v) { return d3.count(v, function(d) { return parseInt(d.ov); }); })
        .object(test);
    */
    
    data.clear();
        
    var crashes = d3.nest()
      .key(function(d) { return d.cc; })
      .rollup(function(v) { return v.length; })
      .object(test);
        
    data = d3.map(crashes);
    
    console.log(data);
    
    var gesamt_map = String(data.values().reduce((pv, cv) => pv + cv, 0));
        
    var gesamt_map_text = document.getElementById("gesamt_map");
    
    gesamt_map_text.innerHTML = "Total crashes: " + gesamt_map;
    
    d3.select("#selectButton")
        .selectAll('*').remove()
    var years = null;
    years = d3.map(test, function(d){return d.year;}).keys();        
    years.push("All");
    years.reverse();
    //console.log(years);
    
    d3.select("#selectACType")
        .selectAll('*').remove()
    var ac_typeButton = null;
    ac_typeButton = d3.map(test, function(d){return d.ac_type_clean;}).keys();
    ac_typeButton.sort();
    ac_typeButton.unshift("All");
    //console.log(ac_typeButton);
    
    // add the options to the button
    d3.select("#selectButton")
        //.selectAll('*').remove()
        .selectAll('myOptions')
        .data(years)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button
        
    d3.select("#selectACType")
        .selectAll('myOptions')
        .data(ac_typeButton)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button    

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value");
        var selectedACType = d3.select("#selectACType").property("value");
        // run the updateChart function with this selected option
        update(error, topo, test, selectedOption, selectedACType);
        updatedonut(error,test,selectedOption);
    })
        
    d3.select("#selectACType").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select("#selectButton").property("value");
        var selectedACType = d3.select(this).property("value");
        // run the updateChart function with this selected option
        update(error, topo, test, selectedOption, selectedACType);
        updatescatter(error,test, selectedACType);
    })
    
    //cahnge colorscale accordingly
    colorScale = d3.scaleThreshold()
        .domain([1,10,50,100,1000,2000])
        .range(d3.schemeYlOrRd[7]);
        
        let mouseOver = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1.0)
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black")

            d3.select(".tooltip")
                .style("display", "block")
                //.style("left", xPos + "px")
                //.style("top", yPos + "px")
                .style("top", (d3.event.pageY) + "px")
                .style("left", (d3.event.pageX) + "px")
                .html("Country Code: " + d.id + " " + "Count: " + data.get(d.id))

        }

        let mouseLeave = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1.0)
                .style("stroke", "none")
            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "none")
            d3.select(".tooltip")
                .style("display", "none")
                .html("")

        }
        
        /*
        d3.select("#circleBasicTooltip")
            .on("mouseover", function () {
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function () {
                return tooltip.style("top", (event.pageY - 800) + "px").style("left", (event.pageX - 800) + "px");
            })
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            });
            */

        // Draw the map
        svg1.append("g")
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
                //console.log(d);
                var value = data.get(d.id) || 0;
                /*console.log(data.get(d.id) + " " + d.id + " " + value + " " + colorScale(value));*/
                return colorScale(value);
            })

            .style("stroke", "transparent")
            .attr("class", function (d) {
                return "Country"
            })
            .style("opacity", 1.0)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
    }

    // A function that update the chart
    function update(error, topo, test, selectedOption, ac_type) {
        
      // Create new data with the selection
      
        if (selectedOption == "All" && ac_type == "All"){
            ready(error, topo, test);
            return;    
        }
        
    if (ac_type !== "All"){
        test = test.filter(function(d){ return d.ac_type_clean == ac_type});
        console.log(test);
    }
        
    data.clear();
        
    if (selectedOption == "All"){
        var crashes = d3.nest()
          .key(function(d) { return d.cc; })
          .rollup(function(v) { return v.length; })
          .object(test);
        data = d3.map(crashes);
        console.log(data);
    }else{
        var crashes = d3.nest()
          .key(function(d) { return d.year; })
          .key(function(d) { return d.cc; })
          .rollup(function(v) { return v.length; })
          .object(test);
        
        var temp = d3.map(crashes);
        data = d3.map(temp.get(parseInt(selectedOption)));
        
        //Change domain since the years have smaller increments
        colorScale = d3.scaleThreshold()
        .domain([1, 2, 10 ,20, 50, 100])
        //.domain([1, 2, 10])
        .range(d3.schemeYlOrRd[7]);
    }
    
    console.log(data);
        
    var gesamt_map = String(data.values().reduce((pv, cv) => pv + cv, 0));
        
    var gesamt_map_text = document.getElementById("gesamt_map");
    
    gesamt_map_text.innerHTML = "Total crashes: " + gesamt_map;
    


        let mouseOver = function (d) {
            
             var value = data.get(d.id) || 0;
            
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1.0)
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black")

            d3.select(".tooltip")
                .style("display", "block")
                //.style("left", xPos + "px")
                //.style("top", yPos + "px")
                .style("top", (d3.event.pageY) + "px")
                .style("left", (d3.event.pageX) + "px")
                .html("Country Code: " + d.id + " " + "Count: " + value)

        }
        
        let mouseLeave = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1.0)
                .style("stroke", "none")
            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "none")
            d3.select(".tooltip")
                .style("display", "none")
                .html("")

        }

        d3.select("#circleBasicTooltip")
            .on("mouseover", function () {
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function () {
                return tooltip.style("top", (event.pageY - 800) + "px").style("left", (event.pageX - 800) + "px");
            })
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            });

        // Draw the map
        svg1.append("g")
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
            
                var value = data.get(d.id) || 0;
            console.log(data.get(d.id) + " " + d.id + " " + value + " " + colorScale(value));
                return colorScale(value);
            })

            .style("stroke", "transparent")
            .attr("class", function (d) {
                return "Country"
            })
            .style("opacity", 1.0)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
      
    }