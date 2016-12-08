var query;
//var text = '{"query":"microsoft", "interpretations":[{  "logprob" : -11.279,  "parse":"<rule name=\"#GetPapers\"><attr name=\"academic#AA.AfN\">microsoft</attr></rule>",  "rules":[  {    "name":"#GetPapers",    "output":      {       "type":"query",      "value":"Composite(AA.AfN=="microsoft")"    }  }  ]}]}';
//var obj=JSON.parse(text);
//var composite = obj.interpretations[0].rules[0].output.value;



var ajaxDatavc;
var ajaxDataAc;
var ajaxSvg;
var ajaxDataPy;

function getInterpret(query, model="latest", complete=0, count=1000, offset=0, timeout=1000) {
	var returndata;
	$.ajax({
		url:"https://api.projectoxford.ai/academic/v1.0/interpret",
		headers: {
        'Ocp-Apim-Subscription-Key':'d7c08a20ed124371805bd6ac7afca6af'
    	},
    	data: { 'query': query,'count': count, 'offset': offset, 'complete': 0 },
		type:"GET",
		'success':  function (data) {
			//console.log(data)
			returndata = data.interpretations[0].rules[0].output.value
			getEvaluate(returndata) 
		}	
	});
	return returndata;
}

var DataGrouper = (function() {
    var has = function(obj, target) {
        return _.any(obj, function(value) {
            return _.isEqual(value, target);
        });
    };

    var keys = function(data, names) {
        return _.reduce(data, function(memo, item) {
            var key = _.pick(item, names);
            if (!has(memo, key)) {
                memo.push(key);
            }
            return memo;
        }, []);
    };

    var group = function(data, names) {
        var stems = keys(data, names);
        return _.map(stems, function(stem) {
            return {
                key: stem,
                vals:_.map(_.where(data, stem), function(item) {
                    return _.omit(item, names);
                })
            };
        });
    };

    group.register = function(name, converter) {
        return group[name] = function(data, names) {
            return _.map(group(data, names), converter);
        };
    };

    return group;
}());

DataGrouper.register("sum", function(item) {
    return _.extend({}, item.key, {Value: _.reduce(item.vals, function(memo, node) {
        return memo + Number(node.Value);
    }, 0)});
});

var margin = {top: 10, right: 10, bottom: 100, left: 40},
		    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
		    width = 960 - margin.left - margin.right,
		    height = 450 - margin.top - margin.bottom,
		    height2 = 500 - margin2.top - margin2.bottom;
        // set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

        // define the axis
var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")


var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}


function changeVis(value){

    if(value=="ca")
    { 
       data = ajaxDataAc
       $( "#slider-range" ).slider( "option", "max", parseInt(data.length));


       x.domain(data.map(function(d) { return d.author; }));
       y.domain([0, d3.max(data, function(d) { return d.citation; })]);
        //var bars = ajaxSvg.selectAll(".bar") // (data) is an array/iterable thing, second argument is an ID generator function

         //bars.remove();

       ajaxSvg.selectAll("*").remove();  

        ajaxSvg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.15em")
          .attr("transform", "rotate(-65)" );

      ajaxSvg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 5)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Citation");




       ajaxSvg.selectAll("bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.author); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.citation); })
          .attr("height", function(d) { return height - y(d.citation); });

          var h = document.getElementsByTagName('svg')[0].getAttribute('height'); 
    var svgHeight = parseFloat(h) + 200;
    document.getElementsByTagName('svg')[0].setAttribute('height', svgHeight);
   }

   if(value=="yp")
    {
       data = ajaxDataPy
       $( "#slider-range" ).slider( "option", "max", parseInt(data.length));

       x.domain(data.map(function(d) { return d.year; }));
       y.domain([0, d3.max(data, function(d) { return d.paper; })]);
        //var bars = ajaxSvg.selectAll(".bar") // (data) is an array/iterable thing, second argument is an ID generator function

         //bars.remove();

       ajaxSvg.selectAll("*").remove();  

        ajaxSvg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.15em")
          .attr("transform", "rotate(-65)" );

      ajaxSvg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 5)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Papers");




       ajaxSvg.selectAll("bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.year); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.paper); })
          .attr("height", function(d) { return height - y(d.paper); });

          var h = document.getElementsByTagName('svg')[0].getAttribute('height'); 
    var svgHeight = parseFloat(h) + 200;
    document.getElementsByTagName('svg')[0].setAttribute('height', svgHeight);
   }

    if(value=="cv")
    {
       data = ajaxDatavc
       $( "#slider-range" ).slider( "option", "max", parseInt(data.length));

       x.domain(data.map(function(d) { return d.venue; }));
       y.domain([0, d3.max(data, function(d) { return d.citation; })]);
        //var bars = ajaxSvg.selectAll(".bar") // (data) is an array/iterable thing, second argument is an ID generator function

         //bars.remove();

       ajaxSvg.selectAll("*").remove();  

        ajaxSvg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.15em")
          .attr("transform", "rotate(-65)" );

      ajaxSvg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 5)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Citation");




       ajaxSvg.selectAll("bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.venue); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.citation); })
          .attr("height", function(d) { return height - y(d.citation); });

          var h = document.getElementsByTagName('svg')[0].getAttribute('height'); 
    var svgHeight = parseFloat(h) + 200;
    document.getElementsByTagName('svg')[0].setAttribute('height', svgHeight);
   }
}

