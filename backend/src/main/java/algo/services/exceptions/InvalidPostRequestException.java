package algo.services.exceptions;

import java.util.Map;

/** Exception for invalid TEMP post request payloads. */
public final class InvalidPostRequestException extends RuntimeException {

  private final Map<String, String> validationErrors;

  public InvalidPostRequestException(
      final String message, final Map<String, String> validationErrors) {
    super(message);
    this.validationErrors = validationErrors;
  }

  public Map<String, String> getValidationErrors() {
    return validationErrors;
  }
}
