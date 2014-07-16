(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.ui = WILDGOOSE.ui || {};
	WILDGOOSE.ui.graph = WILDGOOSE.ui.graph || {};

	// 의존성 주입
	var Ajax = CAGE.ajax;

	var Graph = {
		brokenLine: function(rawD) {
			var realData = JSON.parse(rawD);
			var sampleData = realData.data.numberOfArticles;

			var svgContainer = d3.select("#brokenline-graph > .graph").append("svg")
			.style("width", "100%").style("height", 300).attr("id", "brokenLineGraph")
			.attr("viewBox", "0 0 520 360");

			var backgroundColor = svgContainer.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "#26A88E");


			// NumberIndex
			var numberIndexYPosition = [
			{"y_pos": 285, "num": "0"}, {"y_pos": 235, "num": "1"}, 
			{"y_pos": 185, "num": "2"}, {"y_pos": 135, "num": "3"}, {"y_pos": 85, "num": "4"}];
			var numberIndexes = svgContainer.selectAll("text").data(numberIndexYPosition).enter().append("text");
			numberIndexes.attr("x", 7).attr("font-size","18").attr("fill", "white").attr("y", function (d) {return d.y_pos;}).text(function(d) {return d.num;});

			// guidanceLine
			guidanceLinePosition = [ "M 45 85 H520", "M 45 135 H520", "M 45 185 H520", "M 45 235 H520", "M 45 285 H520" ];

			var guidLines = svgContainer.selectAll("path").data(guidanceLinePosition).enter().append("path")

			guidLines.attr("d", function (d) {return d;}).attr("stroke", "#7D7D7D")
				.attr("stroke-width", 1).style("stroke-dasharray", "5,8")
				.attr("stroke-opacity", 0.6).attr("fill","none");

			// variable values
			matching = [ {		//number : Y position
				0 : 285,
				1 : 235,
				2 : 185,
				3 : 135,
				4 : 85
			} ];

			graphPositionX = [ 50, 120, 190, 260, 330, 400, 470 ];

			var keys = new Array();
			var now = new Date();
			now.setDate(now.getDate() - 7);
			for(var i = 0; i<7; i++){
				now.setDate(now.getDate() + 1);
				var month = now.getMonth() + 1;
				if (month < 10) { month = '0' + month; }
				var date = now.getDate();
				if (date < 10) { date = '0' + date; }
				keys.push(month + "/" + date);
			}

			var getValue = function(date) {
				for (var i=0; i<sampleData.length; i++) {
					var data = sampleData[i];
					if (data.date == date) {
						return data.count;
					}
				}
				return 0;
			}
			
			// graph
			var graphData = [ {
				"x" : graphPositionX[0],
				"y" : matching[0][getValue(keys[0])]
			}, {
				"x" : graphPositionX[1],
				"y" : matching[0][getValue(keys[1])]
			}, {
				"x" : graphPositionX[2],
				"y" : matching[0][getValue(keys[2])]
			}, {
				"x" : graphPositionX[3],
				"y" : matching[0][getValue(keys[3])]
			}, {
				"x" : graphPositionX[4],
				"y" : matching[0][getValue(keys[4])]
			}, {
				"x" : graphPositionX[5],
				"y" : matching[0][getValue(keys[5])]
			}, {
				"x" : graphPositionX[6],
				"y" : matching[0][getValue(keys[6])]
			} ]

			console.log(graphData);

			var lineFunction = d3.svg.line().x(function(d) {return d.x;})
					.y(function(d) {return d.y;}).interpolate("linear");

			var graph = svgContainer.append("path").attr("stroke", "white")
				.attr("stroke-width", 2).attr("fill", "none")
				.attr("stroke-linecap","round").attr("d", lineFunction(graphData));

			var text = svgContainer.append("text").attr("x", 370).attr("y", 40)
			.attr("font-size", "20").attr("fill", "white").text("기사송고추이");

			for(var i in keys) { 
				keys[i] = keys[i].replace("-", "/"); 
			}

			// date label
			for(labelIndex = 0; labelIndex < keys.length; labelIndex++){
				svgContainer.append("text").attr("font-size", "18").attr("fill", "white").attr("y", 315)
				.attr("x", 20 + (70 * labelIndex)).text(keys[labelIndex]);
			}
		},

		radar: function(data) {

			//var stat_data = JSON.parse(data)["data"];
			var stat_data = {
				"통솔" : Math.random() * 10,
				"매력" : Math.random() * 10,
				"지력" : Math.random() * 10,
				"정치" : Math.random() * 10,
				"무력" : Math.random() * 10
			};
			var object = {
				"container-width" : 400,
				"container-height" : 400,
				"circle-scale" : 0.75,
				"color" : "red"
			};

			var svgContainer = d3.select("#radar-graph > .graph").append("svg").style(
					"width", "100%").style("height", "300px").attr("id", "radarGraph")
					.attr("viewBox", "0 0 400 400");


			var backgroundColor = svgContainer.append("rect").attr("width", "100%")
					.attr("height", "100%").attr("fill", "#FFF");


			var radius = object["container-width"] / 2 * object["circle-scale"];
			for (var i = 0; i < 10; i++) {
				var circle = svgContainer.append("ellipse").attr("cx",
						object["container-width"] / 2).attr("cy",
						object["container-height"] / 2).attr("rx",
						radius * (1 - 0.1 * i)).attr("ry", radius * (1 - 0.1 * i))
						.attr("stroke", "#AAA").attr("stroke-width", 0.5).attr("fill",
								"white").attr("fill-opacity", 0);
			}

			// (200,200) 을 중심으로 화전시켜야 함
			function rotation(point, degree) {
				var x = point.x * Math.cos(degree) - point.y * Math.sin(degree);
				var y = point.x * Math.sin(degree) + point.y * Math.cos(degree);
				return {
					"x" : x,
					"y" : y
				};
			}

			var num_of_stats = Object.keys(stat_data).length;
			var i = 0;
			var lineData = [];
			for ( var stat in stat_data) {
				var point = {
					x : 0,
					y : -1 * stat_data[stat] / 10 * radius
				};
				point = rotation(point, 2 * Math.PI / num_of_stats * i);
				point.x += object["container-width"] / 2;
				point.y += object["container-height"] / 2;
				lineData.push(point);
				i++;
			}
			lineData.push(lineData[0]);

			var lineFunction = d3.svg.line().x(function(d) {
				return d.x;
			}).y(function(d) {
				return d.y;
			}).interpolate("linear");

			var vertexData = [];
			for (var i = 0; i < num_of_stats; i++) {
				var point = {
					x : 0,
					y : -1 * radius
				};
				point = rotation(point, 2 * Math.PI / num_of_stats * i);
				var point_label = {
					x : 0,
					y : -1 * (radius + 25)
				};
				point_label = rotation(point_label, 2 * Math.PI / num_of_stats * i);
				point.x += object["container-width"] / 2;
				point.y += object["container-height"] / 2;
				point.title = Object.keys(stat_data)[i];
				point.value = stat_data[point.title];
				point.x_t = point_label.x + object["container-width"] / 2;
				point.y_t = point_label.y + object["container-height"] / 2;

				vertexData.push(point);
			}
			for (var j = 0; j < vertexData.length; j++) {
				var lineGraph = svgContainer.append("path").attr("d",
						lineFunction([ vertexData[j], {
							x : object["container-width"] / 2,
							y : object["container-width"] / 2
						} ])).attr("stroke", "#AAA").attr("stroke-width", .5).attr(
						"fill", "yellow").attr("fill-opacity", .6);
			}

			var lineGraph = svgContainer.append("path").attr("d",
					lineFunction(lineData)).attr("stroke", "#222").attr("stroke-width",
					.5).attr("stroke-opacity", .1).attr("fill", object.color).attr(
					"fill-opacity", .4);



			//Add the SVG Text Element to the svgContainer
			var text = svgContainer.selectAll("text").data(vertexData).enter().append(
					"text");
			//Add SVG Text Element Attributes
			var textLabels = text.attr("x", function(d) {
				return d.x_t - 16;
			}).attr("y", function(d) {
				if (d.title === "통솔")
					return d.y_t + 1;
				return d.y_t - 4;
			}).text(function(d) {
				return d.title;
			}).attr("font-family", "sans-serif").attr("font-size", "18px").attr("fill",
					"#AAA").append('svg:tspan').attr('x', function(d) {
				return d.x_t - 16;
			}).attr('dy', 20).attr("font-size", "23px").attr("fill", "#444").text(
					function(d) {
						return parseInt(d.value * 10) / 10;
					});

		},

		donut: function(rawD) {
			console.log(rawD);
			var realData = JSON.parse(rawD);
			var data = realData.data.numberOfArticles;

			console.log(data);

			var w = 300 //width
			var h = 300 //height
			var r = 100 //radius
			var pie_scale = 1.2 // scale pie chart (default 1.2)
			var color = d3.scale.category20c(); //builtin range of colors

			var vis = d3.select("#donut-graph > .graph").append("svg") //create the SVG element inside the <body>

			.data([ data ]) //associate our data with the document
			.attr("viewBox", "0 0 300 300")
			.attr("style", "width: 100%; height: 300px;")
			.append("svg:g")
			.attr("transform", "translate(" + w/2 + "," + h/2 + ")") //move the center of the pie chart from 0, 0 to radius, radius

			var arc = d3.svg.arc() //this will create <path> elements for us using arc data
			.outerRadius(r*pie_scale);

			var pie = d3.layout.pie() //this will create arc data for us given a list of values
			.value(function(d) {
				return d.value;
			}); //we must tell it out to access the value of each element in our data array

			var arcs = vis.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
			.data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
			.enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
			.append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
			.attr("class", "slice"); //allow us to style things in the slices (like text)

			arcs.append("svg:path").attr("fill", function(d, i) {
				return color(i);
			}) //set the color for each slice to be chosen from the color function defined above
			.attr("d", arc); //this creates the actual SVG path using the associated data (pie) with the arc drawing function

			arcs.append("svg:text") //add a label to each slice
			.attr("transform", function(d) { //set the label's origin to the center of the arc
				//we have to make sure to set these before calling arc.centroid
				d.innerRadius = 0;
				d.outerRadius = r;
				return "translate(" + arc.centroid(d) + ")"; //this gives us a pair of coordinates like [50, 50]
			}).attr("text-anchor", "middle") //center the text on it's origin
			.text(function(d, i) {
				return data[i].label;
			}).attr("font-family", "sans-serif")
		    .attr("font-size", "18px")
		    .attr("fill", "#FFF")  ; //get the label from our original data array
		},

		init: function() {	
			var reporterId = window.location.pathname.split("/")[2];
			var graphInfo = {
				donut:{
					url: "/api/v1/reporters/:reporterId/statistics?data=number_of_articles&by=section",
					callback: this.donut
				},
				brokenLine:{
					url: "/api/v1/reporters/:reporterId/statistics?data=number_of_articles&by=day",
					callback: this.brokenLine
				},
				radar:{
				 	url: "/api/v1/reporters/:reporterId/statistics?data=stat_points",
				 	callback: this.radar
				}
			};

			for (var graphName in graphInfo) {
				var graph = graphInfo[graphName];
				var url = graph['url'].replace(":reporterId", reporterId);
				Ajax.GET({"url":url, "callback":graph.callback.bind(this)});
			}
		}
	}

	// 공개 메서드 노출
	WILDGOOSE.ui.graph = Graph;
})();