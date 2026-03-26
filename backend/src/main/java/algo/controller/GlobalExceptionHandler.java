package algo.controller;

import algo.controller.error.ApiErrorResponse;
import algo.module.PostType;
import algo.services.exceptions.InvalidTempPostDatesException;
import algo.services.exceptions.InvalidTempPostRequestException;
import algo.services.exceptions.InvalidTempPostTypeException;
import algo.services.exceptions.TempPostNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.TypeMismatchException;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
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

  @ExceptionHandler(InvalidTempPostRequestException.class)
  public ResponseEntity<ApiErrorResponse> handleInvalidTempPostRequest(
      final InvalidTempPostRequestException ex, final HttpServletRequest request) {
    return buildError(
        HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI(), ex.getValidationErrors());
  }

  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ApiErrorResponse> handleTypeMismatch(
      final MethodArgumentTypeMismatchException ex, final HttpServletRequest request) {
    return buildTypeMismatchError(ex.getName(), ex.getRequiredType(), request);
  }

  @ExceptionHandler({TypeMismatchException.class, ConversionFailedException.class})
  public ResponseEntity<ApiErrorResponse> handleConversionMismatch(
      final Exception ex, final HttpServletRequest request) {
    if (ex instanceof final TypeMismatchException mismatch) {
      return buildTypeMismatchError(
          mismatch.getPropertyName(), mismatch.getRequiredType(), request);
    }
    if (ex instanceof final ConversionFailedException conversion
        && conversion.getTargetType() != null) {
      return buildTypeMismatchError(null, conversion.getTargetType().getType(), request);
    }
    return buildError(
        HttpStatus.BAD_REQUEST, "Invalid parameter value.", request.getRequestURI(), null);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ApiErrorResponse> handleUnreadable(
      final HttpMessageNotReadableException ex, final HttpServletRequest request) {
    return buildError(
        HttpStatus.BAD_REQUEST, "Malformed request body.", request.getRequestURI(), null);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolation(
      final DataIntegrityViolationException ex, final HttpServletRequest request) {
    return buildError(
        HttpStatus.BAD_REQUEST, "Request validation failed.", request.getRequestURI(), null);
  }

  @ExceptionHandler({
    BindException.class,
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

  private ResponseEntity<ApiErrorResponse> buildTypeMismatchError(
      final String paramName, final Class<?> requiredType, final HttpServletRequest request) {
    final String safeName = (paramName == null || paramName.isBlank()) ? "parameter" : paramName;
    final String message;
    if (requiredType == PostType.class) {
      message =
          "Invalid value for parameter '"
              + safeName
              + "'. Allowed: "
              + toCsv(Arrays.asList(PostType.values()))
              + ".";
    } else {
      message = "Invalid value for parameter '" + safeName + "'.";
    }
    return buildError(HttpStatus.BAD_REQUEST, message, request.getRequestURI(), null);
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
