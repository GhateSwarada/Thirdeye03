package com.project.backend.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.project.backend.Entity.Images;

@Service
public class ImagesService {

	private final Firestore db;
	
	@Autowired
    public ImagesService(Firestore db) {
        this.db = db;
    }
	
	//get 20 random images(home page, explore page)
	public List<Map<String, String>> getRandomImages() {
	    CollectionReference imgRef = db.collection("images_info");
	    List<Map<String, String>> randomImages = new ArrayList<>();
	    try {
	        List<QueryDocumentSnapshot> documents = new ArrayList<>(imgRef.get().get().getDocuments());
	        Collections.shuffle(documents);

	        for (int i = 0; i < Math.min(20, documents.size()); i++) {
	            DocumentSnapshot doc = documents.get(i);
	            Map<String, String> imageData = new HashMap<>();
	            imageData.put("image_id", doc.getId());
	            imageData.put("image_name", doc.getString("img_name"));
	            imageData.put("image_url", doc.getString("img_url"));
	            imageData.put("image_layout", doc.getString("layout"));
	            imageData.put("likes", doc.contains("img_likes") ? String.valueOf(doc.get("img_likes")) : "0");
	            imageData.put("des", doc.getString("des"));
	            randomImages.add(imageData);
	        }

	        return randomImages;
	    } catch (Exception e) {
	        System.out.println(e);
	        return null;
	    }
	}


	
	
	//get uploaded photos according to date(user profile images photos/illustration) done
	public List<Map<String, String>> getUserUploads(String userId, String type)
	{
		List<Map<String, String>> resultList=new ArrayList<>();
		Query query=db.collection("images_info").whereEqualTo("user_id", userId).whereEqualTo("img_type", type);
		ApiFuture<QuerySnapshot> querySnapshot= query.get();
		try {
			for(DocumentSnapshot doc: querySnapshot.get().getDocuments())
			{
				Map<String, String> imgList=new HashMap<>();
				imgList.put("image_id", doc.getId());
				imgList.put("image_url", doc.getString("img_url"));
				imgList.put("des", doc.getString("des"));
				imgList.put("likes", doc.contains("img_likes") ? String.valueOf(doc.get("img_likes")) : "0");
				imgList.put("layout", doc.getString("layout"));
				imgList.put("img_name", doc.getString("img_name"));
				resultList.add(imgList);
			}
			return resultList;
		}
		catch(Exception e)
		{
			System.out.println(e);
			return null;
		}
	}
	
	//get each image details(on click of each image) done
//	public Images getImageDetails(String imgId)
//	{
//		DocumentReference ref= db.collection("images_info").document(imgId);
//		DocumentSnapshot doc;
//		try {
//			doc=ref.get().get();
//			if(doc.exists())
//			{
//				return doc.toObject(Images.class);
//			}
//			else {
//				return null;
//			}
//		}
//		catch(Exception e)
//		{
//			System.out.println(e);
//			return null;
//		}	 
//	}
	
	public List<Map<String, String>> getImageDetails(String imgId) {
	    List<Map<String, String>> imageList = new ArrayList<>();

	    try {
	        // Fetch image details using the given imgId
	        DocumentReference imgRef = db.collection("images_info").document(imgId);
	        DocumentSnapshot imgDoc = imgRef.get().get();

	        if (imgDoc.exists()) {
	            Images image = imgDoc.toObject(Images.class);

	            if (image != null) {
	                // Fetch user details using user_id
	                DocumentReference userRef = db.collection("user_details").document(image.getUser_id());
	                DocumentSnapshot userDoc = userRef.get().get();
	                String username = (userDoc.exists()) ? userDoc.getString("username") : "Unknown";

	                // Create map for image details
	                Map<String, String> imageDetails = new HashMap<>();
	                imageDetails.put("img_id", image.getImg_id());
	                imageDetails.put("user_id", image.getUser_id());
	                imageDetails.put("username", username);
	                imageDetails.put("img_name", image.getImg_name());
	                imageDetails.put("img_url", image.getImg_url());
	                imageDetails.put("img_likes", String.valueOf(image.getImg_likes()));
	                imageDetails.put("img_type", image.getImg_type());
	                imageDetails.put("hashtag", image.getHashtag());
	                imageDetails.put("upload_date", image.getUpload_date());
	                imageDetails.put("layout", image.getLayout());
	                imageDetails.put("description", image.getDes());

	                imageList.add(imageDetails);
	            }
	        }
	    } catch (Exception e) {
	        System.out.println(e);
	    }

	    return imageList;
	}

	
	//get each image details(on click of each image) done
		public Images getImageDetailsAsSave(String imgId)
		{
			DocumentReference ref= db.collection("images_info").document(imgId);
			DocumentSnapshot doc;
			try {
				doc=ref.get().get();
				if(doc.exists())
				{
					return doc.toObject(Images.class);
				}
				else {
					return null;
				}
			}
			catch(Exception e)
			{
				System.out.println(e);
				return null;
			}	 
		}

	
	
