package next.wildgoose.framework.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import next.wildgoose.utility.Constants;


public class SessionFilter implements Filter {

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;
		
		HttpSession session = request.getSession();
		
		// userId존재시 로그인 유지(3일)를 위한 쿠키만료기간 재설정
		if (session.getAttribute("userId") != null) {
			session.setMaxInactiveInterval(Constants.SESSION_EXPIRING_TIME);
			Cookie[] cookies = request.getCookies();
			Cookie jsessionid = null;
	
			for (int i=0; i<cookies.length; i++) {
				Cookie cookie = cookies[i];
				if("JSESSIONID".equals(cookie.getName())) {
					jsessionid = cookie;
				}
			}
			if(jsessionid != null) {
				jsessionid.setMaxAge(Constants.SESSION_EXPIRING_TIME);
			}
			response.addCookie(jsessionid);
		}
		
		chain.doFilter(request, response);
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

}
