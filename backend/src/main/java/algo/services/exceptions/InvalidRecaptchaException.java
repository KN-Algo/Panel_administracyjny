package algo.services.exceptions;

public class InvalidRecaptchaException extends RuntimeException {
    public InvalidRecaptchaException(final String message) {
        super(message);
    }
}