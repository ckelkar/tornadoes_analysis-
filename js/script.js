var width = 2000,
    legendRectSize = 18,
    legendSpacing = 4,
    height = 1000;


var projection = d3.geo.albersUsa()
    .scale(2000)
    .translate([760, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .style("width", width)
    .style("height", height);


/*svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);
//    .on("click", clicked);*/


d3.json("json/us.json", function(unitedState) {
    var data = topojson.feature(unitedState, unitedState.objects.states).features;

    d3.tsv("tsv/us-state-names.tsv", function(tsv){
        var names = {};
        tsv.forEach(function(d,i){
            names[d.id] = d.name;
        });

        var map=
            svg.selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "black")
                .attr("stroke-width",0.5)
                .on("mouseover",mouseover)
                .on("mouseout",mouseout)
                .on("mousemove",mousemove);

        var labels=
            svg.selectAll("text")
            .data(data)
            .enter()
            .append("svg:text")
            .text(function(d){
                return names[d.id];

            })
            .attr("x", function(d){
                return path.centroid(d)[0];
            })
            .attr("y", function(d){
                return  path.centroid(d)[1];
            })
                .attr("class","label")
                .on("mouseover",mouseover)
                .on("mouseout",mouseout)
                .on("mousemove",mousemove);

        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .text("a simple tooltipSimple tooltip");

        function mouseover(){
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
        }

        function mouseout(){
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        }

        function mousemove(d){
            tooltip .html("<strong>State:</strong>"+"<strong>"+names[d.id]+"</strong><br/>"+"<strong>Indirect Deaths:</strong>"+"<strong>"+lookup[names[d.id]][0]+"</strong>"
            +"<br/>"+"<strong>Direct Deaths:</strong>"+"<strong>"+lookup[names[d.id]][1]+"</strong>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
        }

       /* var dataset = []
        d3.csv("csv/output.csv", function(data) {
            dataset = data.map(function(d) {
                return [ d.STATE, +d.DEATHS_INDIRECT ]; });
            console.log(dataset[0]);
        });*/

        var dataset=[];
        var lookup={};
        d3.json("json/output1.json",function(data){
            dataset=data;
            for(i=0;i<dataset.length;i++){
                lookup[dataset[i].STATE.toLowerCase()]=[dataset[i].DEATHS_INDIRECT,dataset[i].DEATHS_DIRECT];

            }
           // console.log(lookup);
            svg.selectAll("path")
                .attr("class",quantify)
           // alert("here");
            //console.log(lookup);
        })

        function quantify(d){
           // console.log(names[d.id]);
            if(names[d.id] in lookup){
                var f=lookup[names[d.id]][0];

                // alert(f+"  "+Math.min(8, ~~((f-250) / 150)));
                //console.log(names[d.id]+" "+lookup[names[d.id]][0]+);
                string="q"+ Math.min(8, ~~((f) / 10)) + "-9";
                console.log(names[d.id]+" "+lookup[names[d.id]][0]+" "+string);
                return string;

            }

        }

        var color = d3.scale.ordinal()
            .domain(["<10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", ">80"])
            .range(["#1a9850", "#66bd63", "#a6d96a","#d9ef8b","#ffffbf","#fee08b","#fdae61","#f46d43","#d73027"]);

        var legend = d3.select("svg")
            .append("g")
            .selectAll("g")
            .data(color.domain())
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                var height = legendRectSize;
                var horz = 1600;
                var vert = i * height;
                return "translate(" + horz + "," + vert + ")";
            });

        //Append a rectangle to each legend element to display the colors from the domain in the color variable
        legend.append("rect")
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .style("fill", color)
            .style("stroke", color);

        //Append a text element to each legend element based on the listed domains in the color variable
        legend.append("text")
            .attr("x", legendRectSize + legendSpacing)
            .attr("y", legendRectSize - legendSpacing)
            .text(function(d) { return d; });

    });
});





