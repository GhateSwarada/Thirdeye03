package com.project.backend.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.project.backend.Entity.User;
import com.project.backend.Util.JwtUtil;

@Service
public class UserService {
	
	private final Firestore db;
	
	@Autowired
    public UserService(Firestore db) {
        this.db = db;
    }
	
	@Autowired
	private JwtUtil jwtUtil;
	
	
	//inserting user(registration)
	public void insertUser(User newUser)
	{
		db.collection("user_details").document(newUser.getUid()).set(newUser);
	}
	
	//checking if user present (login)
	public String isValidUser(String username, String password)
	{
		Query query = db.collection("user_details").whereEqualTo("username", username);
	    ApiFuture<QuerySnapshot> querySnapshot = query.get();

	    try {
			for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
			    User user = document.toObject(User.class);
			    if (user != null && user.getPassword().equals(password)) {
			        return jwtUtil.generateToken(user.getUid());
			    }
			}
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    // Return null only after checking all documents
	    return null;
	}
	
	//getting details of particular user
	public User getUserDetails(String userId)
	{
		DocumentReference docRef= db.collection("user_details").document(userId);
		DocumentSnapshot doc;
		try {
			doc = docRef.get().get();

			if(doc.exists()) {
				return doc.toObject(User.class);
			}
			else {
				return null;
			}
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	//follow a user
	public void addFollower(String userId, String followerUserId)
	{
		db.collection("user_details").document(userId).update("followings", FieldValue.arrayUnion(followerUserId));
	    db.collection("user_details").document(followerUserId).update("followers", FieldValue.arrayUnion(userId));
	}
	
	//un-follow a user
	public void unFollow(String userId, String unFollowId)
	{
		db.collection("user_details").document(userId).update("followings", FieldValue.arrayRemove(unFollowId));
	    db.collection("user_details").document(unFollowId).update("followers", FieldValue.arrayRemove(userId));
		
	}
	
	//deleting user(delete account)
	public void deleteUser(String userId)
	{
	    db.collection("user_details").document(userId).delete();

	    ApiFuture<QuerySnapshot> query = db.collection("user_details").get();

	    try {
			for (DocumentSnapshot doc : query.get().getDocuments()) {
			    User user = doc.toObject(User.class);

			    if (user != null && user.getFollowings() != null && user.getFollowings().contains(userId)) {
			        db.collection("user_details").document(user.getUid()).update("followings", FieldValue.arrayRemove(userId));
			    }

			    if (user != null && user.getFollowers() != null && user.getFollowers().contains(userId)) {
			        db.collection("user_details").document(user.getUid()).update("followers", FieldValue.arrayRemove(userId));
			    }
			}
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	//update password(forget password)
	public boolean updateRequest(String email, String username, String newPassword)
	{
	    Query query = db.collection("user_details").whereEqualTo("email", email);
	    ApiFuture<QuerySnapshot> snap = query.get();

	    try {
			for (DocumentSnapshot doc : snap.get().getDocuments()) {
			    User user = doc.toObject(User.class);
			    if (user != null && user.getUsername().equals(username)) {
			        db.collection("user_details").document(user.getUid()).update("password", newPassword);
			        return true;
			    }
			}
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    return false;
	}
	
	//user logout
    public boolean logoutUser(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        jwtUtil.invalidateToken(token);
        return true;
    }
    
    //user details for someone else profile(person profile page)
    public List<Map<String, String>> getPersonProfileDetails(String uid) {
        if (uid == null || uid.isEmpty()) {
            throw new IllegalArgumentException("'uid' must be a non-empty String");
        }

        List<Map<String, String>> resultList = new ArrayList<Map<String, String>>();
        DocumentReference docRef = db.collection("user_details").document(uid);
        DocumentSnapshot doc;
        try {
            doc = docRef.get().get();
            Map<String, String> newMap = new HashMap<String, String>();
            if (doc.exists()) {
                newMap.put("userId", uid);
                newMap.put("username", doc.getString("username"));
                newMap.put("profile_photo", doc.getString("profile_photo_url"));
                newMap.put("likes", String.valueOf(doc.getLong("like")));
                newMap.put("work", String.valueOf(doc.getLong("no_of_work")));
                resultList.add(newMap);
                return resultList;
            } else {
                return null;
            }
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    
    //checking if one user follow the other(person_profile follow/unfollow button)
    public boolean doesFollow(String userId, String uid) {
        try {

            // Fetch user document directly using document ID
            DocumentReference userRef = db.collection("user_details").document(userId);
            ApiFuture<DocumentSnapshot> future = userRef.get();
            DocumentSnapshot document = future.get();

            if (!document.exists()) {
                System.out.println("User document not found: " + userId);
                return false;
            }

            List<String> followings = (List<String>) document.get("followings");

            return followings != null && followings.contains(uid);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    
    
    //getting list of user name, userId and profile_img of followers/followings(profile page)
    public List<Map<String, String>> getPeopleList(String userId, String type)
    {
    	List<Map<String, String>> resultList=new ArrayList<Map<String,String>>();
    	DocumentReference docRef=db.collection("user_details").document(userId);
    	DocumentSnapshot doc;
    	try {
    		doc=docRef.get().get();
    		if(doc.exists())
    		{
    			@SuppressWarnings("unchecked")
				List<String> personsIds= (type.equalsIgnoreCase("followers")? (List<String>) doc.get("followers") : (List<String>) doc.get("followings"));
    			if(personsIds.isEmpty() || personsIds==null)
    			{
    				return null;
    			}
    			for(String id: personsIds)
    			{
    				DocumentSnapshot person=db.collection("user_details").document(id).get().get();
    				Map<String, String> details=new HashMap<String, String>();
    				details.put("personId", id);
    				details.put("username", person.getString("username"));
    				details.put("profile_path", person.getString("profile_photo_url"));
    				resultList.add(details);
    			}
    			return resultList;
    		}
    		else {
    			return null;
    		}
    	}catch(Exception e)
    	{
    		System.out.println(e);
    		return null;
    	}
    }

	
}
