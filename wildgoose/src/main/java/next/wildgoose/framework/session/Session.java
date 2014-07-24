package next.wildgoose.framework.session;


public class Session {
	
	
//	public void renewAuth(HttpSession session, int time) {
//		
//	}
	
	// 로그인 유지(3일)를 위한 쿠키만료기간 재설정
	// userId존재시
//	public void renewAuth(HttpServletRequest request, HttpServletResponse response) {
//		HttpSession session = request.getSession();
//		
//		if (session.getAttribute("userId") != null) {
//			session.setMaxInactiveInterval(Constants.SESSION_EXPIRING_TIME);
//			Cookie[] cookies = request.getCookies();
//			Cookie jsessionid = null;
//	
//			for (int i=0; i<cookies.length; i++) {
//				Cookie cookie = cookies[i];
//				if("JSESSIONID".equals(cookie.getName())) {
//					jsessionid = cookie;
//				}
//			}
//			if(jsessionid != null) {
//				jsessionid.setMaxAge(Constants.SESSION_EXPIRING_TIME);
//			}
//			response.addCookie(jsessionid);	
//		}
//	}
}
