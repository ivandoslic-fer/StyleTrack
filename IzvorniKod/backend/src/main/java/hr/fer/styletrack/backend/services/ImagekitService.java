package hr.fer.styletrack.backend.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;

@Service
public class ImagekitService {

    private static final String IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

    public String uploadImage(MultipartFile file) throws Exception {
        // Validate the file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Prepare headers
        HttpHeaders headers = new HttpHeaders();
        String authorizationKey = System.getenv("IMAGEKIT_KEY");
        if (authorizationKey == null || authorizationKey.isEmpty()) {
            throw new IllegalStateException("Environment variable IMAGEKIT_KEY is not set or empty");
        }

        headers.set("Authorization", authorizationKey);
        headers.set("Accept", "application/json");

        // Prepare form data
        MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();
        formData.add("file", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });
        formData.add("fileName", file.getOriginalFilename());

        // Create request entity
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(formData, headers);

        // Make the HTTP POST request
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(
                IMAGEKIT_UPLOAD_URL,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        // Parse response
        if (response.getStatusCode().is2xxSuccessful()) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonResponse = mapper.readTree(response.getBody());
            return jsonResponse.get("url").asText(); // Extract the image URL
        } else {
            System.out.println("Response Body: " + response.getBody());
            throw new RuntimeException("Failed to upload image: " + response.getBody());
        }
    }
}
