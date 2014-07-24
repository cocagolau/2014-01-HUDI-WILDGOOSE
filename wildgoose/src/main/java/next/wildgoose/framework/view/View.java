package next.wildgoose.framework.view;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import next.wildgoose.dto.result.Result;

public interface View {
	void show(HttpServletRequest request, HttpServletResponse response, Result resultData) throws ServletException, IOException;
}
