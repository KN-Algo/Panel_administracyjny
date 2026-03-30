package algo.services;

import algo.module.PostType;
import algo.module.PostTranslation;
import algo.module.PostType;
import algo.module.Posts;
import algo.repository.PostRepository;
import algo.security.HtmlSanitizer;
import algo.services.exceptions.InvalidTempPostDatesException;
import algo.services.exceptions.InvalidTempPostTypeException;
import algo.services.exceptions.TempPostNotFoundException;
import algo.services.exceptions.InvalidPostDatesException;
import algo.services.exceptions.PostNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/** Service for managing posts. */
@Service
public class PostService {

  /** Repository for Post persistence operations. */
  private final PostRepository postRepository;

  /** Time source used for evaluating active windows. */
  private final Clock clock = Clock.systemDefaultZone();

  /**
   * Creates service with required repository dependency.
   *
   * @param repository post repository
   */
  public PostService(final PostRepository repository) {
    this.postRepository = repository;
  }

  /**
   * Persists a post after validation.
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
   * Updates a post by id with merged data.
   *
   * @param postId id of post to update
   * @param mergedEntity updated post entity
   * @return updated and persisted post entity
   */
  @Transactional
  public Posts update(final Long postId, final Posts mergedEntity) {
    final Posts existing =
        postRepository
            .findWithTranslationsByPostId(postId)
            .orElseThrow(() -> postNotFound(postId));

    ensureTemp(existing.getPostType());
    ensureTemp(mergedEntity.getPostType());
    validateTempDates(mergedEntity);

    existing.setPostType(mergedEntity.getPostType());
    existing.setEventDate(mergedEntity.getEventDate());
    existing.setStartsAt(mergedEntity.getStartsAt());
    existing.setExpiresAt(mergedEntity.getExpiresAt());
    existing.setThumbnailUrl(mergedEntity.getThumbnailUrl());
    existing.setImageUrls(mergedEntity.getImageUrls());
    existing.setExternalLink(mergedEntity.getExternalLink());

    final Map<String, Long> existingIdsByLang = new HashMap<>();
    for (final PostTranslation translation : existing.getTranslations()) {
      existingIdsByLang.put(translation.getLanguageCode(), translation.getId());
    }

    existing.clearTranslations();
    for (final PostTranslation incoming : mergedEntity.getTranslations()) {
      final PostTranslation copy = new PostTranslation();
      final Long existingId = existingIdsByLang.get(incoming.getLanguageCode());
      if (existingId != null) {
        copy.setId(existingId);
      }
      copy.setLanguageCode(incoming.getLanguageCode());
      copy.setTitle(incoming.getTitle());
      copy.setShortDescription(HtmlSanitizer.sanitize(incoming.getShortDescription()));
      copy.setFullDescription(HtmlSanitizer.sanitize(incoming.getFullDescription()));
      existing.addTranslation(copy);
    }

    return postRepository.save(existing);
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
        postRepository
            .findWithTranslationsByPostId(postId)
            .orElseThrow(() -> postNotFound(postId));

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

    final List<PostType> types = (type == null)
            ? Arrays.asList(PostType.values())
            : List.of(type);

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
      throw new InvalidTempPostTypeException(type, TEMP_TYPES);
    }
  }

  /**
   * Validates TEMP post start and end dates.
   *
   * @param entity post entity to validate
   */
  private void validateTempDates(final Posts entity) {
    if (entity.getStartsAt() == null || entity.getExpiresAt() == null) {
      throw new InvalidPostDatesException(
          "TEMP posts must have startsAt and expiresAt dates.",
          entity.getStartsAt(),
          entity.getExpiresAt());
    }
    if (entity.getExpiresAt().isBefore(entity.getStartsAt())) {
      throw new InvalidPostDatesException(
          "expiresAt must be >= startsAt.", entity.getStartsAt(), entity.getExpiresAt());
    }
  }

  /**
   * Creates a standardized not-found exception for posts.
   *
   * @param postId post identity
   * @return exception instance with formatted message
   */
  private PostNotFoundException postNotFound(final Long postId) {
    return new PostNotFoundException(postId);
  }
}
