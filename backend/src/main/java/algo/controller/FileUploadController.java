package algo.controller;

import algo.services.FileStorageService;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST controller for handling file upload requests. Returns accessible URLs to the stored
 * resources.
 */
@RestController
@RequestMapping("/api/files")
public class FileUploadController {

  /** The service handling file storage operations. */
  private final FileStorageService storageService;

  /**
   * Constructs the controller with the required file storage service.
   *
   * @param storageService the service used to validate and store files.
   */
  public FileUploadController(final FileStorageService storageService) {
    this.storageService = storageService;
  }

  /**
   * Handles single file uploads and returns its relative URL.
   *
   * @param file the multipart file sent by the client in the request.
   * @return a response containing a JSON object with the "url" key.
   */
  @PostMapping("/upload")
  public ResponseEntity<Map<String, String>> handleFileUpload(
      @RequestParam("file") final MultipartFile file) {

    final String filename = storageService.store(file);

    return ResponseEntity.ok(Map.of("url", "/img/" + filename));
  }

  /**
   * Handles batch file uploads with partial success processing. Returns a detailed report of
   * successful and failed uploads.
   *
   * @param files the list of multipart files sent by the client.
   * @return a response containing lists of successes and errors.
   */
  @PostMapping("/upload/batch")
  public ResponseEntity<Map<String, Object>> handleBatchUpload(
      @RequestParam("files") final List<MultipartFile> files) {

    final List<Map<String, String>> successes = new ArrayList<>();
    final List<Map<String, String>> errors = new ArrayList<>();

    for (final MultipartFile file : files) {
      final String originalName =
          file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown";

      try {
        final String filename = storageService.store(file);

        successes.add(Map.of("filename", originalName, "url", "/img/" + filename));

      } catch (IllegalArgumentException | IllegalStateException | SecurityException e) {

        errors.add(Map.of("filename", originalName, "error", e.getMessage()));
      }
    }

    return ResponseEntity.ok(
        Map.of(
            "successes", successes,
            "errors", errors));
  }
}
