package next.wildgoose.controller;

import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import next.wildgoose.dao.SignDAO;
import next.wildgoose.framework.Controller;
import next.wildgoose.framework.security.RandomNumber;
import next.wildgoose.framework.security.SHA256;
import next.wildgoose.framework.utility.Uri;
import next.wildgoose.utility.Constants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("session")
public class SessionController implements Controller {

	@Autowired
	private SignDAO signDao;
	
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model) {
		Uri uri = new Uri(request);
		String method = request.getMethod();
		
		if (uri.check(1, null)) {
			
			if ("POST".equals(method)) {

				return login(request, response, model);
				
			} else if ("DELETE".equals(method)) {

				return logout(request, response, model);
				
			} else if ("GET".equals(method)) {
				String email = request.getParameter("email");
				
				return joinedEmail(request, response, model, email);
				
			}
			
		} else if (uri.check(1, "rand")) {

			return getRanomNumber(request, response, model);
			
		}
		
		return null;
		
	}
	
	
	// login	
	private String login(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model) {
		int status = 500;
		String message = "failure";
		String email = request.getParameter("email");
		String hashedPassword = request.getParameter("password");
		String accountPw = signDao.findAccount(email);

		HttpSession session = request.getSession();		
		String randNum = RandomNumber.get(session);
				
		if (accountPw == null) {
			message = Constants.MSG_WRONG_ID;
			
			model.put("status", status);
			model.put("message", message);
			
			return null;
			
		}
		
		// H(db_password+random)
		if(SHA256.testSHA256(accountPw + randNum).equals(hashedPassword)){
			status = 200;
			message = "OK";
			session.setAttribute("userId", email);
			session.setMaxInactiveInterval(Constants.SESSION_EXPIRING_TIME);
			
			model.put("userId", email);

		} else {
			message = Constants.MSG_WRONG_PW;
			
		}
		
		model.put("status", status);
		model.put("message", message);
		
		return null;
		
	}
	
	

	private String logout(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model) {
		int status = 200;
		String message = "OK";

		HttpSession session = request.getSession();
		session.removeAttribute("userId");

		model.put("status", status);
		model.put("message", message);
		
		return null;
		
	}
	
	
	private String joinedEmail(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model, String email) {
		int status = 200;
		String message = "OK";
		
		if(isJoinable(signDao, email)){
			status = 500;
			message = Constants.MSG_EXIST_ID;
			
		}
		
		model.put("status", status);
		model.put("message", message);
		model.put("email", email);
		
		return null;
	}
	
	
	private String getRanomNumber(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model) {
		int status = 200;
		String message = "OK";
		String randNum = RandomNumber.set(request.getSession());
		
		model.put("status", status);
		model.put("message", message);
		model.put("rand", randNum);

		return null;
		
	}
	
	
	private boolean isJoinable(SignDAO signDao, String email) {
		
		if (isValidEmail(email)) {
			
			return !signDao.findEmail(email);
			
		}
		
		return false;
	}
	
	
	private boolean isValidEmail(String email) {
		String regex = "^[\\w\\.-_\\+]+@[\\w-]+(\\.\\w{2,4})+$";

		return isFilled(email) && Pattern.matches(regex, email);
		
	}
	
	
	private boolean isFilled(String data) {
		
		if (data != null && data.length() > 0) {
			
			return true;
			
		}
		
		return false;
		
	}

}
