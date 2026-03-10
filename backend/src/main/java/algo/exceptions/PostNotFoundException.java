package algo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/** Exception thrown when a post is not found. */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class PostNotFoundException extends RuntimeException {
  /** Serial version UID. */
  private static final long serialVersionUID = 1L;

  /**
   * Constructor for PostNotFoundException.
   *
   * @param postId the ID of the post that was not found
   */
  public PostNotFoundException(final Long postId) {
    super("Post nie znaleziony: " + postId);
  }
}
