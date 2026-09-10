package algo.services.exceptions;

/**
 * Exception thrown when the Google reCAPTCHA token verification fails or the user is identified as a bot.
 */
public class InvalidRecaptchaException extends RuntimeException {

    /**
     * Constructs the exception with a specific error message.
     *
     * @param message the detail message explaining the reason for the verification failure.
     */
    public InvalidRecaptchaException(final String message) {
        super(message);
    }
}