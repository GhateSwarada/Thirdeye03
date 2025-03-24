package com.project.backend.Controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.project.backend.Entity.Images;
import com.project.backend.Entity.SavedImages;
import com.project.backend.Service.ImagesService;
import com.project.backend.Service.SavedImagesService;

@Controller
@RequestMapping("/api/images")
public class ImagesController {

	@Autowired
	private ImagesService imagesService;
	
	@Autowired
	private SavedImagesService savedImagesService;
	
	
	//filter images(explore page)
	@PostMapping("/getFilterImages")//done
	public ResponseEntity<List<Map<String, String>>> getImagesAsFilter(@RequestBody Map<String, String> selectedFilter)
	{
		String filter=selectedFilter.get("filter").toString();
		List<Map<String, String>> result= imagesService.getPerFilter(filter);
		if(result!=null)
		{
			return ResponseEntity.ok(result);
		}
		else {
			return ResponseEntity.status(401).body(null);
		}
	}
	
	//saved images(profile page)
	@PostMapping("/savedImages") //done checked
	public ResponseEntity<List<Map<String, String>>> getSavedImages(@RequestBody Map<String, String> userInfo) {
	    String uid = userInfo.get("userId").toString();
	    System.out.println("Querying Firestore for UID: " + uid);

	    List<String> imagesId = savedImagesService.getSavedImages(uid);
	    System.out.println("Fetched image IDs: " + imagesId);

	    if (imagesId != null && !imagesId.isEmpty()) {
	        List<Map<String, String>> resultList = new ArrayList<>();

	        for (String imgId : imagesId) {
	            Images image = imagesService.getImageDetailsAsSave(imgId);
	            if (image != null) {
	                // Convert Images object to Map<String, String>
	                Map<String, String> imageMap = new HashMap<>();
	                imageMap.put("image_id", image.getImg_id());
	                imageMap.put("image_url", image.getImg_url());
	                imageMap.put("des", image.getDes());
	                imageMap.put("likes", String.valueOf(image.getImg_likes()));
	                imageMap.put("layout", image.getLayout());
	                imageMap.put("img_name", image.getImg_name()); // Modify based on your Images class
	                resultList.add(imageMap);
	            }
	        }

	        if (!resultList.isEmpty()) {
	            return ResponseEntity.ok(resultList);
	        } else {
	            return ResponseEntity.status(404).body(null); // No images found
	        }
	    } else {
	        return ResponseEntity.status(404).body(null); // No saved image IDs
	    }
	}	
	
	
	//on click on image
	@PostMapping("/imageDetails")//done
	public ResponseEntity<List<Map<String, String>>> getDetails(@RequestBody Map<String, String> imageInfo)
	{
		String image_id=imageInfo.get("image_id").toString();
		List<Map<String, String>> image=imagesService.getImageDetails(image_id);
		if(image!=null)
		{
			return ResponseEntity.ok(image);
		}
		else {
			return ResponseEntity.status(401).body(null);
		}
	}
	
	
	//images for home page and explore
	@PostMapping("/getRandomImages")//done checked
	public ResponseEntity<List<Map<String, String>>> getImages()
	{
		List<Map<String, String>> resultList=imagesService.getRandomImages();
		if(resultList!=null)
		{
			return ResponseEntity.ok(resultList);
		}
		else {
			return ResponseEntity.status(401).body(null);
		}
	}
	
	
	//deleting the image (profile page by user)
	@PostMapping("/deleteImage")
	public ResponseEntity<String> deleteImage(@RequestBody Map<String, String> imageInfo)
	{
		String image_id=imageInfo.get("image_id").toString();
		try {
		imagesService.deleteImage(image_id);
		return ResponseEntity.ok("Deleted Successfully");
		}
		catch(Exception e)
		{
			System.out.println(e);
			return ResponseEntity.status(401).body("Not deleted successfully");
		}
	}
	
	//images as per the type
	@PostMapping("/imagesPerType")//done checked
	public ResponseEntity<List<Map<String, String>>> getImagesPerType(@RequestBody Map<String, String> info)
	{
		String userId=info.get("user_id").toString();
		String type=info.get("type").toString();
		List<Map<String, String>> resultList= imagesService.getUserUploads(userId, type);
		if(resultList!=null)
		{
			return ResponseEntity.ok(resultList);
		}
		else {
			return ResponseEntity.status(401).body(null);
		}
	}
	
	//inserting new uploaded image
	@PostMapping("/uploadImage")//done checked
	public ResponseEntity<String> uploadNewImage(@RequestBody Map<String, String> details)
	{
		Random no= new Random();
		String imageId= "I"+no.nextInt(1000);
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		Images image=new Images();
		image.setUser_id(details.get("user_id"));
		image.setImg_type(details.get("type"));
		image.setImg_name(details.get("name"));
		image.setImg_likes(0);
		image.setImg_url(details.get("url_path"));
		image.setUpload_date(formatter.format(new Date()));
		image.setImg_id(imageId);
		image.setLayout(details.get("layout"));
		image.setDes(details.get("des"));
		image.setHashtag(details.get("hashtag"));
		 imagesService.insertImage(image);
		return null;
	}
	
	//liking image(each image page)
	@PostMapping("/likeImage")//done checked
	public ResponseEntity<String> likeAnImage(@RequestBody Map<String, String> imgInfo)
	{
		try {
			imagesService.likeImage(imgInfo.get("img_id"));
			return ResponseEntity.ok("Successfull");
		}
		catch(Exception e){
			return ResponseEntity.status(401).body("unsuccessfull");
		}
	}
	
	
	//save particular image for a user(save image button)
	@PostMapping("/saveImage") //done checked
	public ResponseEntity<String> saveParticularImage(@RequestBody Map<String, String> info)
	{
		Random no= new Random();
		String savedId= "S"+no.nextInt(1000);
		SavedImages savedImage=new SavedImages();
		savedImage.setSaved_id(savedId);
		savedImage.setUid(info.get("userId"));
		savedImage.setImage_id(info.get("imageId"));
		try {
			savedImagesService.saveImageForUser(savedImage);
			return ResponseEntity.ok("Image saved successfully");
		}
		catch(Exception e)
		{
			System.out.println(e);
			return ResponseEntity.status(401).body("there is an error");
		}
	}
	
		
	
	//image as per the search (search bar)
	@GetMapping("/searchBy/{searchWord}")//done
	public ResponseEntity<List<Map<String, String>>> getSearchedImages(@PathVariable String searchWord)
	{
		List<Map<String, String>> resultList=imagesService.imagesBySearch(searchWord);
		if(resultList!=null)
		{
			return ResponseEntity.ok(resultList);
		}
		else {
			return ResponseEntity.status(401).body(null);
		}
	}
	
}
