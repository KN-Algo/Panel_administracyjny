package algo.services.exceptions;

import java.util.Map;

/** Exception for invalid TEMP post request payloads. */
public final class InvalidPostRequestException extends RuntimeException {

  /** Map containing specific field validation errors. */
  private final Map<String, String> validationErrors;

  /**
  * Constructs a new exception with a message and a map of field errors.
  *
  * @param message the detail message
  * @param validationErrors map of field names to error messages
  */
  public InvalidPostRequestException(
      final String message, final Map<String, String> validationErrors) {
    super(message);
    this.validationErrors = validationErrors;
  }

  /**
  * Retrieves the map of validation errors.
  *
  * @return map of field names and their corresponding error messages
  */
  public Map<String, String> getValidationErrors() {
    return validationErrors;
  }
}
