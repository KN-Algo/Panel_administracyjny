package algo.services.exceptions;

/**
 * Exception thrown when a requested team member cannot be found in the database.
 */
public class TeamMemberNotFoundException extends RuntimeException {

    public TeamMemberNotFoundException(final String message) {
        super(message);
    }
}