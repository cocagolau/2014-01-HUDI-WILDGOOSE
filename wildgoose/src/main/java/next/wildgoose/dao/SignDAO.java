package next.wildgoose.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.stereotype.Component;

import next.wildgoose.framework.dao.template.JdbcTemplate;
import next.wildgoose.framework.dao.template.PreparedStatementSetter;
import next.wildgoose.framework.dao.template.RowMapper;

@Component
public class SignDAO {
	public boolean findEmail (final String email) {	
		JdbcTemplate t = new JdbcTemplate();
		PreparedStatementSetter pss = new PreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement psmt) throws SQLException {
				psmt.setString(1, email);
				
			}
			
		};
		
		RowMapper rm = new RowMapper() {

			@Override
			public Object mapRow(ResultSet rs) throws SQLException {
				if (rs.first()) {
					if (rs.getInt("exist") == 0) {
						return false;
					}
					return true;
				}
				return false;
			}
			
		};
		
		StringBuilder query = new StringBuilder();
		query.append("SELECT count(email) as exist FROM user_account WHERE email = ?");
		
		return (Boolean) t.execute(query.toString(), pss, rm);
	}
	
	public String findAccount (final String email) {
		JdbcTemplate t = new JdbcTemplate();
		PreparedStatementSetter pss = new PreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement psmt) throws SQLException {
				psmt.setString(1, email);
			}
			
		};
		
		RowMapper rm = new RowMapper() {

			@Override
			public Object mapRow(ResultSet rs) throws SQLException {
				String result = null;

				if (rs.first()) {
					result = rs.getString("password");
				}
				return result;
			}
			
		};
		
		
		String query = "SELECT * FROM user_account WHERE email = ?";

		return (String) t.execute(query, pss, rm);

	}

	public boolean joinAccount (final String email, final String password) {
		JdbcTemplate t = new JdbcTemplate();
		PreparedStatementSetter pss = new PreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement psmt) throws SQLException {
				psmt.setString(1, email);
				psmt.setString(2, password);
			}
			
		};

		String query = "INSERT INTO user_account (email, password) VALUES (?, ?) ";
		
		return (Boolean) t.execute(query, pss);
	}
	
	public boolean withdrawAccount (final String email) {
		JdbcTemplate t = new JdbcTemplate();
		PreparedStatementSetter pss = new PreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement psmt) throws SQLException {
				psmt.setString(1, email);
			}
		};
		String query = "DELETE FROM user_account WHERE email =?";
		return (Boolean) t.execute(query, pss);
	}

	public static boolean changePassword(final String email, final String newPassword) {
		JdbcTemplate t = new JdbcTemplate();
		PreparedStatementSetter pss = new PreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement psmt) throws SQLException {
				psmt.setString(1, newPassword);
				psmt.setString(2, email);
			}
		};

		String query = "UPDATE user_account SET password=? WHERE email=?";
		
		return (Boolean) t.execute(query, pss);
	}
}
