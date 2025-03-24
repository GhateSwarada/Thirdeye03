package com.project.backend.Entity;

import com.google.cloud.firestore.annotation.DocumentId;

import lombok.Data;

@Data
public class SavedImages {
	
	@DocumentId
	private String saved_id;
	private String uid;
	private String image_id;
}
