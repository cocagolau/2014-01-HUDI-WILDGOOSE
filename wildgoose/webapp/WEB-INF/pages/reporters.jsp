<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-zoom=1, user-scalable=no">
<link type="text/css" rel="stylesheet" href="/stylesheet/base.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/basic_layout.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/header.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/reporters-articles.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/card.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/reporters.css" />
<title>${ requestScope.data.reporter.name }기자</title>
</head>
<body>
<div class="wrap viewport">
<header class="header"> 
	<%@ include file="/WEB-INF/pages/header.jsp" %> 
</header>
<div class="container test-outline">
	<!-- 기자 정보 -->
	<div class="card">
		<div class="card-section card-section-identity" data-reporter_id="${ requestScope.data.reporter.id }">
			<h3 class="name">
				<a href="/reporters/${ requestScope.data.reporter.id }">${ requestScope.data.reporter.name }</a>
			</h3>
			<p class="email">${ requestScope.data.reporter.email }</p>
			<div class="favorite">
				<div class="star<c:if test="${ empty sessionScope.userId }"> invisible</c:if>"></div>
			</div>
			<div class="${ requestScope.data.reporter.pressName } press-tag"></div>
		</div>
	</div>
	<br/>
	<!-- 통계 정보 -->
	<div class="card card-graph">
		<div class="card-section card-section-header">
			<h3 class="title">섹션 비율</h3>
		</div>
		<div id="donut-graph" class="card-section">
			<div class="graph"></div>
		</div>
	</div>
	<div class="card card-graph">
		<div class="card-section card-section-header">
			<h3 class="title">날짜별 기사 작성</h3>
		</div>
		<div id="brokenline-graph" class="card-section">
			<div class="graph"></div>
		</div>
	</div>
	<div class="card card-graph">
		<div class="card-section card-section-header">
			<h3 class="title">기자의 특성</h3>
		</div>
		<div id="radar-graph" class="card-section">
			<div class="graph"></div>
		</div>
	</div>

	<!-- 최신기사 리스트 카드 -->
	<div class="card card-article-list">
		<div class="card-section card-section-header">
			<h3 class="title">${ requestScope.data.reporter.name }기자의최신기사</h3>
		</div>
		<div class="card-section card-section-recent-headlines">
			<c:forEach var="article" items="${ requestScope.data.articles }">
				<div class="article">
					<a href="${ article.url }" target="_blank">
						<span class="article_title">${ article.title }</span>
							<c:set var="date" value="${fn:split(article.datetime, ' ')}" />
						<span class="datetime">${ date[0] }</span>
					</a>
				</div>
			</c:forEach>
		</div>
	</div>
</div>
<footer class="footer"></footer>
</div>

<script type="text/javascript" src="/scripts/lib/d3.min.js"></script>
<c:choose>
	<c:when test="${ initParam.debuggerMode eq 'on' }">
		<script type="text/javascript" src="/scripts/CAGE/src/CAGE.ajax.js"></script>
		<script type="text/javascript" src="/scripts/CAGE/src/CAGE.util.js"></script>
		
		<script type="text/javascript" src="/scripts/WILDGOOSE/ui/WILDGOOSE.ui.favorite.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/ui/WILDGOOSE.ui.graph.js"></script>
		
		<script type="text/javascript" src="/scripts/APP/APP.page.reporter.js"></script>
	</c:when>
	<c:otherwise>
		<!-- <script type="text/javascript" src="/scripts/CAGE/src/CAGE.min.js"></script> -->
		<script type="text/javascript" src="/scripts/CAGE/CAGE.min.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/WILDGOOSE.min.js"></script>
		<script type="text/javascript" src="/scripts/APP/APP.min.js"></script>
	</c:otherwise>
</c:choose>

<script>
window.addEventListener("load", function() {
	APP.page.reporter.init();
}, false);
</script>
</body>
</html>
