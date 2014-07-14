<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<ul>
	<c:if test="${ not empty sessionScope.userId }">
		<c:forEach var="reporter" items="${ requestScope.data.recommands }" varStatus="status">
		<li class="card card-reporter">
			<%@ include file = "/WEB-INF/templates/jsp/reporterCard.jsp" %>
		</li>
		</c:forEach>
	</c:if>
</ul>