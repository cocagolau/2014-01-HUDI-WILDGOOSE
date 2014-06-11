(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.user = WILDGOOSE.user || {};
	
	var User = {			
		getId: function() {
			var userIdDiv = document.getElementById("userId");
			if (userIdDiv !== undefined) {
				this.userId = userIdDiv.innerText;
				return this.userId;
			}
			return undefined;
		},
		isLogined: function() {
			if (this.getId() == "") {
				return false;
			}
			return true;
		}
	};
	
	// 공개 메서드 노출
	WILDGOOSE.user = User;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}    	
})();(function() {
	'use strict';
	var document = window.document;
	var console = window.console;

	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.ui = WILDGOOSE.ui || {};
	WILDGOOSE.favorite = WILDGOOSE.favorite || {};
	
	// 의존성 선언
	var Ajax = CAGE.ajax;
	var Dom = CAGE.util.dom;

	var Favorite = {
		favoriteList : [],

		attatchEventToFavBtn : function(curNum, reqNum) {
			var reporterCards = document.querySelectorAll(".card");
			if (reporterCards.length != 0) {
				(curNum == undefined) ? curNum = reporterCards.length : true;
				(reqNum == undefined) ? reqNum = reporterCards.length : true;
				for (var i = curNum - reqNum ; i < curNum; i++) {
					var card = reporterCards[i];
					if (card == undefined) {
						continue;
					}
					var star = card.querySelector(".star");
					star.addEventListener("click", this.toggleFav, false);
					star.addEventListener("click", function(e) {
						Dom.addClass(e.target, "pumping");
						setTimeout(function() {
							Dom.removeClass(e.target, "pumping");
						}, 300)
					}, false);
				}				
			}
		},

		toggleFav : function(e) {
			var target = e.target;
			var card = target.parentElement.parentElement.parentElement;
			var reporterId = card.firstElementChild.dataset.reporter_id;
			var url = "/api/v1/users/" + Favorite.userId + "/favorites/?reporter_id="
					+ reporterId;

			if (Dom.hasClass(target, "on")) {
				Ajax.DELETE({
					"url" : url,
					"callback" : function(data) {
						var data = JSON.parse(data);
						if (data.status == 200) {
							Dom.removeClass(target, "on");
							Dom.addClass(target, "off");
							Dom.addClass(card, "blur");
						} else {
							// react fail
						}
					}
				});
			} else {
				Ajax.POST({
					"url" : url,
					"callback" : function(data) {
						console.log(data)
						var data = JSON.parse(data);
						if (data.status == 200) {
							Dom.addClass(target, "on");
							Dom.removeClass(target, "off");
							Dom.removeClass(card, "blur");

						} else {
							// react fail
						}
					}
				});
			}
		},

		updateFavs : function(curNum, reqNum) {
			var reporterCards = document.querySelectorAll(".card-section-identity");
			if (reporterCards.length != 0) {
				(curNum == undefined) ? curNum = reporterCards.length : true;
				(reqNum == undefined) ? reqNum = reporterCards.length : true;
				for (var i = curNum - reqNum ; i < curNum; i++) {
					var card = reporterCards[i];
					if (card == undefined) {
						continue;
					}
					var reporterId = card.dataset.reporter_id;
					if (this.favoriteList.indexOf(parseInt(reporterId)) >= 0) {
						card.querySelector(".star").className = "star on";
					}
				}				
			}
		},
		
		init: function(args) {
			this.userId = args.userId;

			// 초기화
			if (this.userId !== "" || this.userId !== undefined) {
				
				// 모든 별에 eventlistener 붙이기
				this.attatchEventToFavBtn();
				
				// user의 Favorite 목록 획득
				var url = "/api/v1/users/" + this.userId + "/favorites/";
				Ajax.GET({
					"url" : url,
					"callback" : function(jsonStr) {
						var result = JSON.parse(jsonStr);
						var reporterCards = result["data"]["reporterCards"]
						for (var i=0; i<reporterCards.length; i++) {
							var card = reporterCards[i];
							Favorite.favoriteList.push(card["id"]);
						}
						// 불러온 목록 내부에 존재하는 favorite 업데이트
						// 인자가 없으면 모두!
						this.updateFavs();
					}.bind(this)
				});
			}
		}
	};
	
	WILDGOOSE.ui.favorite = Favorite;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}	

})();(function() {	
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
})();(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.validator = WILDGOOSE.validator || {};
	
	var Extend = CAGE.util.object.extend;
	var Dom = CAGE.util.dom;
	var Ajax = CAGE.ajax;
	
	function Validator(form, rule) {
		this.rule = rule;
		this.myLogics = {};
		this.mySequence = {};
		
		this.UI.form = form;
		
		this.defineLogics();
//		defineSequence();
	};
	
	Validator.prototype = {
		constructor: "Validator",
		defineLogics: function() {
			for (var name in this.rule) {
				var curRule = this.rule[name];
				var curType = curRule.type;
				this.myLogics[name] = Extend({}, this.normLogics[curType]);
				
				this.defineSequence(name, curType, this.rule[name].extend);
				this.defineFunction(name, this.rule[name].extend);

				if (curType == "confirm") {
					this.myLogics[name].target = this.rule[name].target;						
				}
			}
		},
		
		defineSequence: function(name, type, extendObj) {
			this.mySequence[name] = [].concat(this.normSequence[type]);
			
			// extendObj가 존재할 경우만 concat
			if (extendObj !== undefined) {
				var extendSeq = Object.keys(extendObj);
				for(var i=0; i<extendSeq.length; ++i) {
					var curSeq = extendSeq[i];
					if (this.mySequence[name].indexOf(curSeq) == -1) {
						this.mySequence[name].push(curSeq);
					}
				}
			}
		},
		
		defineFunction: function(name, extendObj) {
			for (var i in this.mySequence[name]) {
				var curSeq = this.mySequence[name][i];
				// curSeq가 확장되었을 경우., extendObj에 존재.

				if (extendObj !== undefined && extendObj.hasOwnProperty(curSeq)) {
					this.myLogics[name][curSeq] = extendObj[curSeq];
				}
				else if (this.myLogics[name][curSeq] !== undefined && this.myLogics[name][curSeq][0] === null){
					this.myLogics[name][curSeq][0] = this.normFunction[curSeq];
				}
			}
		},
		
		
		check: function(inputEl) {
			var fieldName = inputEl.name;
			var logics = this.myLogics[fieldName];
			var sequence = this.mySequence[fieldName];
			var state = true;
			
			for ( var i = 0; i<sequence.length; ++i) {
				var curSeq = sequence[i];
				var logic = logics[curSeq][0];
				var alertMsg = logics[curSeq][1];

				if (!this._isValid(logic, inputEl)) {
					state = false;
					break;
				}
			}
			
			this.UI.update(state, inputEl, alertMsg);
			return state;
		},
		
		_isValid: function(logic, inputEl) {
			var name = inputEl.name;
			var value = inputEl.value;
			
			if (logic instanceof RegExp) {
				return logic.test(value);
			}
			else if (logic instanceof Function) {
				var validState = false;
				logic.call(this.myLogics[name], inputEl, function(validity, isProgressing) {
					if (isProgressing) {
						Dom.removeClass(inputEl, "isProgressing");
					}
					validState = validity;
				});
				return validState;
			}
			return false;
		},
		
		
		normFunction: {
			usable: function(inputEl, callback) {
				Ajax.GET({
					isAsync: false,
					url: "/api/v1/accounts?email=" + inputEl.value,
					success: function(responseObj) {
						var validity = true;
						var isProgressing = true;
						callback(validity, isProgressing);
					},
					failure: function(responseObj) {
						var validity = false;
						var isProgressing = true;
						callback(validity, isProgressing);
					}
				});
//					Dom.addClass(inputEl, "isProgressing");
			},
			equal: function(inputEl, callback) {
				var parent = inputEl.form;
				var targetEl = document.querySelector("." + parent.className + " input[name=" + this.target + "]");
				callback(inputEl.value == targetEl.value);
			}
			
		},
		
		
		normSequence: {
			email: [ "required", "format", "usable" ],
			password: [ "required", "letter", "size", "ampleNumber", "ampleLetter" ],
			confirm: [ "required", "equal" ]
		},
		
		normLogics: {
			email : {
				required : [ /.+/, "email을 입력해주세요" ],
				format : [ /^[\w\.-_\+]+@[\w-]+(\.\w{2,4})+$/, "email형식을 지켜주세요" ],
				usable : [ null, "이미 등록된 email입니다" ]
			},
			password : {
				required : [ /.+/, "비밀번호를 입력해주세요" ],
				letter : [
						/[a-zA-Z0-9\`\~\!\@\#\$\%\^\&|*\(\)\-\_\=\=\+\\\|\,\.\<\>\/\?\[\]\{\}\;\:\'\"]/,
						"숫자, 영문자 대소문자, 특수문자만 사용해주세요" ],
				size : [ /^.{8,15}$/, "8~15자 사이로 입력해주세요" ],
				ampleNumber : [ /(.*\d{1}.*){4,}/, "숫자는 4자리 이상 포함되어야 합니다" ],
				ampleLetter : [ /(.*\D{1}.*){4,}/, "문자는 4자리 이상 포함되어야 합니다" ]
			},
			
			confirm : {
				required : [ /.+/, "다시 입력해주세요" ],
				equal : [ null, "다시 확인해주세요" ]
			}
			
			
		},
		
		UI: {
			update: function(condition, inputEl, alertMsg) {
				if (!condition) {
					this._warn(inputEl, alertMsg);
					this._invalidStyle(inputEl);
				}
				else {
					this._unwarn(inputEl);
					this._validStyle(inputEl);
				}
			},
			/*
			 * 상태에 따른 변경될 style을 모음 
			 */
			_validStyle: function(inputEl) {
				var inputColumnEl = inputEl.parentNode.parentNode.parentNode;
//				Dom.removeClass(inputColumnEl, "status-denied");
				Dom.removeClass(inputColumnEl, "is-invalid");
//				Dom.addClass(inputColumnEl, "status-approved");
				Dom.addClass(inputColumnEl, "is-valid");
			},
			
			_invalidStyle: function(inputEl) {
				var inputColumnEl = inputEl.parentNode.parentNode.parentNode;
//				Dom.removeClass(inputColumnEl, "status-approved");
				Dom.removeClass(inputColumnEl, "is-valid");
//				Dom.addClass(inputColumnEl, "status-denied");
				Dom.addClass(inputColumnEl, "is-invalid");
			},

			/*
			 * 사용에게 메시지를 전달하기 위한 함수 
			 */
			_warn: function(inputEl, _warningMsg) {
				var name = inputEl.name;
				var target = this.form.querySelector(".msg-" + name);

				target.innerText = _warningMsg;
			},

			_unwarn: function(inputEl) {
				var name = inputEl.name;
				var target = this.form.querySelector(".msg-" + name);

				target.innerText = "";
			}
		}
		
	};
	
	WILDGOOSE.validator = Validator;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}	

}(this));
(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.account = WILDGOOSE.account || {};
	WILDGOOSE.account.super_type = WILDGOOSE.account.super_type || {};

	// 의존성 주입
	var Dom = CAGE.util.dom;
	var Ajax = CAGE.ajax;
	var Validator = WILDGOOSE.validator;
	
	/*
	 * Account라는 superType를 정의합니다.
	 * Join, Login, Logout, withdraw, change.pw와 같은 subType객체는 결국 Account라는 속성에 포함되고
	 * 궁극적으로 동등한 method를 공유할 수 있기 때문에
	 * subType이 superType을 상속받는 방법이 훨씬 효율적이라고 생각했습니다.
	 * 
	 * 기본적은 args는 객체이며 아래와 같은 형태입니다.
	  						{
								method: "POST",
								url: "/api/v1/accounts/",
								form: ".form-container",
								rule: {
									email: {
										type: "email"
									},
									password: {
										type: "password"
									},
									confirm: {
										type: "confirm",
										target: "password"
									}
								}
							};
	 * 
	 * 한 페이지 내에서 Account라는 type이 다양하게 생성될 수 있고,
	 * type이 각자의 method를 가지기보다는 prototype을 이용하여 공유하는 편이 훨씬 효율적이라고 생각하여
	 * Account객체를 생성자와 prototype패턴을 이용하게 되었습니다.
	 * 
	 * Account객체는 다음과 같은 property (member 변수)를 가지게 됩니다.
	 *   - this.form   : 자신이 관리할 form element
	 *   - this.method : ajax통신 방법
	 *   - this.url    : ajax통신 목적지
	 *   
	 *   - this.submitEl : this.form의 submit 기능을 하는 element (그 타입이 반드시 submit일 필요는 없고, name만 "submit"이면 됩니다.)
	 *   - this.randNum  : 만약 암호화된 정보를 전달하기 위해 template을 받을 때부터 얻는 randomNumber를 담는 공간
	 *   
	 *   - this.validator : this.form의 validation작업을 수행하기 위해 가지게 되는 WILDGOOSE.validator 객체
	 *   - this.rule      : validation 작업을 수행하기 위한 규칙을 담은 객체
	 *   					아래와 같은 형식을 가지게 된다.
	 *   					key값은    this.form 내부에 있는 input element의 name
	 *   					value값은  input element의 field값이 수행되어야할 validation작업의 type을 의미함
	 *    							  type엔 email, password, confirm이 존재함.
	 *    							  추가적으로 extend라는 이름의 객체로 validation작업을 확장할 수 있음 (지금은 function만 가능)
	 *   
							rule: {
								email: {
									type: "email"
								},
								password: {
									type: "password"
								},
								confirm: {
									type: "confirm",
									target: "password"
								}
							}
	 *   
	 *   
	 *   - this.names      : this.rule 객체의 key를 담은 배열
	 *   - this.selectedEl : this.names와 관련있는 input element를 담은 객체
	 *   					 key: name
	 *   					 value: key를 name으로 가지는 input element
	 *   
	 *   -this.cache : 어떤 event발생시 callback 함수를 this 스코프내에서 실행하기 위해 참조를 가진 변수
	 */
	
	function Account(args) {
		this.selectedEl = {};
		this.submitEl = null;
		this.randNum = null;
		this.method = null;
		this.rule = null;
		this.names = null;
		this.form = null;
		this.url = null;
		this.validator = null;
		this.cache = {
			keyEvtHandler: this._keyEvtHandler.bind(this)
		};
		
		/*
		 * account의 init
		 * java의 constructor의 느낌을 따라하기위해 객체의 이름과 동등하게 설정함.
		 */ 
		this._account(args);
	};

	Account.prototype = {
		constructor: "Account",
		
		/*
		 * Account 객체가 생성될 때 수행.
		 * Account 객체를 초기화하는 역할
		 */
		_account: function(args) {
			/*
			 * args가 존재하는 경우 args에 담긴 property를 this (Account)에 등록
			 */
			if (args !== undefined) {
				this.method = args.method;
				this.rule = args.rule;
				this.form = document.querySelector(args.form);
				this.url = args.url;
				this.randNum = args.randNum;
				
				/*
				 * 추가적으로 this.rule property가 존재하는 경우
				 * 반드시 validation 작업이 필요하므로 validation에 필요한 작업을 수행함.
				 */
				if (this.rule !== undefined) {
					/*
					 * this.names에 this.rule의 key값을 배열 형태로 저장함.
					 */
					this.names = Object.keys(this.rule);
					/*
					 * this.form에서 validation작업을 수행할 대상 element를 this.selectedEl에 Obj형태로 저장
					 * this.form의 submit을 담당하는 element를 this.submitEl에 저장 
					 */
					this._extract();
					this.validator = new Validator(this.form, this.rule);
					
					/*
					 * this.selectedEl에 관리하고 있는 element의 field에 keyup 이벤트가 발생했을때만
					 * validation작업과 submitEl의 UI 업데이트가 수행된다.
					 * 
					 * this.selectedEl에 keyup 이벤트를 설정하기 위한 메소드임.
					 */
					this._addKeyEvent();
					
					/*
					 * issue 488해결하기위한 함수
					 */
					this._init();
				}
			}
		},
		/*
		 * exec()함수를 호출할 때 중요한 부분이다.
		 * 만약 payload가 필요한 Ajax통신인 경우 
		 * subperType을 상속받은 subType에 _getPayload()함수만 overriding하여 새로 정의해 사용해야한다.
		 * 이렇게 interface만 정의해둔다면
		 * Account를 상속받는 Join, Login, Logout, ChangePw, Withdraw의 경우 _getPayload()함수만 정의하기만 하면 충분하다.
		 */
		_getPayload: function() {
			/*
			 * interface
			 * subType에서 _getPayload를 구현해야함.
			 */ 
			return null;
		},
		
		/*
		 * Account가 종료될 때
		 * this.selectedEl에 관리하는 element의 keyup event를 삭제하여 js의 효율을 높인다.
		 */
		stop: function() {
			this._removeKeyEvent();
		},
		
		exec: function(callback, failCallback) {
		/*
		 * 만약 validation을 위한 this.rule이 없거나, this.submitEl이 비활성화된 경우 ajax를 실행하지 않는다.
		 */
			if (this.rule !== undefined && Dom.hasClass(this.submitEl, "disable")) {
				console.log("누르지마 바보야");
			}
			else {
				Ajax[this.method]({
					"url": this.url,
					"success": function() {
						callback();
						console.log("Success!");
					},
					"failure": function() {
						if (failCallback !== undefined) {
							failCallback();
						}
						console.log("FAIL!");
					},
					"data": this._getPayload()
				});
			}
		},
		
		// 기존에 저장된 정보가 있는 경에도 validation이 가능토록하는 로직
		_init: function() {
			for (var name in this.selectedEl) {
				var el = this.selectedEl[name];
				if (el.value != "") {
					this._validateField(el, false);
				}
			}
		},
		
		/*
		 * 관리가 필요한 element를 this.form에서 추출함.
		 */
		_extract: function() {
			for (var i = this.form.length - 1; i >= 0; --i) {
				var el = this.form[i];
				/*
				 * element의 name이 submit인 경우 this.submitEl에 저장
				 */
				if (el.name == "submit") {
					this.submitEl = el;
					continue;
				}
				
				/*
				 * this.names를 이용하여
				 * this.selectedEl에 { name : element } 형태로 저장  
				 */
				if (this.names !== undefined && this.names.indexOf(el.name) != -1) {
					this.selectedEl[el.name] = el;
				}
			}
		},
		
		/*
		 * this.selectedEl에 있는 element에게 keyup이벤트를 부여하고
		 * callback함수를 this.cache.keyEvtHandler로 설정.
		 */
		_addKeyEvent: function() {
			for (var name in this.selectedEl) {
				var el = this.selectedEl[name];
				el.addEventListener("keyup", this.cache.keyEvtHandler, false);
			}
		},
		
		/*
		 * this.selectedEl에 this.cache.keyEvtHandler가 callback함수로 되어있는 keyup이벤트를 삭제
		 */
		_removeKeyEvent: function() {
			for (var name in this.selectedEl) {
				var el = this.selectedEl[name];
				el.removeEventListener("keyup", this.cache.keyEvtHandler, false);
			}
		},
		
		/*
		 * keyup 이벤트가 발생시 호출되는 callback function
		 * 
		 *  기본적인 목적은
		 *  1. 현재 눌린 키가 enter키인지 확인
		 *  2. 키가 눌린 targetEl의 vaidation 작업을 수행.
		 *  3. enter 키가 눌린 경우 this.submitEl에 click event를 발생시킴.
		 *     ajax 요청을 보내는 exec() 함수를 직접 실행하지 않고, custom event를 수행하는 이유는 
		 *     click시 얻을 수 있는 callback 함수를 받아오기 위함이다.
		 */
		_keyEvtHandler: function(evt) {
			var enter = (evt.keyCode == 13)? true : false;
			
			this._validateField(evt.target, enter);
			
			if (enter) {
				/*
				 * custom event의 특징은 detail이라는 Obj에 원하는 정보를 함께 전달할 수 있다는 점이다.
				 * 같은 click event라고 하더라도 detail.enter가 ture여부에 따라 enter를 눌러 실행했는지, 아니면 정말 click을 했는지 구별할 수 있기 때문에 사용하였다.
				 */
				var clickEvt = new CustomEvent("click", {detail: {"enter": enter}});
				this.submitEl.dispatchEvent(clickEvt);
			}
		},
		
		/*
		 * _keyEvtHandler가 호출되면 무조건 _validationField()함수를 호출한다.
		 * this.validator의 check함수를 통해 targetEl의 field가 유효한 정보인지를 확인한다.
		 * 그리고 submitEl의 UI를 disable로 할지 able로 할지 결정하는 _updateUI()함수를 호출하게된다.
		 */
		_validateField: function(targetEl, pressedEnterKey) {
			this.validator.check(targetEl);
			this._updateUI(this._ckeckSubmitStatus(pressedEnterKey));
		},
		
		/*
		 * submitEl이 활성화가될지 말지를 boolean값으로 확인해주는 함수이다.
		 * 만약 in-valid가 없거나 is-invalid class를 가지고 있지 않다면
		 * submitEl은 비활성화이어야하기 때문에 false를 반환한다.
		 */
		_ckeckSubmitStatus: function(enter) {
			var flag = true;
			for(var name in this.selectedEl) {
				var el = this.selectedEl[name].parentNode.parentNode.parentNode;
				if (!Dom.hasClass(el, "is-valid") || Dom.hasClass(el, "is-invalid")) {
					flag = false;
					break;
				}
			}
			return flag;
		},
		
		/*
		 * _checkSubmitStatus()의 결과에 따라 submitEl에 class를 부여하는 작업을 한다.
		 */
		_updateUI: function(flag) {
			if (flag) {
				Dom.removeClass(this.submitEl, "disable");
				Dom.addClass(this.submitEl, "able");
			}
			else {
				Dom.removeClass(this.submitEl, "able");
				Dom.addClass(this.submitEl, "disable");
			}
		}
	};
	
	
	WILDGOOSE.account.super_type = Account;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}

}(this));

(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.account = WILDGOOSE.account || {};
	WILDGOOSE.account.change = WILDGOOSE.account.change || {};
	WILDGOOSE.account.change.pw = WILDGOOSE.account.change.pw || {};

	// 의존성 주입.
	var Account = WILDGOOSE.account.super_type;
	
	function ChangePw(args) {
		Account.call(this, args);
	};
	
	ChangePw.prototype = new Account();
	ChangePw.prototype.constructor = ChangePw;
	ChangePw.prototype._getPayload = function() {
		var email = escape(document.getElementById("userId").textContent);
		var oldPassword = SHA256(SHA256(escape(this.selectedEl.oldPassword.value)) + this.randNum);
		var newPassword = SHA256(escape(this.selectedEl.newPassword.value));
		var payload = "email=" + email + "&old_pw=" + oldPassword + "&new_pw="+newPassword;
		return payload;
	};

	
	WILDGOOSE.account.change.pw = ChangePw;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}    	

}(this));(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.account = WILDGOOSE.account || {};
	WILDGOOSE.account.join = WILDGOOSE.account.join || {};

	// 의존성 주입.
	var Account = WILDGOOSE.account.super_type;
	
	/*
	 * Account superType를 상속받는 subType
	 * 기생 조합 상속을 이용한다.
	 */
	function Join(args) {
		// join 생성시 Account를 this context에서 호출하고, 받았던 args인자를 다시 전달한다.
		Account.call(this, args);
	};
	
	/*
	 * Account 객체를 Join.prototype에 저장하고
	 * Join.prototype의 constructor를 Join으로 바꾸어 생성자를 분명히한다.
	 */
	Join.prototype = new Account();
	Join.prototype.constructor = Join;
	/*
	 * Account에 interface로만 존재했던
	 * _getPayload()를 overriding한다.
	 */
	Join.prototype._getPayload = function(){
		var email = escape(this.selectedEl.email.value);
		var password = SHA256(escape(this.selectedEl.password.value));
		var payload = "email=" + email + "&password=" + password;
		return payload;
	};
	
	WILDGOOSE.account.join = Join;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}    	

}(this));(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.account = WILDGOOSE.account || {};
	WILDGOOSE.account.logout = WILDGOOSE.account.logout || {};

	// 의존성 주입.
	var Account = WILDGOOSE.account.super_type;
	
	function Logout(args) {
		Account.call(this, args);
	};
	
	Logout.prototype = new Account();
	Logout.prototype.constructor = Logout;

	WILDGOOSE.account.logout = Logout;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}    	

}(this));(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.account = WILDGOOSE.account || {};
	WILDGOOSE.account.login = WILDGOOSE.account.login || {};

	// 의존성 주입.
	var Account = WILDGOOSE.account.super_type;
	
	function Login(args) {
		Account.call(this, args);
	};
	
	Login.prototype = new Account();
	Login.prototype.constructor = Login;
	Login.prototype._getPayload = function() {
		var email = escape(this.selectedEl.email.value);
		var password = SHA256(SHA256(escape(this.selectedEl.password.value)) + this.randNum);
		var payload = "email=" + email + "&password=" + password;
		return payload;
	};
	
	
	WILDGOOSE.account.login = Login;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}    	

}(this));(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.account = WILDGOOSE.account || {};
	WILDGOOSE.account.withdraw = WILDGOOSE.account.withdraw || {};

	// 의존성 주입.
	var Account = WILDGOOSE.account.super_type;
	
	function Withdraw(args) {
		Account.call(this, args);
	};
	
	Withdraw.prototype = new Account();
	Withdraw.prototype.constructor = Withdraw;
	Withdraw.prototype._getPayload = function() {
		var email = escape(document.getElementById("userId").textContent);
		var password = SHA256(SHA256(escape(this.selectedEl.password.value)) + this.randNum);
		var payload = "email=" + email + "&password=" + password + "&check=withdraw";
		return payload;
	};
	
	WILDGOOSE.account.withdraw = Withdraw;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}    	

}(this));(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.modal = WILDGOOSE.modal || {};
	WILDGOOSE.modal.change = WILDGOOSE.modal.change || {};
	WILDGOOSE.modal.change.pw = WILDGOOSE.modal.change.pw || {};

	// 의존성 선언 
//	var Account = WILDGOOSE.account;
	var Popup = CAGE.ui.popup;
	var Ajax = CAGE.ajax;
	var TemplateUtil = CAGE.util.template;
	var Dom = CAGE.util.dom;
//	var ChangePwAccount = WILDGOOSE.account.change.pw;
	var ChangePw = WILDGOOSE.account.change.pw;
	
	function init() {
		var changePwBtn = document.querySelector("#change-password");
		var randNum = null;
		var changePwPopup = new Popup.ajaxPopup({
			element: changePwBtn,
			templateUrl: "/api/v1/templates/changePassword.html",
			templateLoader: function(AjaxResponse) {
				var templateStr = JSON.parse(AjaxResponse).data.template;
				randNum = JSON.parse(AjaxResponse).data.rand;
				var userId = document.getElementById("userId").textContent;
//				console.log(AjaxResponse);
//				console.log("template Rand: " + randNum);
				var compiler = TemplateUtil.getCompiler(templateStr);
				return compiler({
					"randNum": randNum,
					"email": userId
				}, templateStr);
			}
		});
		
		changePwPopup.afteropen.add(function() {
			var args = {
				method: "PUT",
				url: "/api/v1/accounts/",
				form: ".form-container",
				rule: {
					oldPassword: {
						type: "password",
						extend: {
							exist: [ function(inputEl, callback) {
								Ajax.POST({
									isAsync: false,
									url: "/api/v1/session",
									success: function(responseObj) {
										console.log("Success!");
										var validity = true;
										var isProgressing = true;
										callback(validity, isProgressing);
									},
									failure: function(responseObj) {
										console.log("Failure!");
										var validity = false;
										var isProgressing = true;
										callback(validity, isProgressing);
									},
									data: (function() {
										var email = escape(document.getElementById("userId").textContent);
										var password = SHA256(SHA256(escape(inputEl.value)) + randNum);
										return "email=" + email + "&password=" + password;
									}())
								});
							}, "비밀번호가 다릅니다."]
						}
					},
					newPassword:{
						type: "password"
					},
					newConfirm: {
						type: "confirm",
						target: "newPassword"
					}
				},
				randNum: randNum
			};
			var ChangePwAccount = new ChangePw(args);
			changePwPopup.afterclose.add(ChangePwAccount.stop.bind(ChangePwAccount));

			var btn = arguments[0].querySelector("#change");
			btn.addEventListener("click", function(evt) {
				
				ChangePwAccount.exec(function() {
					changePwPopup.afterclose.add(function() {location.reload();});
					changePwPopup.close();
				}.bind(this));
				
			}, false);
			
			var oldPwDom = document.querySelector(".form-container input[name=oldPassword]");
			oldPwDom.focus();
			
		});
	}
	
	WILDGOOSE.modal.change.pw = {
		init: init
	};

	window.WILDGOOSE = WILDGOOSE;
	
	
	
}(this));(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.modal = WILDGOOSE.modal || {};
	WILDGOOSE.modal.join = WILDGOOSE.modal.join || {};

	// 의존성 선언
	var Ajax = CAGE.ajax; 
	var Popup = CAGE.ui.popup;
//	var JoinAccount = WILDGOOSE.account.join;
	var Join = WILDGOOSE.account.join;

	function init() {

		// 회원가입 버튼을 찾는다
		var joinBtn = document.querySelector("#join");
		
		// 버튼에 가입창을 연결시킨다
		var joinPopup = new Popup.ajaxPopup({
			element: joinBtn,
			templateUrl: "/api/v1/templates/account.html",
			templateLoader: function(AjaxResponse) {
				return JSON.parse(AjaxResponse).data.template;
			}
		});
		// 가입창에 스크립트를 적용한다.
		// Ajax로 불러온 팝업창에는 스크립트를 넣을 수 없기 때문이다.
		joinPopup.afteropen.add(function() {
			/*
			 * JoinAccount를 생성할때 인자로 전달하기위한 객체
			 */
			var args = {
				method: "POST",
				url: "/api/v1/accounts/",
				form: ".form-container",
				rule: {
					email: {
						type: "email"
					},
					password: {
						type: "password"
					},
					confirm: {
						type: "confirm",
						target: "password"
					}
				}
			};
			
			// Join객체를 생성한다.
			var JoinAccount = new Join(args);
			// joinPopup이 딷히면 JoinAccount.stop()을 호출하여 this.selectedEl에 붙어있던 keyup event를 해제한다.
			joinPopup.afterclose.add(JoinAccount.stop.bind(JoinAccount));

			var btn = arguments[0].querySelector("#create");
			btn.addEventListener("click", function(evt) {
				
				/*
				 * submit 버튼을 누르면
				 * JoinAccount의 exec()함수를 호출하여 ajax 통신을 한다.
				 * 
				 * exec()함수에 아래의 callback 함수를 전달하여
				 * exec()함수가 호출되면 joinPopup이 닫히도록 한다.
				 */ 
				JoinAccount.exec(function() {
					joinPopup.afterclose.add(function() {location.reload();});
					joinPopup.close();
				}.bind(this));
				
			}, false);
			
			var emailDom = document.querySelector(".form-container input[name=email]");
			emailDom.focus();
		});
	}

	WILDGOOSE.modal.join = {
		init: init
	}

	window.WILDGOOSE = WILDGOOSE;
}(this));
(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.modal = WILDGOOSE.modal || {};
	WILDGOOSE.modal.login = WILDGOOSE.modal.login || {};

	// 의존성 선언
	var Ajax = CAGE.ajax; 
	var Popup = CAGE.ui.popup;
	var TemplateUtil = CAGE.util.template;
//	var LoginAccount = WILDGOOSE.account.login;
	var Login = WILDGOOSE.account.login;

	function init() {
		var randNum = null;
		var loginBtn = document.querySelector("#login");
		var loginPopup = new Popup.ajaxPopup({
			element: loginBtn,
			templateUrl: "/api/v1/templates/login.html",
			templateLoader: function(AjaxResponse) {
				var templateStr = JSON.parse(AjaxResponse).data.template;
				randNum = JSON.parse(AjaxResponse).data.rand;
				var compiler = TemplateUtil.getCompiler(templateStr);
				return compiler({
					"randNum": randNum
				}, templateStr);		
			}
		});
				
		loginPopup.afteropen.add(function() {
			var args = {
				method: "POST",
				url: "/api/v1/session/",
				form: ".form-container",
				rule: {
					email: {
						type: "email",
						extend: {
							usable: [ function(inputEl, callback) {
								Ajax.GET({
									isAsync: false,
									url: "/api/v1/session?email=" + inputEl.value,
									success: function(responseObj) {
										var validity = true;
										var isProgressing = true;
										callback(validity, isProgressing);
									},
									failure: function(responseObj) {
										var validity = false;
										var isProgressing = true;
										callback(validity, isProgressing);
									}
								});
							}, "가입되지 않은 이메일입니다."]
						}
					},
					password: {
						type: "password"
					}
				},
				randNum: randNum
			};
			var LoginAccount = new Login(args);
			loginPopup.afterclose.add(LoginAccount.stop.bind(LoginAccount));
			
			var btn = arguments[0].querySelector("#create");
			btn.addEventListener("click", function(evt) {
				
				LoginAccount.exec(function() {
					loginPopup.afterclose.add(function() {location.reload();});
					loginPopup.close();
				}.bind(this), function() {
					var messageDiv = document.getElementById("result-msg");
					messageDiv.innerText = "비밀번호가 틀렸습니다.";
				});
				
			}, false);
			
			var emailDom = document.querySelector(".form-container input[name=email]");
			emailDom.focus();
		});
	}

	WILDGOOSE.modal.login = {
		init: init
	}

	window.WILDGOOSE = WILDGOOSE;
	
}(this));
(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.modal = WILDGOOSE.modal || {};
	WILDGOOSE.modal.withdraw = WILDGOOSE.modal.withdraw || {};

	// 의존성 선언 
//	var Account = WILDGOOSE.account;
	var Popup = CAGE.ui.popup;
	var TemplateUtil = CAGE.util.template;
	var Dom = CAGE.util.dom;
//	var LeaveAccount = WILDGOOSE.account.withdraw;
	var Leave = WILDGOOSE.account.withdraw;
	
	function init() {
		var leaveBtn = document.querySelector("#leave");
		var randNum = null;
		var leavePopup = new Popup.ajaxPopup({
			element: leaveBtn,
			templateUrl: "/api/v1/templates/withdraw.html",
			templateLoader: function(AjaxResponse) {
				var templateStr = JSON.parse(AjaxResponse).data.template;
				randNum = JSON.parse(AjaxResponse).data.rand;
				var userId = document.getElementById("userId").textContent;
				var compiler = TemplateUtil.getCompiler(templateStr);
				return compiler({
					"randNum": randNum,
					"email": userId
				}, templateStr);		
			}
		});
		
		leavePopup.afteropen.add(function() {
			var args = {
				method: "POST",
				url: "/api/v1/accounts/",
				form: ".form-container",
				rule: {
					password: {
						type: "password"
					},
					confirm: {
						type: "confirm",
						target: "password"
					}
				},
				randNum: randNum
			};
			var LeaveAccount = new Leave(args);
			leavePopup.afterclose.add(LeaveAccount.stop.bind(LeaveAccount));

			var btn = arguments[0].querySelector("#withdraw");
			btn.addEventListener("click", function(evt) {
				
				LeaveAccount.exec(function() {
					leavePopup.afterclose.add(function() {location.reload();});
					leavePopup.close();
				}.bind(this));
				
			}, false);
			
			var pwDom = document.querySelector(".form-container input[name=password]");
			pwDom.focus();
			
		});
	}
	
	WILDGOOSE.modal.withdraw = {
		init: init
	}

	window.WILDGOOSE = WILDGOOSE;
	
	
	
}(this));(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.search = WILDGOOSE.search || {};
	WILDGOOSE.search.more = WILDGOOSE.search.more || {};

	// 의존성 주입
	var Ajax = CAGE.ajax;
	var Template = CAGE.util.template;
	var Fav = WILDGOOSE.ui.favorite;
	
	var More = {
		init: function(args) {
			this.searchMoreBtn = args.button;
			this.searchResult = args.container;
			this.requestNum = args.requestNum;
			this.template = args.template;
			
			// 더보기 버튼 클릭이벤트 설정
			if (this.searchMoreBtn != null) {
				this.searchMoreBtn.addEventListener("click", this._more.bind(this), false);
				var curNumDiv = document.querySelector(".search-more .state-search-curNum");
				var curNum = parseInt(curNumDiv.innerText);
				this._selectStatusOfSearchMoreBtn(curNum);
			}
		},
		_more: function(evt) {
			// click evt
			var searchQuery = document.querySelector(".search-more .state-search-query").innerText;
			var curNum = document.querySelector(".search-more .state-search-curNum").innerText;
			// search
			var url = "/api/v1/search?q=" + searchQuery + "&start_item=" + curNum + "&how_many=" + this.requestNum;
			Ajax.GET({"url":url, "callback":this._responseHandler.bind(this)});
		},
		
		_responseHandler: function(rawD) {
			var userId = null;
			var reporters = JSON.parse(rawD)["data"]["reporters"];
			var isLogined = ((userId = this._getUserId()) != null)? true : false;
			
			// response data가 존재할 경우만 실행
			if (reporters.length != 0) {	
				var cards = this._makeReporterCards(isLogined, reporters);
				this._attachRecievedData(cards);
				var metaData = this._updateMetaData(cards.length);
				this._selectStatusOfSearchMoreBtn(metaData.curNum);
				Fav.updateFavs(metaData.curNum, this.requestNum);
				Fav.attatchEventToFavBtn(metaData.curNum, this.requestNum);
			}
		},
		
		// 현재 card의 개수를 업데이트
		_updateMetaData: function(updatedNum) {
			var curNumDiv = document.querySelector(".search-more .state-search-curNum");
			var curNum = parseInt(curNumDiv.innerText) + updatedNum;
			curNumDiv.innerText = curNum;
			
			return {"curNum": curNum};
		},
		
		// 더보기 버튼을 보여줄지 말지를 결정
		_selectStatusOfSearchMoreBtn: function(curNum) {
			var searchMore = document.querySelector(".search-more");
			var totalNumDiv = document.querySelector(".search-more .state-search-totalNum");
			if (totalNumDiv === null) {
				searchMore.setAttribute("style", "display: none;");
				return;
			}
			var totalNum = parseInt(totalNumDiv.innerText);
			if (totalNum <= curNum) {
				searchMore.setAttribute("style", "display: none;");
			}
		},
		
		// card template에 데이터를 담은 template array를 반환
		_makeReporterCards: function(isLogined, reporters) {
			var templateCompiler = Template.getCompiler();
			var className = "card card-reporter";
			var reporterNum = reporters.length;
			var cards = [];
		
			// card template을 cards array에 담음
			for (var i=0; i<reporterNum; i++) {
				var cardData = reporters[i];
				var newLi = '<li class="' + className + '">' + templateCompiler(cardData, this.template) + '</li>';
				cards.push(newLi);
			}
			
			return cards;
		},
		
		_getUserId: function() {
			var userId = document.getElementById("userId");
			if(userId != null){
				userId = document.getElementById("userId").getAttribute('email');
			}
			return userId;
		},
		
		_attachRecievedData: function(cards) {
			this.searchResult.innerHTML += cards.join("");
		}	
	};
	
	// 공개 메서드 노출
	WILDGOOSE.search.more = More;
})();
(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.search = WILDGOOSE.search || {};
	WILDGOOSE.search.auto_complement = WILDGOOSE.search.auto_complement || {};

	// 의존성 주입
	var Ajax = CAGE.ajax;
	
	var AutoComplement = {
		init : function(args) {
			this.row = {
				requestCount : args.list.requestNum,
				currentCount : 0
			};
			
			// ms
			this.interval = args.list.interval;

			this.is = {
				searching : false,
				hovering : false,
				pressedEnter : false,
				listing : false,
				highlighting : false
			};	
			this.box = args.searchBox;
			this.list = args.list.element;
			
			this.cache = {
				searchedQuery : this.box.value,
				row : null,
				callbackRef : {
					notify : this.notify.bind(this),
					expired : this.expired.bind(this),
					listHandler : this.listHandler.bind(this),
					drawList : this.drawList.bind(this),
					setHovering : this.setHovering.bind(this),
					observeState : this.observeState.bind(this)
				}
			};
			this.box.addEventListener("focus", this.cache.callbackRef.notify);
			this.box.addEventListener("blur", this.cache.callbackRef.expired);
		},

		expired : function(evt) {
			if (this.is.searching != false && this.is.hovering == false) {
				// list가 지워지지 않은 경우 제거
				if (this.is.listing == true) {
					this.removeList();
				}
				// value값 탐지 해제
				clearInterval(this.is.searching);
				this.is.searching = false;
			}
		},

		notify : function(evt) {
			if (this.is.searching == false) {
				this.is.searching = setInterval(this.cache.callbackRef.observeState, this.interval);
			}
		},
		
		observeState : function() {
			var curQuery = this.box.value;
			// curQuery 값이 변했을 경우만 처리
			if (curQuery != this.cache.searchedQuery) {
				console.log("detection: " + curQuery);
				if (curQuery == "") {
					// list 종료 로직.
					this.removeList();
				}
				else {
					this.search(curQuery);
				}
			}
		},
		
		search : function(searched) {
			this.cache.searchedQuery = searched;
			var url = "/api/v1/search?autocomplete=true&q=" + searched + "&how_many=" + this.row.requestCount;
			Ajax.GET({"url":url, "callback":this.cache.callbackRef.drawList});
		},
		
		drawList : function(response) {
			this.is.pressedEnter = false;
			var data = JSON.parse(response).data.reporters;
			console.log(data);
			if (data === undefined || data.length == 0) {
				return;
			}
			
			// cache.row 초기화
			this.cache.row = null;
			// 전달받은 row개수를 기록
			this.row.currentCount = data.length;
			var li_template = "";
			for (var i = 0; i < this.row.currentCount; i++) {
				li_template += "<li><div>" + data[i]["name"] + "</div></li>";
			}
			this.list.innerHTML = li_template;
			this.addList();
		},
		
		removeList : function() {
			this.is.listing = false;
			this.row.currentCount = 0;
			this.cache.row = null;
			this.list.style.display = "none";
			this.removeMouseRader(this.list);
			this.box.removeEventListener("keydown", this.cache.callbackRef.listHandler, false);
			this.list.removeEventListener("click", this.cache.callbackRef.listHandler, false);
			this.list.removeEventListener("mousemove", this.cache.callbackRef.listHandler, false);
			
			this.is.hovering = false;
		},
		addList : function() {
			this.is.listing = true;
			this.list.style.display = "inline-block";
			this.addMouseRader(this.list);
			this.box.addEventListener("keydown", this.cache.callbackRef.listHandler, false);
			this.list.addEventListener("click", this.cache.callbackRef.listHandler, false);
			this.list.addEventListener("mousemove", this.cache.callbackRef.listHandler, false);
		},
		addMouseRader : function(el) {
			el.addEventListener("mouseover", this.cache.callbackRef.setHovering, false);
			el.addEventListener("mouseout", this.cache.callbackRef.setHovering, false);
		},
		removeMouseRader : function(el) {
			el.removeEventListener("mouseover", this.cache.callbackRef.setHovering, false);
			el.removeEventListener("mouseout", this.cache.callbackRef.setHovering, false);
		},
		setHovering : function(evt) {
			if (evt.type == "mouseover") {
				this.is.hovering = true;
			}
			else if (evt.type == "mouseout") {
				this.is.hovering = false;
			}
		},
		listHandler : function(evt) {
			var targetEl = evt.target;
			// keydown event
			if (evt.type == "keydown" && targetEl == this.box) {
				console.log("keydown");
				var keyID = evt.keyCode;
				// up, down key
				if (keyID == 38 || keyID == 40) {
					// 위쪽화살표를 움직였을 때 포인터가 왼쪽으로 가는걸 방지하기 위해 기본 이벤트 해제
					evt.preventDefault();
					this.highlightRow(39 - keyID);
				}
				// enter key
				else if (keyID == 13) {
					// 엔터를 눌렀을 때 기본 이벤트가 실행되는걸 방지하기 위해 해제
					evt.preventDefault();
					this.selectEl(this.list.children[this.cache.row]);
				}
			}
			
			// click event
			else if (evt.type == "click" && targetEl.parentNode.parentNode == this.list && this.is.hovering == true) {
				this.is.hovering = false;
				this.selectEl(evt.target);
			}
			
			// mousemove event
			else if (evt.type == "mousemove") {
				if (this.is.highlighting == true) {
					this.highlightOut(this.cache.row);
				}
			}
		},
		
		selectEl : function(el) {
			var text = null;
			// 선택된 el이 없는 경우 검색창에 입력된 query가 됨.
			if (el === undefined) { text = this.box.value; }
			else { text = el.innerText; }
			
			text = this.removeNewline(text);
			this.box.value = text;
			
			// ajax통신이 일어나지 못하도록 캐싱된 마지막 검색 query를 바꾼다.
			this.cache.searchedQuery = text;
			this.removeList();
			this.box.form.submit();
		},
		
		removeNewline : function(text) {
			var index = text.lastIndexOf("\n");
			if (index == -1) return text;
			return text.substring(0, index);
		},
		
		highlightRow : function(change) {
			// 처음 입력시
			if (this.cache.row == null) {
				this.cache.row = 0;
				change = 0;
			}
			
			var cacheRow = this.cache.row;
			var currentRow = cacheRow - change;
			
			// ajax에서 응답받은 현재 row의 수와 비교함.
			if (currentRow >= this.row.currentCount) { currentRow = 0; }
			else if (currentRow < 0) { currentRow = this.row.currentCount-1; }

			this.highlightOut(cacheRow);
			this.highlightIn(currentRow);
			this.cache.row = currentRow;
		},

		highlightIn : function(rowNum) {
			this.is.highlighting = true;
			this.list.children[rowNum].className = "highlight";
		},
		highlightOut : function(rowNum) {
			if (rowNum !== null) {
				this.is.highlighting = false;
				this.list.children[rowNum].className = "";
			}
		}
	};
	
	// 공개 메서드 노출
	WILDGOOSE.search.auto_complement = AutoComplement;
})();(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.search = WILDGOOSE.search || {};
	WILDGOOSE.search.submit = WILDGOOSE.search.submit || {};

	// 의존성 주입
	var String = CAGE.util.string;
	
	var Submit = {
		init: function(args) {
			this.box = args.box;
			this.form = this.box.form;
			this.submit = args.box;
			
			if (this.form !== undefined) {
				this.form.addEventListener("submit", this._handler.bind(this), false);
			}
		},
		
		_handler: function(evt) {
			if (String.trim(this.box.value) === "") {
				evt.preventDefault();
			}
		}
	}
	
	// 공개 메서드 노출
	WILDGOOSE.search.submit = Submit;
})();
(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.search = WILDGOOSE.search || {};

	// 의존성 주입
	var Ajax = CAGE.ajax;
	var Template = CAGE.util.template;
	var More = WILDGOOSE.search.more;
	var AutoComplement = WILDGOOSE.search.auto_complement;
	var Submit = WILDGOOSE.search.submit;
	
	var Search = {
		init: function(args) {
			// search
			var search = args.search;
			if (search !== undefined) {
				this.form = {
					box: document.querySelector(search.box),
					container: document.querySelector(search.container)
				};
				
				this.search = {
					submit: document.querySelector(search.submit),
					requestNum: search.requestNum,
					templateURL: search.templateURL,
					template: Template.get({"url":search.templateURL})
				};
				
				// initialize submit button
				var submitArgs = {
					box: this.form.box,
					submit: this.search.submit
				};
				Submit.init(submitArgs);
				
			}
			
			// initialize auto completion list
			var autocompletion = args.autocompletion;
			if (autocompletion !== undefined) {
				this.list = {
					element: document.querySelector(args.autocompletion.list),
					requestNum: autocompletion.requestNum,
					interval: 100
				};
				AutoComplement.init({searchBox: this.form.box, list: this.list});
			}
			
			// initialize more button
			var more = args.more;
			if (more !== undefined) {
				this.more = {
					button: document.querySelector(more.button)
				}
				More.init({button: this.more.button, container: this.form.container, template: this.search.template, requestNum: this.search.requestNum});
			}
			
			// box focus status
			this.form.box.focus();
		}
	};
	
	// 공개 메서드 노출
	WILDGOOSE.search = {
		init: Search.init
	}
})();