function updateData(value) {
   console.log()
   windowVis=25;	
   data2 = []
   var upData;
   var getValue = $("#graph").val();
   if (getValue == "ca")
   {
    upData = ajaxDataAc
    console.log(upData)
   }
   else if(getValue == "cv")
   {
    upData = ajaxDatavc
   }

   for(i=0;i<15;i++)
    {	

    	data2.push(upData[value])
    	value=value+1
      console.log(data2);
    }
	 // measure the domain (for x, unique letters) (for y [0,maxFrequency])
  // now the scales are finished and usable
  console.log(data2);
  if(getValue == "cv"){
      x.domain(data2.map(function(d) { return d.venue; }));
  }
  else if(getValue == "ca"){
      x.domain(data2.map(function(d) { return d.author; }));
  }
  y.domain([0, d3.max(upData, function(d) { return d.citation; })]);

  // another g element, this time to move the origin to the bottom of the svg element
  // someSelection.call(thing) is roughly equivalent to thing(someSelection[i])
  //   for everything in the selection\
  // the end result is g populated with text and lines!
  ajaxSvg.select('.x.axis').transition().duration(300).call(xAxis);
  ajaxSvg.select('.x.axis').selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", "-.15em").attr("transform", "rotate(-65)" );
  // same for yAxis but with more transform and a title
  //ajaxSvg.select(".y.axis").transition().duration(300).call(yAxis)

  // THIS IS THE ACTUAL WORK!
  if(getValue == "cv"){
  var bars = ajaxSvg.selectAll(".bar").data(data2, function(d) { return d.venue; }) // (data) is an array/iterable thing, second argument is an ID generator function
  }
  else if(getValue == "ca"){
  var bars = ajaxSvg.selectAll(".bar").data(data2, function(d) { return d.author; }) // (data) is an array/iterable thing, second argument is an ID generator function  
  }

  bars.exit()
    .transition()
      .duration(300)
    .attr("y", y(0))
    .attr("height", height - y(0))
    .style('fill-opacity', 1e-6)
    .remove();

  // data that needs DOM = enter() (a set/selection, not an event!)
  bars.enter().append("rect")
    .attr("class", "bar")
    .attr("y", y(0))
    .attr("height", height - y(0));

  // the "UPDATE" set:
  if(getValue == "cv"){
  bars.transition().duration(300).attr("x", function(d) { return x(d.venue); }) // (d) is one item from the data array, x is the scale object from above
    .attr("width", x.rangeBand()) // constant, so no callback function(d) here
    .attr("y", function(d) { return y(d.citation); })
    .attr("height", function(d) { return height - y(d.citation); }); // flip the height, because y's domain is bottom up, but SVG renders top down
  }
  else if(getValue == "ca"){
     bars.transition().duration(300).attr("x", function(d) { return x(d.author); }) // (d) is one item from the data array, x is the scale object from above
    .attr("width", x.rangeBand()) // constant, so no callback function(d) here
    .attr("y", function(d) { return y(d.citation); })
    .attr("height", function(d) { return height - y(d.citation); }); 
  }



}



