package algo.services.exceptions;

import java.time.LocalDateTime;

/** Thrown when TEMP post dates are missing or inconsistent. */
public final class InvalidPostDatesException extends RuntimeException {

  /** Provided startsAt date. */
  private final LocalDateTime startsAt;

  /** Provided expiresAt date. */
  private final LocalDateTime expiresAt;

  /**
   * Creates date validation exception.
   *
   * @param message error message
   * @param pStartsAt startsAt value
   * @param pExpiresAt expiresAt value
   */
  public InvalidPostDatesException(
      final String message, final LocalDateTime pStartsAt, final LocalDateTime pExpiresAt) {
    super(message);
    this.startsAt = pStartsAt;
    this.expiresAt = pExpiresAt;
  }

  /**
   * @return startsAt value from invalid request
   */
  public LocalDateTime getStartsAt() {
    return startsAt;
  }

  /**
   * @return expiresAt value from invalid request
   */
  public LocalDateTime getExpiresAt() {
    return expiresAt;
  }
}
