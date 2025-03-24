package com.project.backend.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.project.backend.Entity.SavedImages;

@Service
public class SavedImagesService {
	
	private final Firestore db;
	
	@Autowired
    public SavedImagesService(Firestore db) {
        this.db = db;
    }
	
	
	//get all saved images by userId(profile page)
	public List<String> getSavedImages(String uid)
	{
		System.out.println(uid);
		List<String> resultList=new ArrayList<>();
		Query query= db.collection("saved_images").whereEqualTo("uid",uid);
		ApiFuture<QuerySnapshot> querySnapshot=query.get();
		try {
			for(DocumentSnapshot doc: querySnapshot.get().getDocuments())
			{
				resultList.add(doc.get("image_id").toString());
			}
			return resultList;
		}
		catch(Exception e)
		{
			System.out.println(e);
			return null;
		}
	}
	
	
	//insert new record in table(save an image)
	public void saveImageForUser(SavedImages savedImage)
	{
		db.collection("saved_images").document(savedImage.getSaved_id()).set(savedImage);
	}
	
	
	
}