function getEvaluate(expr, model="latest", attribute="Id,CC", count=1000, offset=0, orderBy="name:desc") {
	$.ajax({
		url:"https://api.projectoxford.ai/academic/v1.0/evaluate?",
		headers: {
        'Ocp-Apim-Subscription-Key':'d7c08a20ed124371805bd6ac7afca6af'
    	},
    	data: { 'expr': expr,'count': count, 'attributes' : "Ti,Y,CC,D,E,AA.AuN", 'offset': offset },
		type:"GET",
		'success':  function (data) {
			vc = []
			for (i = 0; i < data.entities.length; i++) { 
				var metadata = JSON.parse(data.entities[i].E);
				venue_citation = {venue:metadata.VFN, citation:data.entities[i].CC, authorname:data.entities[i].AA}
				
				vc.push(venue_citation)
				//console.log(vc)
		}
		//console.log(vc)
		ac = []
			for (i = 0; i < data.entities.length; i++) {
				for(j = 0; j< vc[i].authorname.length; j++) {
					author_citation = {author: vc[i].authorname[j].AuN, citation: vc[i].citation}
					ac.push(author_citation)
				}
				
			}
      py = []

      for (i = 0; i < data.entities.length; i++) {
          paper_year = {year:data.entities[i].Y, paper: 1}
          py.push(paper_year)
        }
        
      

		//console.log(ac)
		var linq = Enumerable.From(vc);
		var result = linq.GroupBy("$.venue", "", "k,e => { venue:k, citation:e.Sum('$.citation|0') }").ToArray();
		result.sort(function(a, b) {
    		return parseFloat(a.citation) - parseFloat(b.citation);
		});
		console.log();
		// load the data
		data = result
		//updateData(data);
		
		//$( "#slider" ).slider( "option", "max", parseInt(data.length));


		// var margin = {top: 20, right: 20, bottom: 70, left: 40};
  		//       var width = 1200 - margin.left - margin.right;
  		//       var height = 300 - margin.top - margin.bottom;

  		$( "#slider-range" ).slider( "option", "max", parseInt(data.length));
      $("#graph").val("cv");

		ajaxDatavc = data;

      d3.select("svg").remove();
        // add the SVG element
        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");

         ajaxSvg = svg;   
            

		  // scale the range of the data
		  x.domain(data.map(function(d) { return d.venue; }));
		  y.domain([0, d3.max(data, function(d) { return d.citation; })]);

		  // add axis
		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis)
		    .selectAll("text")
		      .style("text-anchor", "end")
		      .attr("dx", "-.8em")
		      .attr("dy", "-.15em")
		      .attr("transform", "rotate(-65)" );

		  svg.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 5)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Citation");


		  // Add bar chart
		  svg.selectAll("bar")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.venue); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(d.citation); })
		      .attr("height", function(d) { return height - y(d.citation); });

		
		
		var linq2 = Enumerable.From(ac);
		var result2 = linq2.GroupBy("$.author", "", "k,e => { author:k, citation:e.Sum('$.citation|0') }").ToArray();
		result2.sort(function(a, b) {
    		return parseFloat(a.citation) - parseFloat(b.citation);
		});

    result2.sort(sort_by('citation', true, parseInt));
       newdata = result2.slice(0,250)
       newdata.sort(sort_by('citation', false, parseInt));
		//console.log(JSON.stringify(result2));
    ajaxDataAc = newdata

    var linq = Enumerable.From(py);
    var result3 = linq.GroupBy("$.year", "", "k,e => { year:k, paper:e.Sum('$.paper|0') }").ToArray();
    result3.sort(function(a, b) {
        return parseFloat(a.year) - parseFloat(b.year);
    });

    ajaxDataPy = result3
    var h = document.getElementsByTagName('svg')[0].getAttribute('height'); 
    var svgHeight = parseFloat(h) + 200;
    document.getElementsByTagName('svg')[0].setAttribute('height', svgHeight);
		//console.log(DataGrouper.sum(vc, ["venue"]))	
	}
	})

}