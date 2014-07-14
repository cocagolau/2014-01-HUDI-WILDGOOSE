(function(window) {
	'use strict';
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var CAGE = window.CAGE || {};
	CAGE.ui = CAGE.ui || {};
	
	function Parallax(){
		this.wrapperCollections = [];
		this.itemCollections = [];
		this.init();
		this.setEvent();
	}
	
	Parallax.prototype.init = function(){
		// 랩퍼들을 저장
		var parallaxWrappers = document.querySelectorAll(".parallax-wrapper");
		var wrapperCollections = this.wrapperCollections;
	
		[].forEach.call(
			parallaxWrappers, 
			function(el){
				wrapperCollections.push(el);
				
			}
		);
		// 모든 아이템의 기본 좌표를 저장
		for(var i in wrapperCollections) {
			[].forEach.call(
				wrapperCollections[i].querySelectorAll(".parallax-item"), 
				function(el){
					el.style.transform="translateY(0px)";
					var elStyle = window.getComputedStyle(el);
					el.setAttribute("data-initialTopOffset", getOffset(el).top);
					el.setAttribute("data-initialLeftOffset", getOffset(el).left);
					
					el.setAttribute("data-initialTop", elStyle.top);
					el.setAttribute("data-initialLeft", elStyle.left);
					el.setAttribute("data-initialMarginLeft", elStyle.marginLeft);
				}
			);
		}
		

	};
	
	Parallax.prototype.setEvent = function(){
		document.addEventListener("mousemove", mousemoveHandler, false);
		window.addEventListener("resize", resizeHandler, false);
		 
		function mousemoveHandler(event) {
			var parallaxItems = document.querySelector(".parallax-wrapper").querySelectorAll(".parallax-item");
			[].forEach.call(
				parallaxItems, 
				function(targetEl){
					parallax_set(targetEl, event);
				}
			);	
		}
		
		function parallax_set(targetEl, event){
			var xRange = parseInt(targetEl.getAttribute("data-rangex")) || 0;
			var yRange = parseInt(targetEl.getAttribute("data-rangey")) || 0;
			var reverse = (targetEl.parentNode.getAttribute("class").indexOf("parallax-bg") >- 1)||(targetEl.hasAttribute("data-reverse"))?-1:1;
			var bodyStyle = window.getComputedStyle(document.body);	
			var xPosition = event.x?event.x/parseInt(window.innerWidth):0.5;
			var yPosition = event.y?event.y/parseInt(window.innerHeight):0.5;
			
			//if(targetEl.getAttribute("src").indexof("404msg") > -1) {
				//console.log(xPosition);
			//}
			
			targetEl.style.left = (parseInt(targetEl.getAttribute("data-initialLeftOffset")) + reverse*xRange*(xPosition-0.5)) + "px";
			targetEl.style.marginLeft = "0";
			targetEl.style.top = (parseInt(targetEl.getAttribute("data-initialTopOffset")) + reverse*yRange*(yPosition-0.5) - 40) + "px";
			targetEl.style.marginTop = "0";
		}
		
		function resizeHandler(event) {
			var parallaxItems = document.querySelector(".parallax-wrapper").querySelectorAll(".parallax-item");
			
			[].forEach.call(
				parallaxItems, 
				function(targetEl){
					parallax_reset(targetEl);
				}
			);
		}
		function parallax_reset(targetEl){
			// top, left, margin-left 를 원래대로 되돌리기 
			targetEl.setAttribute("style","");
			/*
			targetEl.style.left = targetEl.getAttribute("data-initialLeft");
			targetEl.style.marginLeft = targetEl.getAttribute("data-initialMarginLeft");
			targetEl.style.top = targetEl.getAttribute("data-initialTop");
			*/
			targetEl.setAttribute("data-initialTopOffset", getOffset(targetEl).top);
			targetEl.setAttribute("data-initialLeftOffset", getOffset(targetEl).left);			
		}
	}
	
	function getOffset( el ) {
	    var _x = 0,
	    _y = 0;
	    while( el && el.tagName.toLowerCase() != 'body' && !isNaN( el.offsetLeft ) && !isNaN(el.offsetTop ) ) {
	        _x += el.offsetLeft - el.scrollLeft;
	        _y += el.offsetTop - el.scrollTop;
	        el = el.offsetParent;
	    }
	    return { top: _y, left: _x };
	}
		
	CAGE.ui.parallax = Parallax;

	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = CAGE;
		// browser export
	} else {
		window.CAGE = CAGE;
	}    	

}(this));