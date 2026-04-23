package algo.services;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service responsible for securely storing uploaded files on the local file system. It handles file
 * validation, filename sanitization, and protection against common vulnerabilities such as path
 * traversal and double extension attacks.
 */
@Service
public class FileStorageService {

  private final Path rootLocation;

  /** List of allowed MIME types for file uploads. Currently restricted to common image formats. */
  private static final List<String> ALLOWED_TYPES =
      List.of("image/jpeg", "image/png", "image/webp", "image/gif");

  /**
   * Initializes the storage service and creates the target directory if it does not exist.
   *
   * @param uploadDir the physical path to the upload directory, injected from application
   *     properties.
   * @throws RuntimeException if the directory cannot be created.
   */
  public FileStorageService(@Value("${app.upload.dir}") String uploadDir) {
    this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    try {
      Files.createDirectories(this.rootLocation);
    } catch (IOException e) {
      throw new RuntimeException("Could not create the upload directory.", e);
    }
  }

    /**
     * Validates, sanitizes, and stores the uploaded file on the file system.
     *
     * @param file the multipart file uploaded by the user.
     * @return the generated, unique, and safe filename.
     * @throws IllegalArgumentException if the file is empty.
     * @throws RuntimeException if the file type is invalid, a path traversal
     * attempt is detected, or an I/O error occurs.
     */
    public String store(MultipartFile file) {
        try {
            String extension = validateAndGetExtension(file);
            String safeFilename = generateSafeFilename(
                    extension, file.getOriginalFilename());

            Path destinationFile = this.rootLocation
                    .resolve(Paths.get(safeFilename))
                    .normalize()
                    .toAbsolutePath();

            if (!destinationFile.getParent()
                    .equals(this.rootLocation.toAbsolutePath())) {
                throw new RuntimeException(
                        "Error: Attempt to save file outside the allowed " +
                                "directory.");
            }

      try (InputStream inputStream = file.getInputStream()) {
        Files.copy(inputStream, destinationFile);
      }

      return safeFilename;

    } catch (IOException e) {
      throw new RuntimeException("Error during file save.", e);
    }
  }

    /**
     * Validates if the file is not empty and has an allowed MIME type.
     * Extracts and normalizes the file extension.
     *
     * @param file the uploaded file to validate.
     * @return the safe, normalized file extension (e.g., "jpg", "png").
     * @throws IllegalArgumentException if the file is empty or if the MIME
     * type is not allowed.
     */
    private String validateAndGetExtension(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Error: File is empty.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException(
                    "Error: Invalid file type. " +
                            "Allowed: JPG, JPEG, PNG, WebP, GIF.");
        }

        return contentType.substring(contentType.indexOf("/") + 1);
    }

  /**
   * Generates a unique and secure filename while preserving a sanitized version of the original
   * filename for readability. Format: YYYYMMDD_HHMMSS_UUID_originalName.extension
   *
   * @param extension the validated file extension.
   * @param originalFilename the original name of the uploaded file.
   * @return a safe and unique filename.
   */
  private String generateSafeFilename(String extension, String originalFilename) {

    String rawOriginalName =
        originalFilename != null
            ? org.springframework.util.StringUtils.cleanPath(originalFilename)
            : "file";
    int dotIndex = rawOriginalName.lastIndexOf(".");
    String nameWithoutExtension =
        (dotIndex == -1) ? rawOriginalName : rawOriginalName.substring(0, dotIndex);
    String safeOriginalName = nameWithoutExtension.replaceAll("[^a-zA-Z0-9\\-_]", "");

    if (safeOriginalName.isEmpty()) {
      safeOriginalName = "file";
    }

    String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
    String shortId = UUID.randomUUID().toString().substring(0, 4);

    return timestamp + "_" + shortId + "_" + safeOriginalName + "." + extension;
  }
}
