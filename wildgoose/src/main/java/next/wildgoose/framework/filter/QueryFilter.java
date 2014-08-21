package next.wildgoose.framework.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import next.wildgoose.dao.SearchKeywordDAO;

public class QueryFilter implements Filter {
	
	public void init(FilterConfig filterConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;
		
		ServletContext sc = request.getServletContext();
		String keyword = request.getParameter("q");
		
		/*
		 * 검색키워드를 저장하는 부분이나 현재 searchKeywordDao가 구현되어있지 않음
		if (keyword != null && !"".equals(keyword)) {
			SearchKeywordDAO sdao = (SearchKeywordDAO) sc.getAttribute("SearchKeywordDAO");
			sdao.addKeywordRecord(keyword);
		}
		*/
		
		chain.doFilter(request, response);
	}

	public void destroy() {
		// TODO Auto-generated method stub
	}

}
