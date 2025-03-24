package com.project.backend.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.google.cloud.firestore.Firestore;
import com.project.backend.Entity.ContactInfo;

@Controller
@RequestMapping("/api/contact")
public class ContactInfoController {
	
private final Firestore db;
	
	@Autowired
    public ContactInfoController(Firestore db) {
        this.db = db;
    }
	
	@PostMapping("/add")
	public void addInfo(@RequestBody Map<String, String> contactInfo)
	{
		ContactInfo info=new ContactInfo();
		info.setEmail(contactInfo.get("email"));
		info.setMessage(contactInfo.get("message"));
		db.collection("contact_info").document().set(info);
	}
	
}
