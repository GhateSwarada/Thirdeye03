package com.project.backend.Entity;

import java.util.List;

import com.google.cloud.firestore.annotation.DocumentId;

import lombok.Data;

@Data
public class User {
	
	@DocumentId
	private String uid;
	private String fname;
	private String lname;
	private String username;
	private String password;
	private String email;
	private String regi_date;
	private Integer like;
	private Integer no_of_work;
	private List<String> followers;
	private List<String> followings;
}
