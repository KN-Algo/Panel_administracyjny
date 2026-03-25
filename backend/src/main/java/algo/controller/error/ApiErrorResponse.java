package algo.controller.error;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Structured API error payload returned by REST controllers.
 *
 * @param timestamp error creation timestamp
 * @param status HTTP status code
 * @param error HTTP reason phrase
 * @param message human-readable error message
 * @param path request URI
 * @param validationErrors optional field-level validation errors
 */
public record ApiErrorResponse(
    LocalDateTime timestamp,
    int status,
    String error,
    String message,
    String path,
    Map<String, String> validationErrors) {}
