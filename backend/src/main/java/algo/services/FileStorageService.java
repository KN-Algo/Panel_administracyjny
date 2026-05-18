package algo.services;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service for securely storing uploaded files locally. Handles validation, sanitization, and path
 * traversal protection.
 */
@Service
public class FileStorageService {

  /** The root directory path for safely storing files. */
  private final Path rootLocation;

  /** Allowed MIME types for uploads. Restricted to images. */
  private static final List<String> ALLOWED_TYPES =
      List.of("image/jpeg", "image/png", "image/webp", "image/gif");

  /**
   * Initializes storage service and creates target directory.
   *
   * @param uploadDir physical path to upload directory.
   */
  public FileStorageService(@Value("${app.upload.dir}") final String uploadDir) {

    this.rootLocation = Paths.get(uploadDir);
    try {
      Files.createDirectories(this.rootLocation);
    } catch (IOException e) {
      throw new IllegalStateException("Could not create upload dir.", e);
    }
  }

  /**
   * Validates, sanitizes, and securely stores the uploaded file.
   *
   * @param file the multipart file to store.
   * @return the generated, secure filename.
   */
  public String store(final MultipartFile file) {
    try {
      final String extension = validateAndGetExtension(file);
      final String originalName = file.getOriginalFilename();
      final String safeFilename = generateSafeFilename(extension, originalName);

      final Path destinationFile =
          this.rootLocation.resolve(Paths.get(safeFilename)).normalize().toAbsolutePath();

      if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
        throw new SecurityException("Error: Attempt to save file outside allowed dir.");
      }

      try (InputStream inputStream = file.getInputStream()) {
        Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
      }
      return safeFilename;

    } catch (IOException e) {
      throw new IllegalStateException("Error during file save.", e);
    }
  }

  /**
   * Validates file MIME type and extracts its extension.
   *
   * @param file the file to validate.
   * @return normalized file extension.
   */
  private String validateAndGetExtension(final MultipartFile file) {
    if (file.isEmpty()) {
      throw new IllegalArgumentException("Error: File is empty.");
    }

    final String contentType = file.getContentType();
    if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
      throw new IllegalArgumentException(
          "Error: Invalid file type. " + "Allowed: JPG, JPEG, PNG, WebP, GIF.");
    }

    return contentType.substring(contentType.indexOf('/') + 1);
  }

  /**
   * Generates a unique, secure filename based on the original name.
   *
   * @param extension the validated extension.
   * @param filename the original filename from request.
   * @return a safe filename string.
   */
  private String generateSafeFilename(final String extension, final String filename) {

    final String rawOriginalName = filename != null ? StringUtils.cleanPath(filename) : "unknown";

    final int dotIndex = rawOriginalName.lastIndexOf('.');
    final String baseName =
        dotIndex == -1 ? rawOriginalName : rawOriginalName.substring(0, dotIndex);

    final String cleanName = baseName.replaceAll("[^a-zA-Z0-9\\-_]", "");

    final String timestamp =
        LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

    final String shortId = UUID.randomUUID().toString().substring(0, 4);

    return timestamp + "_" + shortId + "_" + cleanName + "." + extension;
  }
}
