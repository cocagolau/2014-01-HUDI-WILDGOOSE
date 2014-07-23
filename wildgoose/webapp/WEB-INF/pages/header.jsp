<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<link type="text/css" rel="stylesheet" href="/stylesheet/modal.css" />
<link rel="stylesheet" type="text/css" href="/scripts/CAGE/src/CAGE.ui.popup.css">
<link type="text/css" rel="stylesheet" href="/stylesheet/header.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/header-account-popup.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/header-setting-popup.css" />
<style>
@font-face {
    font-family: "The-Noun-Project-UI";
    src: url("/font/The-Noun-Project-UI.9b6847370d9b.eot");
    src: url("/font/The-Noun-Project-UI.9b6847370d9b.eot?#iefix") format('eot'),
     url("/font/The-Noun-Project-UI.36c9aa36764b.woff") format('woff'),
      url("/font/The-Noun-Project-UI.a7238bb8ddf5.ttf") format('truetype'),
       url("/font/The-Noun-Project-UI.cc853159fd66.svg") format('svg');
    font-weight: 300;
    font-style: normal
}
a {
	text-decoration: none;
}
.topBar-wrapper {
	-webkit-font-smoothing: antialiased;
}
.topBar-wrapper .topBar-left-nav,
.topBar-wrapper .topBar-right-nav {
	display: inline-block;
	display: block;
	text-align: center;
}
.topBar-wrapper .nav-global {
	float:left; 
}
.nav-global li[class*='nav-global-'],
.nav li[class*='nav-'] {
	position:relative;
	height: 50px;
	overflow: hidden;
}
.nav-global li[class*='nav-global-'] {
	float:left;
}
.nav li[class*='nav-'] {
	float:right;
}

.nav-global > li[class*='nav-global-'] {
	border-bottom: 0px solid #4882FD;
	box-sizing: border-box;
	transition: all .15s ease-in-out;
}
.nav-global > li[class*='nav-global-']:hover {
	border-bottom-width: 4px;
}

li[class*='nav-global-'] a,
li[class*='nav'] a  {
	padding: 0 10px 0 4px;
}
.nav-global span.text,
.nav span.text {
	color: #777;
	float: left;
	margin-top: 17px;
	margin-left: 6px;
	font-size: 16px;
	font-weight: 500;
	line-height: 1;
}

.nav-global.home li.nav-global-home {
	border-bottom-width: 4px;	
}
.nav-global.me li.nav-global-me {
	border-bottom-width: 4px;	
}

.hidden {
	display: none;
}
[class*="nav-"] {
	cursor: pointer;
}
</style>
<div class="topBar-wrapper">
<div class="topBar-inner-wrapper">
<div class="topBar-left-nav">

<c:choose>
	<c:when test="${ empty sessionScope.userId }">
		<ul class="nav-global <c:if test="${ not empty requestScope.data.pageName }">
		${ requestScope.data.pageName }</c:if>">
			<li class="nav-global-home"><a class="header-btn" href="/"><span class="text">검색</span></a></li>
			<li class="nav-global-me hidden"><a class="header-btn" id="me"><span class="text">나</span></a></li>
		</ul>
		</div>
		<div class="topBar-right-nav">
		<ul class="nav">
			<span id ="userId" class="hidden"></span>
			<li class="nav-login"><a class="header-btn" id="login"><span class="text">로그인</span></a></li>
			<li class="nav-join"><a class="header-btn" id="join"><span class="text">가입</span></a></li>
			<li class="nav-logout hidden"><a class="header-btn" id="logout"><span class="text">로그아웃</span></a></li>
			<li class="nav-setting hidden"><a class="header-btn" id="setting"><span class="text">설정</span></a></li>
		</ul>
	</c:when>
	<c:otherwise>
		<ul class="nav-global <c:if test="${ not empty requestScope.data.pageName }">
		${ requestScope.data.pageName }</c:if>">
			<li class="nav-global-home"><a class="header-btn" href="/"><span class="text">검색</span></a></li>
			<li class="nav-global-me"><a class="header-btn" id="me"><span class="text">나</span></a></li>
		</ul>
		</div>
		<div class="topBar-right-nav">
		<ul class="nav">
			<span id ="userId" class="hidden">${sessionScope.userId}</span>
			<li class="nav-login hidden"><a class="header-btn" id="login"><span class="text">로그인</span></a></li>
			<li class="nav-join hidden"><a class="header-btn" id="join"><span class="text">가입</span></a></li>
			<li class="nav-logout"><a class="header-btn" id="logout"><span class="text">로그아웃</span></a></li>
			<li class="nav-setting"><a class="header-btn" id="setting"><span class="text">설정</span></a></li>
		</ul>
	</c:otherwise>
</c:choose>

</div>
</div>
</div>
<script type="text/javascript" src="/scripts/lib/sha256.js"></script>
<c:choose>
	<c:when test="${ initParam.debuggerMode eq 'on' }">
		<script type="text/javascript" src="/scripts/CAGE/src/CAGE.ajax.js"></script>
		<script type="text/javascript" src="/scripts/CAGE/src/CAGE.util.js"></script>
		<script type="text/javascript" src="/scripts/CAGE/src/CAGE.event.emitter.js"></script>
		<script type="text/javascript" src="/scripts/CAGE/src/CAGE.ui.popup.js"></script>
		
		<script type="text/javascript" src="/scripts/WILDGOOSE/src/user/WILDGOOSE.user.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/src/validation/WILDGOOSE.validator.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/src/account/WILDGOOSE.account.super_type.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/src/account/WILDGOOSE.account.login.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/src/account/WILDGOOSE.account.logout.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/src/account/WILDGOOSE.account.join.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/src/account/WILDGOOSE.account.withdraw.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/src/account/WILDGOOSE.account.change.pw.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/src/modal/WILDGOOSE.modal.join.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/src/modal/WILDGOOSE.modal.login.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/src/modal/WILDGOOSE.modal.setting.js"></script>
		<script type="text/javascript" src="/scripts/APP/src/APP.page.header.js"></script>
	</c:when>
	<c:otherwise>
		<!-- <script type="text/javascript" src="/scripts/CAGE/src/CAGE.min.js"></script> -->
		<script type="text/javascript" src="/scripts/CAGE/CAGE.min.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/WILDGOOSE.min.js"></script>
		<script type="text/javascript" src="/scripts/APP/APP.min.js"></script>
	</c:otherwise>
</c:choose>

<script>
window.addEventListener("load", function(evt){
	APP.page.header.init();
}, false);
</script>
