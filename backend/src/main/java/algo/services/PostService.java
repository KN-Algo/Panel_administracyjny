package algo.services;

import algo.module.PostTranslation;
import algo.module.PostType;
import algo.module.Posts;
import algo.repository.PostRepository;
import algo.security.HtmlSanitizer;
import algo.services.exceptions.PostNotFoundException;
import algo.services.exceptions.PostValidationException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.*;

/** Service for managing posts. */
@Service
public class PostService {

  /** Repository for Post persistence operations. */
  private final PostRepository postRepository;

  /** Time source used for evaluating active windows. */
  private final Clock clock = Clock.systemDefaultZone();

  /** List of post types that function as temporary modals or pop-ups. */
  private static final List<PostType> TEMP_TYPES = List.of(
    PostType.TEMP, PostType.TEMP_STANDARD, PostType.TEMP_NEWS);

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
      validatePostData(entity);

    for (PostTranslation translation : entity.getTranslations()) {
      translation.setShortDescription(HtmlSanitizer.sanitize(translation.getShortDescription()));
      translation.setFullDescription(HtmlSanitizer.sanitize(translation.getFullDescription()));
    }

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

    validatePostData(mergedEntity);

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
      result = postRepository.findActivePosts(types, now, pageable);
    } else {
      result = postRepository.findAllByPostTypeIn(types, pageable);
    }
    return result;
  }

    /**
     * Main validation method for posts based on business type.
     *
     * @param entity post entity to validate
     */
    private void validatePostData(final Posts entity) {
        final PostType type = entity.getPostType();
        final Map<String, String> errs = new HashMap<>();

        if (type == null) {
            throw new IllegalArgumentException("PostType cannot be null.");
        }

        if (type.name().startsWith("TEMP")) {
            validateTempDates(entity, errs);
        }

        switch (type) {
            case STANDARD, NEWS -> {
                validateStandardFields(entity, errs);
                validateFullTranslations(entity, errs);
            }
            case TEMP -> {
                requireNotBlank(entity.getThumbnailUrl(), "thumbnailUrl", errs);
                validateBasicTranslations(entity, errs);
            }
            case TEMP_STANDARD, TEMP_NEWS -> {
                validateStandardFields(entity, errs);
                validateFullTranslations(entity, errs);
            }
        }

        if (!errs.isEmpty()) {
            throw new PostValidationException(errs);
        }
    }

    /**
     * Validates fields required for standard and news post types.
     *
     * @param entity post entity to validate
     * @param errs map to store validation errors
     */
    private void validateStandardFields(
            final Posts entity, final Map<String, String> errs) {
        requireNotNull(entity.getEventDate(), "eventDate", errs);
        requireNotBlank(entity.getThumbnailUrl(), "thumbnailUrl", errs);
        requireNotBlank(entity.getImageUrls(), "imageUrls", errs);
    }

    /**
     * Validates post start and end dates based on its type.
     *
     * @param entity post entity to validate
     * @param errs map to store validation errors
     */
    private void validateTempDates(
            final Posts entity, final Map<String, String> errs) {
        requireNotNull(entity.getStartsAt(), "startsAt", errs);
        requireNotNull(entity.getExpiresAt(), "expiresAt", errs);

        if (entity.getStartsAt() != null && entity.getExpiresAt() != null
                && entity.getExpiresAt().isBefore(entity.getStartsAt())) {
            errs.put("expiresAt", "expiresAt must be >= startsAt.");
        }
    }

    /**
     * Basic translation validation (title and full description).
     *
     * @param entity post entity to validate
     * @param errs map to store validation errors
     */
    private void validateBasicTranslations(
            final Posts entity, final Map<String, String> errs) {
        if (!checkTranslationsExist(entity, errs)) {
            return;
        }

        int i = 0;
        for (final var t : entity.getTranslations()) {
            requireNotBlank(t.getTitle(), "translations[" + i + "].title", errs);
            requireNotBlank(
                    t.getFullDescription(), "translations[" + i + "].fullDesc", errs);
            i++;
        }
    }

    /**
     * Full translation validation (includes short description).
     *
     * @param entity post entity to validate
     * @param errs map to store validation errors
     */
    private void validateFullTranslations(
            final Posts entity, final Map<String, String> errs) {
        if (!checkTranslationsExist(entity, errs)) {
            return;
        }

        int i = 0;
        for (final var t : entity.getTranslations()) {
            requireNotBlank(t.getTitle(), "translations[" + i + "].title", errs);
            requireNotBlank(
                    t.getFullDescription(), "translations[" + i + "].fullDesc", errs);
            requireNotBlank(
                    t.getShortDescription(), "translations[" + i + "].shortDesc", errs);
            i++;
        }
    }

    /**
     * Ensures that the post has at least one translation.
     *
     * @param entity post entity to check
     * @param errs map to store validation errors
     * @return true if translations exist, false otherwise
     */
    private boolean checkTranslationsExist(
            final Posts entity, final Map<String, String> errs) {
        if (entity.getTranslations() == null || entity.getTranslations().isEmpty()) {
            errs.put("translations", "At least one translation required.");
            return false;
        }
        return true;
    }

    /**
     * Checks if the provided object is not null.
     *
     * @param value the object to check
     * @param fieldName name of the field for the error message
     * @param errs map to store validation errors
     */
    private void requireNotNull(
            final Object value, final String fieldName, final Map<String, String> errs) {
        if (value == null) {
            errs.put(fieldName, "Field is required for this type.");
        }
    }

    /**
     * Checks if the string is not null and not blank.
     *
     * @param value the string to check
     * @param fieldName name of the field for the error message
     * @param errs map to store validation errors
     */
    private void requireNotBlank(
            final String value, final String fieldName, final Map<String, String> errs) {
        if (value == null || value.trim().isEmpty()) {
            errs.put(fieldName, "Field cannot be blank for this type.");
        }
    }

    /** Returns all posts that are NOT modals (Standard and News). */
    @Transactional()
    public List<Posts> getNonTempPosts() {
        return postRepository.findAllByPostTypeNotIn(TEMP_TYPES);
    }

    /** Returns only news articles (excluding temp news). */
    @Transactional()
    public List<Posts> getNewsOnly() {
        return postRepository.findAllByPostTypeIn(List.of(PostType.NEWS));
    }

    /** Returns all modal-type posts (active and planned). */
    @Transactional()
    public List<Posts> getAllTempPosts() {
        return postRepository.findAllByPostTypeIn(TEMP_TYPES);
    }

    /** Returns the single most relevant active modal. */
    @Transactional()
    public Optional<Posts> getActiveModal() {
        final LocalDateTime now = LocalDateTime.now();
        return postRepository.findAllByPostTypeIn(TEMP_TYPES).stream()
                .filter(p -> p.getStartsAt() != null && !p.getStartsAt().isAfter(now))
                .filter(p -> p.getExpiresAt() != null && p.getExpiresAt().isAfter(now))
                .max(Comparator.comparing(Posts::getStartsAt));
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
