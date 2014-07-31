(function() {
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;

	// 사용할 네임 스페이스 확보
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.user = WILDGOOSE.user || {};

	var Ajax = CAGE.ajax;

	var User = {
		randNum : null,
		userId : undefined, // null이 아닌 이유는, 어디선가 userId를 undefined로 조건을 확인하여
							// 잠재적인 버그를 없애고자 땜빵함.,
		mobileStatus: undefined,
		getId : function() {
			if (this.userId !== undefined) {
				return this.userId;
			}

			var userIdDiv = document.getElementById("userId");
			if (userIdDiv !== null) {
				this.userId = userIdDiv.innerText;
			}
			return this.userId;
		},
		isLogined : function() {
			if (this.getId() == "") {
				return false;
			}
			return true;
		},
		getRandomNumber : function() {
			if (this.randNum !== null) {
				return this.randNum;
			}

			Ajax.GET({
				isAsync : false,
				url : "/api/v1/session/rand",
				success : function(responseObj) {
					this.randNum = responseObj.data.rand;
				}.bind(this)
			});
			return this.randNum;
		},
		isMobile : function() {
			if (this.mobileStatus !== undefined) {
				return this.mobileStatus
			}

			(function(a) {
				if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
						.test(a)
						|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
								.test(a.substr(0, 4)))
					this.mobileStatus = true
			}.bind(this))(navigator.userAgent || navigator.vendor || window.opera);
			
			return this.mobileStatus;
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
})();/**
 * 외부에서는 WILDGOOSE.drag.exe(args)로 드래스 함수에 접근할 수 있다.
 * 전달해야 하는 인자 args는 dictionary로 인자는 3개이
 * 
 * 1. target: 드래그 되어야 하는 DOM들을 담고있는 DOM 		ex.ul
 * 2. tagName: 드래가 되는 DOM의 태그이름 				ex."LI"(태그이름은 모두 대문자임을 주의)
 * 3. movedClassName: 드래그 중인 DOM의 클래스명. 드래그 중의 CSS를 위한 것. 	ex. 드래그 중인 DOM은 투명도를 조절 함  
 * 
 * */

(function(window){

'use strict';
var document = window.document;
var console = window.console;

var WILDGOOSE = window.WILDGOOSE || {};
WILDGOOSE.drag = WILDGOOSE.drag || {};

var User = WILDGOOSE.user;
	
var values = {sourceEle : null, destEle : null};

		function _dragStart(e){
			var tar = e.target;
			tar.classList.add(values.movedClassName);
			
			e.dataTransfer.effectAllowed = 'move';
			if(tar.tagName == values.tagName){
				values.sourceEle = tar;
			}
		}
		
		function _dragOver(e){
			if(e.preventDefault){
				e.preventDefault();
			}
			e.dataTransfer.dropEffect = 'move'; //cursor 모양
			
			return false;
		}
		
		function _drop(e){
			var tar = e.target;
			if(e.stopPropagation){
				e.stopPropagation(); //browser redirecting 방지
			}
			
			while(true){
				if(tar.tagName == values.tagName){
					values.destEle = tar;
					break;
				}
				tar = tar.parentNode;
			}
			
			return false;
		}
		
		function _dragEnd(e){
			e.preventDefault();
			var tar = e.target;
			if(tar.className.indexOf(values.movedClassName) != -1){
				tar.classList.remove(values.movedClassName);
			}
			
			if(values.destEle != null &&values.sourceEle != null){
				values.destEle.insertAdjacentElement('afterend',values.sourceEle);
			}
			
			_localSave();
		}
		
		function _addEvent(target){
			if (target !== null) {
				var children = target.children;
				[].forEach.call(children, function(child){
					child.draggable = "true";
					child.addEventListener('dragstart', function(e){ _dragStart(e);}, false);
					child.addEventListener('dragover', function(e){ _dragOver(e);}, false);
					child.addEventListener('drop', function(e){ _drop(e);}, false);
					child.addEventListener('dragend', function(e){ _dragEnd(e);}, false);
//					child.style.transition = "all 2s";
//					child.style.WebkitTransition = "all 2s";
					
				});
			}
		}
		
		function execute(args){
			values.target = args.body;
			values.tagName = args.tagName;
			values.movedClassName = args.movedClassName;
			
			_addEvent(args.body);
			_myAuthorOrder();

			
		}
		
		//test
		function _localSave(){
			var testString ="";
			var child = values.target.children;
			for(var i=0; i < child.length-1; i++){ // 빈 리스트 때문에 -1을 해 줌
				testString = testString+child[i].firstElementChild.getAttribute('data-reporter_id')+" ";
			}
			
			localStorage.setItem(User.getId(), testString);
		}
		
		function _myAuthorOrder(){
			var ul = document.querySelector('.dashboard-left ul');
			
			if (ul !== null) {
				var child = ul.children;
				if(localStorage.getItem(User.getId()) == undefined) return;
				var numLi = localStorage.getItem(User.getId()).split(" ");
				numLi.pop(); // 빈 값("") 때문에 -1을 해 줌
				
				for(var j=0; j<numLi.length; j++){ 
					for(var i=0; i<child.length-1; i++){ // 빈 리스트 때문에 -1을 해 줌
						if(child[i].firstElementChild != null){
							if(child[i].firstElementChild.getAttribute('data-reporter_id')==numLi[j]){
								ul.appendChild(child[i]);
							}
						}
					}
				}
				
				var lastCard = document.querySelector('.card-last');
				ul.appendChild(lastCard);
			}
		}

		
		WILDGOOSE.drag = {
			exe : execute
		};

	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}	   	

}(this));(function() {
	'use strict';
	var document = window.document;
	var console = window.console;

	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.ui = WILDGOOSE.ui || {};
	WILDGOOSE.favorite = WILDGOOSE.favorite || {};
	
	// 의존성 선언
	var Ajax = CAGE.ajax;
	var Dom = CAGE.util.dom;
	var User = WILDGOOSE.user;
	
	function Star(element) {
		if (element == null) {
			console.error("No element found");
			return;
		}
		this.star = element;
		this.reporterId = this.getReporterId();
		this.show();
		this.attatchEvent();
	}
	
	Star.prototype = {
		constructor: Star,
		show: function() {
			Dom.removeClass(this.star, "invisible");
		},
		getReporterId: function(){
			var reporterId = this.star.parentElement.parentElement.dataset["reporter_id"];
			return parseInt(reporterId);
		},
		toggleStar: function(onoff) {
			var star = this.star;
			var card = star.parentElement.parentElement.parentElement;
			if (onoff == true) {
				Dom.addClass(star, "on");
				Dom.removeClass(star, "off");
			} else if (onoff == false) {
				Dom.removeClass(star, "on");
				Dom.addClass(star, "off");
			}
		},

		clickStar : function(e) {
			var star = e.target;
			var card = star.parentElement.parentElement.parentElement;
			var reporterId = card.firstElementChild.dataset.reporter_id;
			var url = "/api/v1/users/" + Favorite.userId + "/favorites/?reporter_id="
					+ reporterId;

			if (Dom.hasClass(star, "on")) {
				Ajax.DELETE({
					"url" : url,
					"success" : function(responseObj) {
						this.toggleStar(false);
					}.bind(this),
					"failure" : function(responseObj) {
						console.log("Failure!");
					},
					"error" : function(responseObj) {
						console.log("Error!");
					}
				});
			} else {
				Ajax.POST({
					"url" : url,
					"success" : function(responseObj) {
						this.toggleStar(true);
					}.bind(this),
					"failure" : function(responseObj) {
						console.log("Failure!");
					},
					"error" : function(responseObj) {
						console.log("Error!");
					}
				});
			}
		},
		attatchEvent: function() {
			this.star.addEventListener("click", this.clickStar.bind(this), false);
			this.star.addEventListener("click", function(e) {
				Dom.addClass(e.target, "pumping");
				setTimeout(function() {
					Dom.removeClass(e.target, "pumping");
				}, 300)
			}, false);
		},
		updateStar: function() {
			var url = "/api/v1/users/:userId/favorites/:reporterId";
			url.replace(":userId", this.userId);
			url.replace(":reporterId", this.reporterId)
			Ajax.GET({
				"url" : url,
				"callback" : function(jsonStr) {
					var result = JSON.parse(jsonStr);
					if (result.data.bool == true) {
						this.toggleStar();
					}
				}.bind(this)
			});
		}

	}
	
	var Favorite = {
		starList: [],
		userFavorites: [],
		
		init: function() {
			var userId = User.getId();
			if (userId == "" || userId == undefined) {
				console.error("Not logined");
				return;
			}
			this.userId = userId;
			
			var favStars = document.querySelectorAll(".star");
			for (var i = 0; i < favStars.length; i++) {
				var favStar = favStars[i];
				var star = new Star(favStar);
				this.starList.push(star);
			}
			this.getStarListFromServer();
		},

		addCards: function(conatiner) {
			var userId = User.getId();
			if (userId == "" || userId == undefined) {
				return;
			}
			var stars = conatiner.querySelectorAll(".star");
			Array.prototype.forEach.call(stars, function(value){
				var star = new Star(value);
				if (this.userFavorites.indexOf(star.reporterId) >= 0) {
					star.toggleStar(true);
				}
				
			}.bind(this));
		},
		updateStars: function(stars) {
			for (var i = 0; i < stars.length; i++) {
				var star = stars[i];
				if (this.userFavorites.indexOf(star.reporterId) >= 0) {
					star.toggleStar(true);
				}
			}
		},
		getStarListFromServer: function() {
			var url = "/api/v1/users/:userId/favorites/";
			url = url.replace(":userId", this.userId);
			Ajax.GET({
				"url" : url,
				"callback" : function(jsonStr) {
					var result = JSON.parse(jsonStr);
					var reporterCards = result["data"]["reporterCards"];
					for (var i=0; i<reporterCards.length; i++) {
						var card = reporterCards[i];
						Favorite.userFavorites.push(card["id"]);
					}
					this.updateStars(this.starList);
				}.bind(this)
			});
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

})();
(function() {
	'use strict';
	var document = window.document;
	var console = window.console;

	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.ui = WILDGOOSE.ui || {};
	WILDGOOSE.ui.favorite = WILDGOOSE.ui.favorite || {};
	WILDGOOSE.ui.favorite.me = WILDGOOSE.ui.favorite.me || {};
	
	// 의존성 선언
	var Ajax = CAGE.ajax;
	var Dom = CAGE.util.dom;
	var User = WILDGOOSE.user;
	
	function Star(element) {
		if (element == null) {
			console.error("No element found");
			return;
		}
		this.star = element;
		this.reporterId = this.getReporterId();
		this.show();
		this.attatchEvent();
	}
	
	Star.prototype = {
		constructor: Star,
		show: function() {
			Dom.removeClass(this.star, "invisible");
		},
		getReporterId: function(){
			var reporterId = this.star.parentElement.parentElement.dataset["reporter_id"];
			return parseInt(reporterId);
		},
		toggleStar: function(onoff) {
			var star = this.star;
			var card = star.parentElement.parentElement.parentElement;
			var leftList = document.querySelector(".dashboard-left");
			var rightList = document.querySelector(".dashboard-right");
			if (onoff == true) {
				Dom.addClass(star, "on");
				Dom.removeClass(star, "off");
				Dom.removeClass(card, "blur");
				if (Dom.isDescendant(rightList, card)) {
					console.log("right to left");
					
					var container = document.querySelector(".container");
					var containerPos = container.getBoundingClientRect();
					var curPos = card.getBoundingClientRect();
					card.style.position = "absolute";
					card.style.width = curPos.width + "px";
					card.style.height = curPos.height + "px";
					card.style.top = curPos.top - containerPos.top + "px";
					card.style.left = curPos.left - containerPos.left + "px";
					card.style.zIndex = 1;
					
					var lastCard = document.querySelector(".card-last");
					var lastCardPos = lastCard.getBoundingClientRect();
					var margin = 10;
					card.style.top = lastCardPos.top - containerPos.top - margin + "px";
					card.style.left = lastCardPos.left - containerPos.left + "px";
					
					setTimeout(function() {
						document.querySelector(".dashboard-left > ul").insertBefore(card.parentNode.removeChild(card), lastCard);
						card.style.position = "";
						card.style.width = "";
						card.style.height = "";
						card.style.top = "";
						card.style.left = "";
						card.style.zIndex = "";
					}, 500);
				}
			} else if (onoff == false) {
				Dom.removeClass(star, "on");
				Dom.addClass(star, "off");
				if (Dom.isDescendant(leftList, card)) {
					Dom.addClass(card, "blur");
				}
			}
		},

		clickStar : function(e) {
			var star = e.target;
			var card = star.parentElement.parentElement.parentElement;
			var reporterId = card.firstElementChild.dataset.reporter_id;
			var url = "/api/v1/users/" + Favorite.userId + "/favorites/?reporter_id="
					+ reporterId;

			if (Dom.hasClass(star, "on")) {
				Ajax.DELETE({
					"url" : url,
					"success" : function(responseObj) {
						this.toggleStar(false);
					}.bind(this),
					"failure" : function(responseObj) {
						console.log("Failure!");
					},
					"error" : function(responseObj) {
						console.log("Error!");
					}
				});
			} else {
				Ajax.POST({
					"url" : url,
					"success" : function(responseObj) {
						this.toggleStar(true);
					}.bind(this),
					"failure" : function(responseObj) {
						console.log("Failure!");
					},
					"error" : function(responseObj) {
						console.log("Error!");
					}
				});
			}
		},
		attatchEvent: function() {
			this.star.addEventListener("click", this.clickStar.bind(this), false);
			this.star.addEventListener("click", function(e) {
				Dom.addClass(e.target, "pumping");
				setTimeout(function() {
					Dom.removeClass(e.target, "pumping");
				}, 300)
			}, false);
		},
		updateStar: function() {
			var url = "/api/v1/users/:userId/favorites/:reporterId";
			url.replace(":userId", this.userId);
			url.replace(":reporterId", this.reporterId)
			Ajax.GET({
				"url" : url,
				"callback" : function(jsonStr) {
					var result = JSON.parse(jsonStr);
					if (result.data.bool == true) {
						this.toggleStar();
					}
				}.bind(this)
			});
		}

	}
	
	var Favorite = {
		starList: [],
		userFavorites: [],
		
		init: function() {
			var userId = User.getId();
			if (userId == "" || userId == undefined) {
				console.error("Not logined");
				return;
			}
			this.userId = userId;
			
			var favStars = document.querySelectorAll(".star");
			for (var i = 0; i < favStars.length; i++) {
				var favStar = favStars[i];
				var star = new Star(favStar);
				this.starList.push(star);
			}
			this.getStarListFromServer();
		},

		addCards: function(conatiner) {
			var userId = User.getId();
			if (userId == "" || userId == undefined) {
				return;
			}
			var stars = conatiner.querySelectorAll(".star");
			Array.prototype.forEach.call(stars, function(value){
				var star = new Star(value);
				if (this.userFavorites.indexOf(star.reporterId) >= 0) {
					star.toggleStar(true);
				}
				
			}.bind(this));
		},
		updateStars: function(stars) {
			for (var i = 0; i < stars.length; i++) {
				var star = stars[i];
				if (this.userFavorites.indexOf(star.reporterId) >= 0) {
					star.toggleStar(true);
				}
			}
		},
		getStarListFromServer: function() {
			var url = "/api/v1/users/:userId/favorites/";
			url = url.replace(":userId", this.userId);
			Ajax.GET({
				"url" : url,
				"callback" : function(jsonStr) {
					var result = JSON.parse(jsonStr);
					var reporterCards = result["data"]["reporterCards"];
					for (var i=0; i<reporterCards.length; i++) {
						var card = reporterCards[i];
						Favorite.userFavorites.push(card["id"]);
					}
					this.updateStars(this.starList);
				}.bind(this)
			});
		}
	};
	
	WILDGOOSE.ui.favorite.me = Favorite;
	
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
})();(function() {
	'use strict';
	var document = window.document;
	var console = window.console;

	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.ui = WILDGOOSE.ui || {};
	WILDGOOSE.ui.startme = WILDGOOSE.ui.startme || {};
	
	// 의존성 선언
	var Ajax = CAGE.ajax;
	var Dom = CAGE.util.dom;
	var User = WILDGOOSE.user;
	
	var StartMe = {
		init: function(args) {
			this.startBtn = args.button;
			this.starEls = args.target;
			this.targetArr = [];
			
			this.startBtn.addEventListener("click", this.start, false);
			
			if (this.startBtn !== null && this.starEls !== null) {
				Array.prototype.forEach.call(this.starEls, function(node) {
					node.addEventListener("click", this.check.bind(this), false);
				}.bind(this));
			}
		},
		
		check: function(evt) {
			Dom.removeClass(this.startBtn, "disable");
		},
		
		start: function(evt) {
			location.href = "/me/" + User.getId();
		}
	}

	WILDGOOSE.ui.startme = StartMe;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}	

})();
(function(window) {
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
				Dom.addClass(this.submitEl, "enable");
			}
			else {
				Dom.removeClass(this.submitEl, "enable");
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
	WILDGOOSE.modal.join = WILDGOOSE.modal.join || {};

	// 의존성 선언
	var Ajax = CAGE.ajax; 
	var Template = CAGE.util.template;
	var Popup = CAGE.ui.popup.super_type;
//	var JoinAccount = WILDGOOSE.account.join;
	var Join = WILDGOOSE.account.join;

	
	var JoinModal = {
		init: function() {
			// 회원가입 버튼을 찾는다
			this.joinBtn = document.querySelector("#join");
			
			// 버튼에 가입창을 연결시킨다
			this.template = Template.get({"url":"/api/v1/templates/join.html"});
			
			this.joinPopup = new Popup({
				element: this.joinBtn,
				template: this.template
			});
			
			// 가입창에 스크립트를 적용한다.
			// Ajax로 불러온 팝업창에는 스크립트를 넣을 수 없기 때문이다.
			this.joinPopup.afteropen.add(this._openPopup.bind(this));
		},
		
		_openPopup: function() {
			this._accountInit();
			var btn = arguments[0].querySelector("#create");
			btn.addEventListener("click", this._clickHandler.bind(this), false);
			
			var emailDom = document.querySelector(".form-container input[name=email]");
			emailDom.focus();
		},
		
		_closePopup: function() {
			this.joinPopup.afterclose.add(function() {location.reload();});
			this.joinPopup.close();
		},
		
		_accountInit: function() {
		
			// Join객체를 생성한다.
			this.joinAccount = new Join({
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
			});
			
			// joinPopup이 딷히면 JoinAccount.stop()을 호출하여 this.selectedEl에 붙어있던 keyup event를 해제한다.
			this.joinPopup.afterclose.add(this.joinAccount.stop.bind(this.joinAccount));
		},
		
		_clickHandler: function(evt) {

			/*
			 * submit 버튼을 누르면
			 * JoinAccount의 exec()함수를 호출하여 ajax 통신을 한다.
			 * 
			 * exec()함수에 아래의 callback 함수를 전달하여
			 * exec()함수가 호출되면 joinPopup이 닫히도록 한다.
			 */ 
			this.joinAccount.exec(this._closePopup.bind(this));
		}
	}
	
	WILDGOOSE.modal.join = JoinModal;

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
	WILDGOOSE.modal = WILDGOOSE.modal || {};
	WILDGOOSE.modal.login = WILDGOOSE.modal.login || {};

	// 의존성 선언
	var Ajax = CAGE.ajax; 
	var Template = CAGE.util.template;
	var Popup = CAGE.ui.popup.super_type;
	
	var TemplateUtil = CAGE.util.template;
//	var LoginAccount = WILDGOOSE.account.login;
	var Login = WILDGOOSE.account.login;
	var User = WILDGOOSE.user;
	
	
	var LoginModal = {
		init: function() {
			this.loginBtn = document.querySelector("#login");
			this.template = Template.get({"url":"/api/v1/templates/login.html"});
			
			this.loginPopup = new Popup({
				element: this.loginBtn,
				template: this.template
			});
			
			// 가입창에 스크립트를 적용한다.
			// Ajax로 불러온 팝업창에는 스크립트를 넣을 수 없기 때문이다.
			this.loginPopup.afteropen.add(this._openPopup.bind(this));
		},
		
		_openPopup: function() {
			this._accountInit();
			var btn = arguments[0].querySelector("#create");
			btn.addEventListener("click", this._clickHandler.bind(this), false);
			
			var emailDom = document.querySelector(".form-container input[name=email]");
			emailDom.focus();
		},
		
		_closePopup: function() {			
			this.loginPopup.afterclose.add(function() {location.reload();});
			this.loginPopup.close();
		},
		
		_accountInit: function() {
			var randNum = User.getRandomNumber();
			this.loginAccount = new Login({
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
									error: function(responseObj) {
										console.log("Error!")
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
			});
			this.loginPopup.afterclose.add(this.loginAccount.stop.bind(this.loginAccount));
		},
		
		_clickHandler: function(evt) {
			this.loginAccount.exec(this._closePopup.bind(this), function() {
				var messageDiv = document.getElementById("result-msg");
				messageDiv.innerText = "비밀번호가 틀렸습니다.";
			});
		}
	}
	
	WILDGOOSE.modal.login = LoginModal;

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
	WILDGOOSE.modal = WILDGOOSE.modal || {};
	WILDGOOSE.modal.setting = WILDGOOSE.modal.setting || {};

	// 의존성 선언
	var Ajax = CAGE.ajax; 
	var Popup = CAGE.ui.popup.super_type;
	var Template = CAGE.util.template;
	
	var Withdraw = WILDGOOSE.account.withdraw;
	var ChangePw = WILDGOOSE.account.change.pw;
	var User = WILDGOOSE.user;
	
	var SettingModal = {
		init: function() {
			this.button = {
				setting: document.querySelector("#setting"),
				withdraw: null,
				changePw: null
			};
		
			this.cache = {
				settingHandler: this._settingHandler.bind(this),
				submitHandler: this._submitHandler.bind(this),
				openPopup: this._openPopup.bind(this),
				closePopup: this._closePopup.bind(this),
				withdraw: this._withdraw.bind(this),
				changePw: this._changePw.bind(this)
			};
			
			this.template = {
				setting: Template.get({"url":"/api/v1/templates/setting.html"}),
				withdraw: null,
				changePw: null
			};
			
			this.account = {
				withdraw: null,
				changePw: null
			}
			
			this.settingPopup = new Popup({
				element: this.button.setting,
				template: this.template.setting
			});
			
			this.settingPopup.afteropen.add(this.cache.openPopup);
		},		
		
		_openPopup: function() {
			this._addClickEvent();
			this._getTemplates();
		},
		
		_closePopup: function() {
			this._removeClickEvent();
			this.settingPopup.afterclose.add(function() {location.reload();});
			this.settingPopup.close();
		},
		
		_settingHandler: function(evt) {
			var targetEl = evt.target;
			console.log(targetEl);
			this._selectUI(targetEl.name);
		},
		
		_addClickEvent: function() {
			this.button.withdraw = document.querySelector("#withdraw");
			this.button.changePw = document.querySelector("#changePw");
			
			this.button.withdraw.addEventListener("click", this.cache.settingHandler, false);
			this.button.changePw.addEventListener("click", this.cache.settingHandler, false);
		},
		
		_removeClickEvent: function() {
			this.button.withdraw.removeEventListener("click", this.cache.settingHandler, false);
			this.button.changePw.removeEventListener("click", this.cache.settingHandler, false);
		},
		
		_selectUI: function(name) {
			var template = this.template[name];
			var popupContent = document.querySelector(".popup-content");
			if (template !== null) {
				popupContent.innerHTML = template;
				// account init				
				this._accountInit(name);
			}
		},
		
		
		_accountInit: function(name) {
			// init
			this.cache[name]();
			
			// afterclose
			this.settingPopup.afterclose.add(this.account[name].stop.bind(this.account[name]));
			
			// submitEl init
			var submitEl = document.querySelector(".form-container button[name=submit]");
			submitEl.addEventListener("click", this.cache.submitHandler, false);
			
			
			// focus first input element
			var partialSelector = (name == "changePw")?"oldP":"p";
			var firstInputEl = document.querySelector(".form-container input[name=" + partialSelector + "assword]");
			firstInputEl.focus();
		},

		_submitHandler: function(evt) {
			var targetEl = evt.target
			var name = targetEl.form.name;
			
			this.account[name].exec(this.cache.closePopup);
		},
		
		_withdraw: function() {
			this.account.withdraw = new Withdraw({
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
				randNum: User.getRandomNumber()
			});
		},
		
		_changePw: function() {
			this.account.changePw = new ChangePw({
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
									error: function(responseObj) {
										console.log("Error!")
									},
									data: (function() {
										var email = User.getId();
										var password = SHA256(SHA256(escape(inputEl.value)) + User.getRandomNumber());
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
				randNum: User.getRandomNumber()
			});
		},
		
		
		_getTemplates: function() {
			if (this.template.withdraw === null) {
				var template = Template.get({"url":"/api/v1/templates/withdraw.html"});
				var compiler = Template.getCompiler(template);
				this.template.withdraw = compiler({
					"email": User.getId()
				}, template);
			}
			
			if (this.template.changePw === null) {				
				var template = Template.get({"url":"/api/v1/templates/changePassword.html"});
				var compiler = Template.getCompiler(template);
				this.template.changePw = compiler({
					"email": User.getId()
				}, template);
			}
		}
	}
	

	WILDGOOSE.modal.setting = SettingModal;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}
}(this));
(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.more = WILDGOOSE.more || {};
	WILDGOOSE.more.super_type = WILDGOOSE.more.super_type || {};

	// 의존성 주입
	var Ajax = CAGE.ajax;
	var EventEmitter = CAGE.event.emitter;
	var Template = CAGE.util.template;
	var User = WILDGOOSE.user;
	
	function More (args) {
		this._more(args);
	};
	
	More.prototype = {
		constructor: "More",
		_more: function(args) {
			if (args !== undefined) {
				this.presuccess = new EventEmitter("presuccess");
				this.postsuccess = new EventEmitter("postsuccess")
				
				this.moreBtnEl = args.more.button;
				this.container = args.container;
				this.requestNum = args.requestNum;
				this.template = args.template;
				this.templateCompiler = Template.getCompiler();
				
				this.metadata = {
					curNum : args.more.curNum,
					totalNum: args.more.totalNum,
					updatedNum: 0,
					keyword: args.keyword
				};
				
				this.cache = {
					exec: this._exec.bind(this),
					scrollingHandler: this._scrollingHandler.bind(this)
				};
				
				this.status = {
					exec: true
				};
				
				// 더보기 버튼 클릭이벤트 설정
				if (this.moreBtnEl != null) {
					this.moreBtnEl.addEventListener("click", this.cache.exec, false);
					this.moreBtnEl.addEventListener("approachPageEnd", this.cache.exec, false);
					this._updateUI();
				}
			}
		},
		
		_exec: function(evt) {
			// 현재함수 사용 가능여부 확인
			if (this.status.exec) {
				// 사용 못하도록 방지				
				this.status.exec = false;

				// search
				Ajax.GET({
					"url": this.getURL(),
					"success" : this._successHandler.bind(this),
					"failure" : this.failure,
					"error" : this.error
				});
			}
		},
		
		_addPageEndEvent: function() {
			window.addEventListener("scroll", this.cache.scrollingHandler, false);
		},
		_removePageEndEvent: function() {
			window.removeEventListener("scroll", this.cache.scrollingHandler, false);
		},
		
		_scrollingHandler: function(evt) {
			if (this.getApproachEventCondition()) {
				var approachPageEndEvt = new CustomEvent("approachPageEnd");
				this.moreBtnEl.dispatchEvent(approachPageEndEvt);
			}
		},
		
		_successHandler: function(responseObj) {
			var dataObj = this.success(responseObj);
			
			// response data가 존재할 경우만 실행
			if (dataObj !== undefined && dataObj.length != 0) {
				
				// template화 하기전.
				this.presuccess.dispatch(dataObj);
				
				var dataArr = this._moldDataIntoTempate(dataObj);
				this._attachRecievedData(dataArr);
				
				// template화하여 화면에 붙인
				this.postsuccess.dispatch(this.container);
				
				this._updateMetaData(dataArr.length);
				this._updateUI();
				
				// 사용 가능하도록 설정 변경
				this.status.exec = true;
				
			}
		},
		
		getApproachEventCondition: function() {
			/*
			 * interface
			 * do-something
			 */
			return false;
		},
		
		getURL: function() {
			/*
			 * interface
			 * do-something
			 */
			return "";
		},
		
		getMoldedData: function(data, templateCompiler, template) {
			/*
			 * interface
			 * do-something
			 */
			return "";
		},
		
		success: function(responseObj) {
			/*
			 * interface
			 * do-something
			 */
		},
		
		failure: function(responseObj) {
			/*
			 * interface
			 * do-something
			 */
		},
		
		error: function(responseObj) {
			/*
			 * interface
			 * do-something
			 */
		},
		
		// 현재 card의 개수를 업데이트
		_updateMetaData: function(updatedNum) {
			this.metadata.updatedNum = updatedNum;
			this.metadata.curNum += updatedNum;
		},
		
		// 더보기 버튼을 보여줄지 말지를 결정
		_updateUI: function() {
			var totalNum = this.metadata.totalNum;
			var curNum = this.metadata.curNum;
			this._addPageEndEvent();
			
			if (totalNum == 0 || totalNum <= curNum) {
				this._removePageEndEvent();
				this.moreBtnEl.setAttribute("style", "display: none;");
			}
		},
		
		_moldDataIntoTempate: function(dataObj) {			
			var dataLength = dataObj.length;
			var dataArr = [];
		
			// card template을 cards array에 담음
			for (var i=0; i<dataLength; i++) {
				var data = dataObj[i];
				var moldedData = this.getMoldedData(data, this.templateCompiler, this.template);
				dataArr.push(moldedData);
			}
			
			return dataArr;
		},
				
		_attachRecievedData: function(dataArr) {
			this.container.innerHTML += dataArr.join("");
		}
	};

	// 공개 메서드 노출
	WILDGOOSE.more.super_type = More;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}    
})();
(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.search = WILDGOOSE.search || {};
	WILDGOOSE.search.article = WILDGOOSE.search.article || {};

	// 의존성 주입
	var More = WILDGOOSE.more.super_type;
	var User = WILDGOOSE.user;
	
	function ArticleMore(args) {
		More.call(this, args);
	};
	
	ArticleMore.prototype = new More();
	ArticleMore.prototype.constuctor = ArticleMore;
	ArticleMore.prototype.getApproachEventCondition = function(evt) {
		var footer = document.querySelector(".footer");
		var viewportHeight = window.innerHeight;
		var footerHeight = parseInt(window.getComputedStyle(footer, null).height);
		var footerTopPos = footer.getBoundingClientRect().bottom - footerHeight;
		
		/*
		 *  mobile 상태 확인하여 scrolling 조건 변경
		 *  아래처럼 조건을 바꾸는 이유는 모바일에서 성능문제때문.
		 */
		var condition = (User.isMobile() == true)? viewportHeight > footerTopPos - 100 : viewportHeight > footerTopPos; 
		
		return condition;
	};
	
	ArticleMore.prototype.getMoldedData = function(data, templateCompiler, template) {
		var datetime = data.datetime;
		data.datetime = datetime.substring(0, datetime.length-11);
		var className = "card card-reporter";	
		var newLi = '<li class="' + className + '">' + templateCompiler(data, template) + '</li>';
		
		return newLi;
	};
	
	ArticleMore.prototype.getURL = function() {
		var userId = User.getId();
		var uri = "/api/v1/me/" + userId + "/timeline?start_item=" + this.metadata.curNum + "&how_many=" + this.requestNum;
		console.log(uri);
		return uri;
	};
	
	ArticleMore.prototype.success = function(responseObj) {
		return responseObj.data.articles;
	};
	
	// 공개 메서드 노출
	WILDGOOSE.more.article = ArticleMore;
})();
(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.search = WILDGOOSE.search || {};
	WILDGOOSE.search.more = WILDGOOSE.search.more || {};

	// 의존성 주입
	var Fav = WILDGOOSE.ui.favorite;
	var More = WILDGOOSE.more.super_type;
	
	function SearchMore(args) {
		More.call(this, args);
		
		this.postsuccess.add(function(conatiner){
//			Fav.updateFavs(this.metadata.curNum, this.requestNum);
//			Fav.attatchEventToFavBtn(this.metadata.curNum, this.requestNum);
			Fav.addCards(conatiner);
		});
	};
	
	SearchMore.prototype = new More();
	SearchMore.prototype.constuctor = SearchMore;
	SearchMore.prototype.getApproachEventCondition = function(evt) {
		var footer = document.querySelector(".footer");
		var viewportHeight = window.innerHeight;
		var footerHeight = parseInt(window.getComputedStyle(footer, null).height);
		var footerTopPos = footer.getBoundingClientRect().bottom - footerHeight;
		var condition = viewportHeight - 15 > footerTopPos; 
		
		return condition;
	};
	
	SearchMore.prototype.getMoldedData = function(data, templateCompiler, template) {
		var className = "card card-reporter";
		var newLi = '<li class="' + className + '">' + templateCompiler(data, template) + '</li>';
		
		return newLi;
	};
	
	SearchMore.prototype.getURL = function() {
		return "/api/v1/search?q=" + this.metadata.keyword + "&start_item=" + this.metadata.curNum + "&how_many=" + this.requestNum;
	};
	
	SearchMore.prototype.success = function(responseObj) {
		return responseObj.data.reporters;
	};
	
	// 공개 메서드 노출
	WILDGOOSE.more.search = SearchMore;
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
	var SearchMore = WILDGOOSE.more.search;
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
				Submit.init({
					box: this.form.box,
					submit: this.search.submit
				});
				
			}
			
			// initialize auto completion list
			var autocompletion = args.autocompletion;
			var autoEl = document.querySelector(args.autocompletion.list);
			if (autocompletion !== undefined && autoEl !== null) {
				AutoComplement.init({
					searchBox: this.form.box,
					list: {
						element: autoEl,
						requestNum: autocompletion.requestNum,
						interval: 100
					}
				});
			}
			
			// initialize more button
			var more = args.more;
			var moreEl = document.querySelector(more.button);
			if (more !== undefined && moreEl !== null) {
				var curNumDiv = document.querySelector(args.more.curNum);
				var totalNumDiv = document.querySelector(args.more.totalNum);
				
				var searchMore = new SearchMore({
					more: {
						button: moreEl,
						curNum: (curNumDiv !== undefined)? parseInt(curNumDiv.innerText) : 0,
						totalNum: (totalNumDiv !== undefined)? parseInt(totalNumDiv.innerText) : 0
					},
					container: this.form.container,
					template: this.search.template,
					keyword: this.form.box.value,
					requestNum: this.search.requestNum
				});
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
