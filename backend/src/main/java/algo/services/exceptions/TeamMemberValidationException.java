package algo.services.exceptions;

import java.util.Map;
import lombok.Getter;

/** Exception thrown when manual validation of Team Member data fails. */
@Getter
public class TeamMemberValidationException extends RuntimeException {

    /** Map containing field paths as keys and validation error messages as values. */
    private final Map<String, String> errors;

    /**
     * Constructs a new validation exception with the specified error map.
     *
     * @param errors map of validation errors
     */
    public TeamMemberValidationException(final Map<String, String> errors) {
        super("Team member validation failed.");
        this.errors = errors;
    }
}