	//get all images as per the hash tags(filters on explore page) done
	public List<Map<String, String>> getPerFilter(String filter)
	{
		List<Map<String, String>> resultList=new ArrayList<>();
		Query query=db.collection("images_info").whereEqualTo("hashtag", filter);
		ApiFuture<QuerySnapshot> querySnapshot= query.get();
		try {
			for(DocumentSnapshot doc: querySnapshot.get().getDocuments())
			{
				Map<String, String> imgMap= new HashMap<>();
				imgMap.put("image_id", doc.getId());
				imgMap.put("image_url", doc.getString("img_url"));
				imgMap.put("des", doc.getString("des"));
				imgMap.put("likes", doc.contains("img_likes") ? String.valueOf(doc.get("img_likes")) : "0");
				imgMap.put("layout", doc.getString("layout"));
				imgMap.put("img_name", doc.getString("img_name"));
				resultList.add(imgMap);
			}
			return resultList;
		}
		catch(Exception e)
		{
			System.out.println(e);
			return null;
		}
	}
	
	
	//get image path url as per the image id(saved images part) done
	public List<Map<String, String>> getImageDetails(List<String> imagesId)
	{
		List<Map<String, String>> infoList=new ArrayList<>();
		try {
			for(String imageId: imagesId)
			{
				DocumentReference ref=db.collection("images_info").document(imageId);
				DocumentSnapshot snap=ref.get().get();
				if(snap.exists())
				{
					Map<String, String> imageInfo=new HashMap<>();
					imageInfo.put("image_id", imageId);
					imageInfo.put("img_url", snap.getString("img_url"));
					imageInfo.put("layout", snap.getString("layout"));
					imageInfo.put("des", snap.getString("des"));
					imageInfo.put("likes", snap.contains("img_likes") ? String.valueOf(snap.get("img_likes")) : "0");
					imageInfo.put("img_name", snap.getString("img_name"));
					
					infoList.add(imageInfo);
				}
			}
			return infoList;
		}
		catch(Exception e)
		{
			System.out.println(e);
			return null;
		}
	}
	
	//inserting new image with its information(upload page) done
	public void insertImage(Images imageInfo)
	{
		db.collection("images_info").document(imageInfo.getImg_id()).set(imageInfo);
		String userId=imageInfo.getUser_id().toString();
		db.collection("user_details").document(userId).update("no_of_work",FieldValue.increment(1));
	}
	
	//delete image done
	public void deleteImage(String image_id)
	{
		db.collection("images_info").document(image_id).delete();
	}
	
	
	//liking image done
	public void likeImage(String imageId)
	{
		db.collection("images_info").document(imageId).update("img_likes", FieldValue.increment(1));
		DocumentReference docRef=db.collection("images_info").document(imageId);
		DocumentSnapshot doc;
		try {
			doc=docRef.get().get();
			if(doc.exists())
			{
				String userId=doc.getString("user_id").toString();
				db.collection("user_details").document(userId).update("like",FieldValue.increment(1));
			}
		}catch(Exception e)
		{
			System.out.println(e);
		}
	}
	
	//image as per the search(search bar)
	public List<Map<String, String>> imagesBySearch(String searchWord) {
        List<Map<String, String>> imageList = new ArrayList<>();
        Set<String> addedDocIds = new HashSet<String>(); // To avoid duplicate images

        try {
            CollectionReference imagesRef = db.collection("images_info");

            // Create individual queries for each field
            List<Query> queries = Arrays.asList(
                imagesRef.whereEqualTo("name", searchWord),
                imagesRef.whereEqualTo("type", searchWord),
                imagesRef.whereEqualTo("hashtag", searchWord)
            );

            for (Query query : queries) {
                ApiFuture<QuerySnapshot> querySnapshot = query.get();
                for (DocumentSnapshot doc : querySnapshot.get().getDocuments()) {
                    if (!addedDocIds.contains(doc.getId())) {  // Avoid duplicate results
                        Map<String, String> newMap=new HashMap<String, String>();
                        newMap.put("Image_id", doc.getId());
                        newMap.put("image_url", doc.getString("img_url"));
                        newMap.put("image_layout", doc.getString("layout"));
                        newMap.put("name", doc.getString("img_name"));
                        addedDocIds.add(doc.getId());
                        imageList.add(newMap);
                    }
                    else {
                    	return null;
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Error fetching images: " + e.getMessage());
        }

        return imageList;
    }
	
}
