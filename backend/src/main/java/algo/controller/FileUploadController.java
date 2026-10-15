package algo.controller;

import algo.config.SwaggerExamples;
import algo.services.FileStorageService;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
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
@Tag(name = "Zarządzanie Plikami", description = "Endpointy do bezpiecznego przesyłania i zapisywania obrazków na serwerze")
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
  @Operation(summary = "Prześlij jeden plik", description = "Zapisuje pojedynczy plik graficzny na serwerze i zwraca wygenerowany do niego link. Dozwolone formaty: JPG, JPEG, PNG, WebP, GIF.")
  @ApiResponses(value = {
          @ApiResponse(
                  responseCode = "200",
                  description = "Pomyślnie zapisano plik",
                  content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.FILE_UPLOAD_200))
          ),
          @ApiResponse(
                  responseCode = "400",
                  description = "Błąd walidacji pliku (np. nieobsługiwany format, pusty plik)",
                  content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.FILE_UPLOAD_400))
          )
  })
  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Map<String, String>> handleFileUpload(
          @Parameter(description = "Plik obrazu do przesłania")
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
  @Operation(summary = "Prześlij wiele plików (Batch)", description = "Przetwarza listę plików graficznych. Zwraca połączony raport zawierający zarówno pomyślnie zapisane pliki (wraz z linkami), jak i błędy dla odrzuconych plików.")
  @ApiResponse(
          responseCode = "200",
          description = "Pomyślnie zakończono przetwarzanie paczki plików. Sprawdź odpowiedź, aby zweryfikować statusy poszczególnych plików.",
          content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.FILE_BATCH_200))
  )
  @PostMapping(value = "/upload/batch", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Map<String, Object>> handleBatchUpload(
          @Parameter(description = "Lista plików obrazów do przesłania")
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
