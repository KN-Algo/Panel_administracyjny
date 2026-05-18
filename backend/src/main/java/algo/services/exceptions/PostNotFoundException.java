package algo.services.exceptions;

/** Thrown when temporary post does not exist. */
public final class PostNotFoundException extends RuntimeException {

  /** Missing temporary post id. */
  private final Long postId;

  /**
   * Creates exception for a missing temporary post.
   *
   * @param pId post identifier
   */
  public PostNotFoundException(final Long pId) {
    super("Temporary post not found: " + pId);
    this.postId = pId;
  }

  /**
   * @return missing post id
   */
  public Long getPostId() {
    return postId;
  }
}
