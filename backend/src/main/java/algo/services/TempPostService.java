package algo.services;

import algo.module.PostType;
import algo.module.Posts;
import algo.repository.PostRepository;
import jakarta.transaction.Transactional;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/** Service for managing temporary posts. */
@Service
public class TempPostService {

  /** Allowed temporary post types handled by this service. */
  private static final List<PostType> TEMP_TYPES =
      List.of(PostType.TEMP_STANDARD, PostType.TEMP_NEWS);

  /** Repository for Post persistence operations. */
  private final PostRepository postRepository;

  /** Time source used for evaluating active windows. */
  private final Clock clock;

  /**
   * Creates service with default system clock.
   *
   * @param repository post repository
   */
  public TempPostService(final PostRepository repository) {
    this(repository, Clock.systemDefaultZone());
  }

  /**
   * Creates service with explicit clock.
   *
   * @param repository post repository
   * @param timeSource clock used for current time
   */
  public TempPostService(final PostRepository repository, final Clock timeSource) {
    this.postRepository = repository;
    this.clock = timeSource;
  }

  /**
   * Persists a TEMP post after validation.
   *
   * @param entity post entity to save
   * @return persisted post entity
   */
  @Transactional
  public Posts save(final Posts entity) {
    ensureTemp(entity.getPostType());
    validateTempDates(entity);
    return postRepository.save(entity);
  }

  /**
   * Updates a TEMP post by id with merged data.
   *
   * @param postId id of post to update
   * @param mergedEntity updated post entity
   * @return updated and persisted post entity
   */
  @Transactional
  public Posts update(final Long postId, final Posts mergedEntity) {
    final Posts existing =
        postRepository.findWithTranslationsById(postId).orElseThrow(() -> postNotFound(postId));

    ensureTemp(existing.getPostType());
    validateTempDates(mergedEntity);

    mergedEntity.setPostId(postId);
    return postRepository.save(mergedEntity);
  }

  /**
   * Returns one TEMP post by id.
   *
   * @param postId id of post to fetch
   * @return found post entity
   */
  @Transactional
  public Posts getOne(final Long postId) {
    final Posts entity =
        postRepository.findWithTranslationsById(postId).orElseThrow(() -> postNotFound(postId));

    ensureTemp(entity.getPostType());
    return entity;
  }

  /**
   * Deletes one TEMP post by id.
   *
   * @param postId id of post to delete
   */
  @Transactional
  public void delete(final Long postId) {
    final Posts entity = postRepository.findById(postId).orElseThrow(() -> postNotFound(postId));

    ensureTemp(entity.getPostType());
    postRepository.delete(entity);
  }

  /**
   * Lists TEMP posts with optional type and activity filtering.
   *
   * @param pageable page request settings
   * @param type optional TEMP type filter
   * @param onlyActive whether to include only currently active posts
   * @return page of TEMP posts
   */
  @Transactional
  public Page<Posts> list(final Pageable pageable, final PostType type, final boolean onlyActive) {

    if (type != null) {
      ensureTemp(type);
    }

    final List<PostType> types = (type == null) ? TEMP_TYPES : List.of(type);

    final Page<Posts> result;
    if (onlyActive) {
      final LocalDateTime now = LocalDateTime.now(clock);
      result = postRepository.findActiveTempPosts(types, now, pageable);
    } else {
      result = postRepository.findAllByPostTypeIn(types, pageable);
    }
    return result;
  }

  /**
   * Ensures the given type is one of the TEMP types.
   *
   * @param type post type to validate
   */
  private void ensureTemp(final PostType type) {
    if (!TEMP_TYPES.contains(type)) {
      throw new IllegalArgumentException("Only TEMP posts are allowed here.");
    }
  }

  /**
   * Validates TEMP post start and end dates.
   *
   * @param entity post entity to validate
   */
  private void validateTempDates(final Posts entity) {
    if (entity.getStartsAt() == null || entity.getExpiresAt() == null) {
      throw new IllegalArgumentException("TEMP posts must have startsAt and expiresAt dates.");
    }
    if (entity.getExpiresAt().isBefore(entity.getStartsAt())) {
      throw new IllegalArgumentException("expiresAt must be >= startsAt.");
    }
  }

  /**
   * Creates a standardized not-found exception for posts.
   *
   * @param postId post identity
   * @return exception instance with formatted message
   */
  private IllegalArgumentException postNotFound(final Long postId) {
    return new IllegalArgumentException("Post not found: " + postId);
  }
}
