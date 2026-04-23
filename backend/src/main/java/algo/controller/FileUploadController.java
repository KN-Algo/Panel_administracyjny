package algo.controller;

import algo.services.FileStorageService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST controller responsible for handling file upload requests. It acts as an entry point for
 * clients to upload files and receive accessible URLs to the stored resources.
 */
@RestController
@RequestMapping("/api/files")
public class FileUploadController {

  private final FileStorageService storageService;

  /**
   * Constructs the controller with the required file storage service.
   *
   * @param storageService the service used to validate and store files.
   */
  public FileUploadController(FileStorageService storageService) {
    this.storageService = storageService;
  }

  /**
   * Handles HTTP POST requests for uploading a single file. Saves the file using the underlying
   * storage service and constructs a relative URL that the frontend can use to access the image.
   *
   * @param file the multipart file sent by the client in the request.
   * @return a response containing a JSON object with the "url" key mapping to the relative path of
   *     the uploaded file.
   */
  @PostMapping("/upload")
  public ResponseEntity<Map<String, String>> handleFileUpload(
      @RequestParam("file") MultipartFile file) {

    String filename = storageService.store(file);
    String relativeUrl = "/img/" + filename;

    Map<String, String> response = new HashMap<>();
    response.put("url", relativeUrl);

    return ResponseEntity.ok(response);
  }

    /**
     * Handles batch file uploads with partial success processing.
     * Iterates through files, storing valid ones and catching errors
     * for invalid ones, returning a detailed report for the frontend.
     *
     * @param files the list of multipart files sent by the client.
     * @return a response containing lists of successes and errors.
     */
    @PostMapping("/upload/batch")
    public ResponseEntity<Map<String, Object>> handleBatchUpload(
            @RequestParam("files") List<MultipartFile> files) {

        List<Map<String, String>> successes = new java.util.ArrayList<>();
        List<Map<String, String>> errors = new java.util.ArrayList<>();

        for (MultipartFile file : files) {
            String originalName = file.getOriginalFilename() != null
                    ? file.getOriginalFilename() : "unknown";

            try {
                String filename = storageService.store(file);

                Map<String, String> successData = new HashMap<>();
                successData.put("filename", originalName);
                successData.put("url", "/img/" + filename);
                successes.add(successData);

            } catch (Exception e) {
                Map<String, String> errorData = new HashMap<>();
                errorData.put("filename", originalName);
                errorData.put("error", e.getMessage());
                errors.add(errorData);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("successes", successes);
        response.put("errors", errors);

        return ResponseEntity.ok(response);
    }

}
