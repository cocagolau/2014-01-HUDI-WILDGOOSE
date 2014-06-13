(function() {
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
		on: function(targetEl) {
			var card = targetEl.parentElement.parentElement.parentElement;
			Dom.addClass(targetEl, "on");
			Dom.removeClass(targetEl, "off");
			Dom.removeClass(card, "blur");
		},
		
		off: function(targetEl) {
			var card = targetEl.parentElement.parentElement.parentElement;
			Dom.removeClass(targetEl, "on");
			Dom.addClass(targetEl, "off");
			Dom.addClass(card, "blur");
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
					"success" : function(responseObj) {
						this.off(target);
					}.bind(Favorite),
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
						this.on(target);
					}.bind(Favorite),
					"failure" : function(responseObj) {
						console.log("Failure!");
					},
					"error" : function(responseObj) {
						console.log("Error!");
					}
				});
			}
		},

		updateFavs : function(curNum, reqNum) {
			var reporterCards = document.querySelectorAll(".card-section-identity");
			if (reporterCards.length != 0) {
				(curNum == undefined) ? curNum = reporterCards.length : true;
				(reqNum == undefined) ? reqNum = reporterCards.length : true;
				console.log(curNum, reqNum);
				for (var i = curNum - reqNum ; i < curNum; i++) {
					var card = reporterCards[i];
					if (card == undefined) {
						continue;
					}
					var reporterId = card.dataset.reporter_id;
					Dom.removeClass(card.querySelector(".star"), "invisible");
					if (this.favoriteList.indexOf(parseInt(reporterId)) >= 0) {
						Dom.addClass(card.querySelector(".star"), "on");
					}
				}				
			}
		},
		
		init: function(args) {
			this.userId = args.userId;

			// 초기화
			if (this.userId !== undefined && this.userId != "") {
				
				// 모든 별에 eventlistener 붙이기
				this.attatchEventToFavBtn();
				
				// user의 Favorite 목록 획득
				var url = "/api/v1/users/" + this.userId + "/favorites/";
				Ajax.GET({
					"url" : url,
					"success" : function(responseObj) {
						var reporterCards = responseObj["data"]["reporterCards"];
						for (var i=0; i<reporterCards.length; i++) {
							var card = reporterCards[i];
							Favorite.favoriteList.push(card["id"]);
						}
						// 불러온 목록 내부에 존재하는 favorite 업데이트
						// 인자가 없으면 모두!
						this.updateFavs();
					}.bind(this),
					"failure" : function(responseObj) {
						console.log("Failure!");
					},
					"error" : function(responseObj) {
						console.log("Error!");
					}
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

})();