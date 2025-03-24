package com.project.backend.Controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import com.project.backend.Entity.User;
import com.project.backend.Service.UserService;
import com.project.backend.Util.JwtUtil;

@Controller
@RequestMapping("/api/user")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@PostMapping("/login")//done
	public ResponseEntity<Map<String, String>> userLogin(@RequestBody Map<String, String> loginBody)
	{
		String username=loginBody.get("username");
		String password=loginBody.get("password");
		String token;
		token = userService.isValidUser(username, password);
		if(token!=null)
		{
			Map<String, String> response=new HashMap<String, String>();
			response.put("token", token);
			return ResponseEntity.ok(response);
		}
		else {
			return ResponseEntity.status(401).body(null);
		}
	}
	
	@PostMapping("/register")//done
	public ResponseEntity<String> userRegistration(@RequestBody Map<String, String> regiBody)
	{
		Random no= new Random();
		String userId= "U"+no.nextInt(1000);
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		User newuser= new User();
		newuser.setUid(userId);
		newuser.setFname(regiBody.get("fname"));
		newuser.setLname(regiBody.get("lname"));
		newuser.setUsername(regiBody.get("username"));
		newuser.setPassword(regiBody.get("password"));
		newuser.setEmail(regiBody.get("email"));
		newuser.setRegi_date(formatter.format(new Date()));
		newuser.setLike(0);
		newuser.setNo_of_work(0);
		userService.insertUser(newuser);
		return ResponseEntity.ok("User inserted successfully");
	}
	
	
	@PostMapping("/getDetails")//done
	public ResponseEntity<User> getUserDetails(@RequestBody Map<String, String> user)
	{
		User userDetails=userService.getUserDetails(user.get("userId"));
		if(userDetails!=null)
		{
			return ResponseEntity.ok(userDetails);
		}
		else {
			return ResponseEntity.status(401).body(null);
		}
	}
	
	
	@PostMapping("/follow")//done
	public ResponseEntity<String> addToFollow(@RequestBody Map<String, String> followDetails)
	{
		userService.addFollower(followDetails.get("userId"), followDetails.get("followId"));
		return ResponseEntity.ok("Following Successfull");	
	}
	
	@PostMapping("/unfollow")//done
	public ResponseEntity<String> deleteFromFollow(@RequestBody Map<String, String> unfollowDetails)
	{
		userService.unFollow(unfollowDetails.get("userId"), unfollowDetails.get("unfollowId"));
		return ResponseEntity.ok("Unfollow Successfull");
	}
	
	@PostMapping("/delete")//done
	public ResponseEntity<String> deleteAccount(@RequestBody Map<String, String> details)
	{
		userService.deleteUser(details.get("userId"));
		return ResponseEntity.ok("Account deleted succesfully");
	}
	
	@PostMapping("/updatePassword")//done
	public ResponseEntity<String> updatePassword(@RequestBody Map<String, String> details)
	{
		boolean result= userService.updateRequest(details.get("email"), details.get("username"), details.get("password"));
		if(result==true)
		{
			return ResponseEntity.ok("Password updated successfully");
		}
		else {
			return ResponseEntity.status(401).body("Password not updated");
		}
	}
	
	@PostMapping("/logout")//done
    public ResponseEntity<String> userLogout(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        userService.logoutUser(token);
        return ResponseEntity.ok("User logged out successfully");
    }
	
	
	@PostMapping("/personDetails")
	public ResponseEntity<List<Map<String, String>>> getPersonDetails(@RequestBody Map<String, String> details) {
	    String userId = details.get("userId");

	    if (userId == null || userId.isEmpty()) {
	        return ResponseEntity.status(400).body(null);
	    }

	    List<Map<String, String>> list = userService.getPersonProfileDetails(userId);
	    if (list != null) {
	        return ResponseEntity.ok(list);
	    } else {
	        return ResponseEntity.status(401).body(null);
	    }
	}
	
	@PostMapping("/checkFollow")//done
	public ResponseEntity<Boolean> checkIfFollows(@RequestBody Map<String, String> info)
	{
		Boolean result=userService.doesFollow(info.get("userId"), info.get("uid"));
		if(result)
		{
			return ResponseEntity.ok(result);
		}
		else {
			return ResponseEntity.status(401).body(result);
		}
	}

	@PostMapping("/peoplesList")//done
	public ResponseEntity<List<Map<String, String>>> getPeoplesList(@RequestBody Map<String, String> details)
	{
		List<Map<String, String>> resultList=userService.getPeopleList(details.get("userId"), details.get("type"));
		if(resultList!=null)
		{
			return ResponseEntity.ok(resultList);
		}
		else {
			return ResponseEntity.status(401).body(null);
		}
	}
	
	@PostMapping("/getUserId")//done checked
	public ResponseEntity<String> getUserId(@RequestHeader("Authorization") String token)
	{
		if (token.startsWith("Bearer ")) {
	        token = token.substring(7); // Extract only the token part
	    }

	    return ResponseEntity.ok(jwtUtil.extractUserId(token));	
	}
	
}
