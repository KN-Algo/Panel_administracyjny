package algo.services.exceptions;

import java.util.Map;

/** Exception thrown when post validation fails. */
public class PostValidationException extends RuntimeException {

    private final Map<String, String> errors;

    /**
     * Creates a new validation exception with collected errors.
     *
     * @param errors map of field names and error messages
     */
    public PostValidationException(final Map<String, String> errors) {
        super("Post validation failed.");
        this.errors = errors;
    }

    /**
     * Returns the collected validation errors.
     *
     * @return map of errors
     */
    public Map<String, String> getErrors() {
        return errors;
    }
}