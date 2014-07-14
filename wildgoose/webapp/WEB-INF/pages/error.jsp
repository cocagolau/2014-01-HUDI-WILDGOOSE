<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-zoom=1, user-scalable=no">
<!-- <link type="text/css" rel="stylesheet" href="/CAGE/src/CAGE.ui.parallax.css" /> -->
<link type="text/css" rel="stylesheet" href="/scripts/CAGE/src/CAGE.ui.parallax.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/base.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/basic_layout.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/card.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/error.css" />
<title>Wildgoose</title>
<div class="wrap">
	<header class="header">
		<%@ include file ="/WEB-INF/pages/header.jsp" %>
	</header>
	<div class="container">
	<div class="parallax-wrapper">
		<div class="parallax-bg">
			<img src="/image/error404-bg.png" data-rangex="5" data-rangey="5" class="bg parallax-item"/>
		</div>
		<div class="parallax-stage">
			<img src="/image/error404-logo.png"style="opacity:.4" data-rangex="7" data-rangey="4" data-reverse class="logo parallax-item"/>
			<img src="/image/error404-baked.png" data-rangex="12" data-rangey="3" class="primary parallax-item"/>
			<img src="/image/error404-sweatDrop.png"  data-rangex="14" data-rangey="8" class="sweat-drop parallax-item"/>
			
			<div data-rangex="40" data-rangey="18" class="msg parallax-item">
				<c:choose>
					<%-- server에서 처리가능한 에러인 경우, request를 통해 forwording됨--%>
					<c:when test="${ not empty requestScope.data }">
						<div class="msg-code">
							<span>${ requestScope.data.status }</span>
						</div>
						
						<div class="msg-content">
							<span>${ requestScope.data.message }</span>
							<div class="arrow"><span>►</span></div>
						</div>
					</c:when>
					
					<%-- server에서 처리 불가능한 에러인 경우 --%>
					<c:otherwise>
						<div class="msg-code">
							<span>${ requestScope['javax.servlet.error.status_code'] }</span>
						</div>
						
						<div class="msg-content">
							<span>${ requestScope['javax.servlet.error.request_uri'] }</span>
							<%-- <span>${ applicationScope.errorCodeMap['500'] }</span> --%>
							<div class="arrow"><span>►</span></div>
						</div>						
					</c:otherwise>
				</c:choose>
			</div>
			
			<!-- <img src="/image/error404-404msg.png"  data-rangex="40" data-rangey="18" class="msg parallax-item"/> -->
		</div>
	</div>
	
	<c:choose>
		<%-- server에서 처리가능한 에러인 경우, request를 통해 forwording됨--%>
		<c:when test="${ not empty requestScope.data }">
			<c:choose>
				<%-- 로그인 페이지를 보여줄 때 --%>
				<c:when test="${ requestScope.data.pageName eq 'login' }">
					<%-- <%@ include file ="/jsp_templates/login.jsp" %> --%>
					<%@ include file ="/WEB-INF/templates/jsp/login.jsp" %>
				</c:when>
				
				<%-- 가입 페이지를 보여줄 때 --%>
				<c:when test="${ requestScope.data.pageName eq 'join' }">
					<%-- <%@ include file ="/jsp_templates/join.jsp" %> --%>
					<%@ include file ="/WEB-INF/templates/jsp/join.jsp" %>
				</c:when>
				
				<%-- 나머지 경우 --%>
				<c:otherwise>
					<div class="search-container">
					<form class="input-query-entry" action="/">
					<label>WILDGOOSE에서 이름이나 이메일, 기사의 URL로 기자를 검색하세요</label><br/>
					<input class="search-input" type="text" name="q" placeholder="Search"/>
					<input type="submit" value="검색"/>
					</form>
					</div>
				</c:otherwise>
			</c:choose>
		</c:when>
		
		<%-- server에서 처리 불가능한 에러인 경우 --%>
		<c:otherwise>
			<div class="search-container">
			<form class="input-query-entry" action="/">
			<label>WILDGOOSE에서 이름이나 이메일, 기사의 URL로 기자를 검색하세요</label><br/>
			<input class="search-input" type="text" name="q" placeholder="Search"/>
			<input type="submit" value="검색"/>
			</form>
			</div>
		</c:otherwise>
	</c:choose>
	</div>
	<footer class="footer"></footer>
</div>

<script type="text/javascript" src="/scripts/CAGE/src/CAGE.ajax.js"></script>
<script type="text/javascript" src="/scripts/CAGE/src/CAGE.util.js"></script>
<script type="text/javascript" src="/scripts/CAGE/src/CAGE.event.emitter.js"></script>
<script type="text/javascript" src="/scripts/CAGE/src/CAGE.ui.parallax.js"></script>


<c:choose>
	<c:when test="${ initParam.debuggerMode eq 'on' }">
		<script type="text/javascript" src="/scripts/CAGE/src/CAGE.ajax.js"></script>
		<script type="text/javascript" src="/scripts/CAGE/src/CAGE.util.js"></script>
		<script type="text/javascript" src="/scripts/CAGE/src/CAGE.event.emitter.js"></script>
		<script type="text/javascript" src="/scripts/CAGE/src/CAGE.ui.parallax.js"></script>
	
		<script type="text/javascript" src="/scripts/WILDGOOSE/user/WILDGOOSE.user.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/validation/WILDGOOSE.validator.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/account/WILDGOOSE.account.super_type.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/account/WILDGOOSE.account.login.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/account/WILDGOOSE.account.join.js"></script>
		
		<script type="text/javascript" src="/scripts/APP/APP.page.error.js"></script>
	</c:when>
	<c:otherwise>
		<script type="text/javascript" src="/scripts/CAGE/src/CAGE.min.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/WILDGOOSE.min.js"></script>
		<script type="text/javascript" src="/scripts/APP/APP.min.js"></script>
	</c:otherwise>
</c:choose>

<c:if test="${ not empty requestScope.data }">
	<c:choose>
		<%-- 로그인 페이지를 보여줄 때 --%>
		<c:when test="${ requestScope.data.pageName eq 'login' }">
			<script>
			window.addEventListener("load", function(evt){
				APP.page.error.init({
					"accountName" : "login"
				});
			}, false);			
			</script>
		</c:when>
		
		<%-- 가입 페이지를 보여줄 때 --%>
		<c:when test="${ requestScope.data.pageName eq 'join' }">
			<script>
			window.addEventListener("load", function(evt){
				APP.page.error.init({
					"accountName" : "join"
				});
			}, false);
			</script>
		</c:when>
		
		<%-- 나머지 경우 --%>
		<c:otherwise>
			<div class="search-container">
			<form class="input-query-entry" action="/">
			<label>WILDGOOSE에서 이름이나 이메일, 기사의 URL로 기자를 검색하세요</label><br/>
			<input class="search-input" type="text" name="q" placeholder="Search"/>
			<input type="submit" value="검색"/>
			</form>
			</div>
		</c:otherwise>
	</c:choose>
</c:if>

<script>
var parallax = new CAGE.ui.parallax();
</script>