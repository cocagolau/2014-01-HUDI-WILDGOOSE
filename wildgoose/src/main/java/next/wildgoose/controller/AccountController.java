package next.wildgoose.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import next.wildgoose.dao.SignDAO;
import next.wildgoose.framework.Controller;
import next.wildgoose.framework.security.SHA256;
import next.wildgoose.framework.utility.Uri;
import next.wildgoose.utility.Constants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("accounts")
public class AccountController implements Controller {

	private static final Logger LOGGER = LoggerFactory.getLogger(AccountController.class.getName());
	
	@Autowired
	private SignDAO signDao;

	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model) {
		Uri uri = new Uri(request);
		String method = request.getMethod();

		if (uri.check(1, null)) {
			
			if ("POST".equals(method)) {
				// 체크하고 유효한 경우 가입
				if (request.getParameter("check") == null) {
					
					return join(request, response, model);
					
				} else {
					
					return withdraw(request, response, model);
					
				}
				
			} else if ("GET".equals(method)) {
				
				return usedEmail(request, response, model);
				
			} else if ("PUT".equals(method)) {

				return changePassword(request, response, model);
				
			}
		}

		return null;
	}
	
	//	join
	private String join(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model) {
		int status = 500;
		String message = "adding user account failed";
		String email = request.getParameter("email");
		String password = request.getParameter("password");

		// 가입 성공
		if (isJoinable(email) && isHashedPassword(password) && signDao.joinAccount(email, password)) {
			status = 200;
			message = "adding user account succeed";
			
			// session 저장
			HttpSession session = request.getSession();
			session.setAttribute("userId", email);
		}
		model.put("status", status);
		model.put("message", message);
		
		return null;
	}
	
	// withdraw	
	private String withdraw(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model) {
		String email = request.getParameter("email");
		String hashedPassword = request.getParameter("password");

		HttpSession session = request.getSession();
		String randNum = (String) session.getAttribute("randNum");

		String accountPw = signDao.findAccount(email);
		
		int status = 500;
		String message = Constants.MSG_WRONG_PW;

		// H(db_password+random)
		if (SHA256.testSHA256(accountPw + randNum).equals(hashedPassword)) {

			// 탈퇴 성공
			if (signDao.withdrawAccount(email)) {
				message = "OK";
				status = 200;
				session.removeAttribute("userId");
			}
		}

		model.put("status", status);
		model.put("message", message);
		
		return null;
	}
	
	
	// usedEmail
	private String usedEmail(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model) {
		int status = 500;
		String message = "fetching account info failed";
		String email = request.getParameter("email");

		if (isJoinable(email)) {
			status = 200;
			message = "fetching account info succeed";
			
		}

		model.put("status", status);
		model.put("message", message);
		model.put("email", email);

		return null;
	}

	
	
	// changePassword
	private String changePassword(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model) {
		int status = 500;
		String message = "failure";

		// PUT method doesn't parse request parameter
		/*
		 * 수정 필요, 왜 getParameterMap이 필요한지 확인필 
		 * 
		 */
		Map<String, String> parameterMap = getParameterMap(request);

		String email = parameterMap.get("email");
		String oldPassword = parameterMap.get("old_pw");
		String newPassword = parameterMap.get("new_pw");

		HttpSession session = request.getSession();
		String randNum = (String) session.getAttribute("randNum");
		String accountPw = signDao.findAccount(email);

		// 비밀번호 확인
		if (SHA256.testSHA256(accountPw + randNum).equals(oldPassword)) {
			boolean changed = signDao.changePassword(email, newPassword);

			if (changed) {
				status = 200;
				message = "success";
				
			}
			
		} else {
			message = Constants.MSG_WRONG_PW;
		
		}
		
		model.put("status", status);
		model.put("message", message);
		
		return null;
	}

	
	private Map<String, String> getParameterMap(HttpServletRequest request) {
		Map<String, String> parameterMap = new HashMap<String, String>();
		
		try {
			BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
			String data = br.readLine();
			// 한글 처리
			data = URLDecoder.decode(data, Constants.CHAR_ENCODING);
			String[] parameter = data.split("&");
			
			for (int i = 0; i < parameter.length; i++) {
				String[] parameterTemp = parameter[i].split("=");
				String name = parameterTemp[0];
				String value = parameterTemp[1];
				parameterMap.put(name, value);
				
			}
			
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			
		}
		
		return parameterMap;
	}

	private boolean isJoinable(String email) {
		if (isValidEmail(email)) {
			return !signDao.findEmail(email);
		}
		return false;
	}

	private boolean isValidEmail(String email) {
		String regex = "^[\\w\\.-_\\+]+@[\\w-]+(\\.\\w{2,4})+$";

		return isFilled(email) && Pattern.matches(regex, email);
	}

	private boolean isHashedPassword(String password) {
		if (password.length() == 64) {
			return true;
		}
		return false;
	}

	private boolean isFilled(String data) {
		if (data != null && data.length() > 0) {
			return true;
		}
		return false;
	}
}
