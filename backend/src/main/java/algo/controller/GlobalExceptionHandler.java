package algo.controller;

import algo.controller.error.ApiErrorResponse;
import algo.module.PostType;
import algo.services.exceptions.InvalidTempPostDatesException;
import algo.services.exceptions.InvalidTempPostTypeException;
import algo.services.exceptions.TempPostNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/** Global REST exception mapping for consistent API error responses. */
@RestControllerAdvice
public final class GlobalExceptionHandler {

  @ExceptionHandler(TempPostNotFoundException.class)
  public ResponseEntity<ApiErrorResponse> handleTempPostNotFound(
      final TempPostNotFoundException ex, final HttpServletRequest request) {
    return buildError(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI(), null);
  }

  @ExceptionHandler(InvalidTempPostTypeException.class)
  public ResponseEntity<ApiErrorResponse> handleInvalidTempType(
      final InvalidTempPostTypeException ex, final HttpServletRequest request) {
    final Map<String, String> details = new LinkedHashMap<>();
    details.put("providedType", String.valueOf(ex.getProvidedType()));
    details.put("allowedTypes", toCsv(ex.getAllowedTypes()));
    return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI(), details);
  }

  @ExceptionHandler(InvalidTempPostDatesException.class)
  public ResponseEntity<ApiErrorResponse> handleInvalidTempDates(
      final InvalidTempPostDatesException ex, final HttpServletRequest request) {
    final Map<String, String> details = new LinkedHashMap<>();
    details.put("startsAt", String.valueOf(ex.getStartsAt()));
    details.put("expiresAt", String.valueOf(ex.getExpiresAt()));
    return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI(), details);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiErrorResponse> handleValidation(
      final MethodArgumentNotValidException ex, final HttpServletRequest request) {
    final Map<String, String> validationErrors = new LinkedHashMap<>();
    ex.getBindingResult()
        .getFieldErrors()
        .forEach(error -> validationErrors.put(error.getField(), error.getDefaultMessage()));
    return buildError(
        HttpStatus.BAD_REQUEST,
        "Request validation failed.",
        request.getRequestURI(),
        validationErrors);
  }

  @ExceptionHandler({
    BindException.class,
    MethodArgumentTypeMismatchException.class,
    MissingServletRequestParameterException.class,
    IllegalArgumentException.class
  })
  public ResponseEntity<ApiErrorResponse> handleBadRequest(
      final Exception ex, final HttpServletRequest request) {
    return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI(), null);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiErrorResponse> handleUnexpected(
      final Exception ex, final HttpServletRequest request) {
    return buildError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Unexpected server error.",
        request.getRequestURI(),
        null);
  }

  private ResponseEntity<ApiErrorResponse> buildError(
      final HttpStatus status,
      final String message,
      final String path,
      final Map<String, String> validationErrors) {
    final ApiErrorResponse body =
        new ApiErrorResponse(
            LocalDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            path,
            (validationErrors == null || validationErrors.isEmpty()) ? null : validationErrors);
    return ResponseEntity.status(status).body(body);
  }

  private String toCsv(final Iterable<PostType> types) {
    final StringBuilder csv = new StringBuilder();
    for (final PostType type : types) {
      if (!csv.isEmpty()) {
        csv.append(", ");
      }
      csv.append(type);
    }
    return csv.toString();
  }
}
