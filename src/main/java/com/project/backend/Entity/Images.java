package com.project.backend.Entity;

import com.google.cloud.firestore.annotation.DocumentId;

import lombok.Data;

@Data
public class Images {
	
	@DocumentId
	private String img_id;
	private String user_id;
	private String img_name;
	private String img_url;
	private Integer img_likes;
	private String img_type;
	private String hashtag;
	private String upload_date;
	private String layout;
	private String des;
}

