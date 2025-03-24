package com.project.backend.Config;

import java.io.FileInputStream;
import java.io.IOException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

@Configuration
public class FirebaseConfig {
	
	@Bean
	public FirebaseApp firebaseApp() throws IOException{
		FileInputStream serviceAccount = new FileInputStream("src/main/resources/thirdeye-spring-boot-firebase-adminsdk-fbsvc-2c63990933.json");
		FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setDatabaseUrl("https://thirdeye-spring-boot.firebaseio.com")
                .build();

        return FirebaseApp.initializeApp(options);
	}
	
	@Bean
    public Firestore firestore(FirebaseApp firebaseApp) {
        return FirestoreClient.getFirestore(firebaseApp);
    }
}
