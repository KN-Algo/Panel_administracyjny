package algo.services.exceptions;

import algo.module.PostType;
import java.util.List;

/** Thrown when a non-TEMP post type is used in temp-post operations. */
public final class InvalidTempPostTypeException extends RuntimeException {

  /** Provided invalid post type. */
  private final PostType providedType;

  /** Allowed TEMP post types for this service. */
  private final List<PostType> allowedTypes;

  /**
   * Creates type validation exception.
   *
   * @param type provided post type
   * @param allowed allowed temporary post types
   */
  public InvalidTempPostTypeException(final PostType type, final List<PostType> allowed) {
    super("Only TEMP posts are allowed here.");
    this.providedType = type;
    this.allowedTypes = List.copyOf(allowed);
  }

  /**
   * @return invalid post type provided by caller
   */
  public PostType getProvidedType() {
    return providedType;
  }

  /**
   * @return immutable list of allowed types
   */
  public List<PostType> getAllowedTypes() {
    return allowedTypes;
  }
}
