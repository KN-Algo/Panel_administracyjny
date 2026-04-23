package algo.validation;

import algo.module.PostTranslation;
import algo.module.PostType;
import algo.module.Posts;
import algo.services.exceptions.PostValidationException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Component;

/**
 * Validator for Posts entity business rules. Ensures that post data meets all required constraints
 * depending on its specific PostType.
 */
@Component
public class PostEntityValidator {

  /**
   * Validates post data based on its type and throws an exception if the data is invalid.
   *
   * @param entity the post entity to validate.
   * @throws IllegalArgumentException if PostType is null.
   * @throws PostValidationException if validation errors occur.
   */
  @SuppressWarnings("PMD.UseConcurrentHashMap")
  public void validatePostData(final Posts entity) {
    final Map<String, String> errs = new LinkedHashMap<>();
    final PostType type = entity.getPostType();

    if (type == null) {
      throw new IllegalArgumentException("PostType cannot be null.");
    }

    if (type.name().startsWith("TEMP")) {
      validateTempDates(entity, errs);
    }

    switch (type) {
      case STANDARD, NEWS, TEMP_STANDARD, TEMP_NEWS -> {
        validateStandardFields(entity, errs);
        validateFullTranslations(entity, errs);
      }
      case TEMP -> {
        requireNotBlank(entity.getThumbnailUrl(), "thumbnailUrl", errs);
        validateBasicTranslations(entity, errs);
      }
      default -> {
        // Ignored to satisfy NonExhaustiveSwitch for future types
      }
    }

    if (!errs.isEmpty()) {
      throw new PostValidationException(errs);
    }
  }

  /**
   * Validates fields required for standard and news posts.
   *
   * @param entity the post entity to validate.
   * @param errs the map to collect validation errors.
   */
  private void validateStandardFields(final Posts entity, final Map<String, String> errs) {

    requireNotNull(entity.getEventDate(), "eventDate", errs);
    requireNotBlank(entity.getThumbnailUrl(), "thumbnailUrl", errs);
    requireNotBlank(entity.getImageUrls(), "imageUrls", errs);
  }

  /**
   * Validates start and expiration dates for temporary posts.
   *
   * @param entity the post entity to validate.
   * @param errs the map to collect validation errors.
   */
  private void validateTempDates(final Posts entity, final Map<String, String> errs) {

    requireNotNull(entity.getStartsAt(), "startsAt", errs);
    requireNotNull(entity.getExpiresAt(), "expiresAt", errs);

    if (entity.getStartsAt() != null
        && entity.getExpiresAt() != null
        && entity.getExpiresAt().isBefore(entity.getStartsAt())) {
      errs.put("expiresAt", "expiresAt must be >= startsAt.");
    }
  }

  /**
   * Validates basic translation fields (title and full description) typically required for simple
   * temporary posts.
   *
   * @param entity the post entity to validate.
   * @param errs the map to collect validation errors.
   */
  private void validateBasicTranslations(final Posts entity, final Map<String, String> errs) {

    if (!checkTranslationsExist(entity, errs)) {
      return;
    }

    for (final PostTranslation t : entity.getTranslations()) {
      boolean hasCode = t.getLanguageCode() != null && !t.getLanguageCode().isBlank();

      final String langCode = hasCode ? t.getLanguageCode().toUpperCase() : "UNKNOWN";

      final String pfx = "translations[" + langCode + "].";
      requireNotBlank(t.getTitle(), pfx + "title", errs);
      requireNotBlank(t.getFullDescription(), pfx + "fullDesc", errs);
    }
  }

  /**
   * Validates all translation fields including short description. Required for standard and news
   * posts.
   *
   * @param entity the post entity to validate.
   * @param errs the map to collect validation errors.
   */
  private void validateFullTranslations(final Posts entity, final Map<String, String> errs) {

    if (!checkTranslationsExist(entity, errs)) {
      return;
    }

    for (final PostTranslation t : entity.getTranslations()) {
      boolean hasCode = t.getLanguageCode() != null && !t.getLanguageCode().isBlank();

      final String langCode = hasCode ? t.getLanguageCode().toUpperCase() : "UNKNOWN";

      final String pfx = "translations[" + langCode + "].";
      requireNotBlank(t.getTitle(), pfx + "title", errs);
      requireNotBlank(t.getFullDescription(), pfx + "fullDesc", errs);
      requireNotBlank(t.getShortDescription(), pfx + "shortDesc", errs);
    }
  }

  /**
   * Checks if the translations list exists and is not empty.
   *
   * @param entity the post entity to check.
   * @param errs the map to collect validation errors.
   * @return true if translations exist, false otherwise.
   */
  private boolean checkTranslationsExist(final Posts entity, final Map<String, String> errs) {

    if (entity.getTranslations() == null || entity.getTranslations().isEmpty()) {
      errs.put("translations", "At least one translation required.");
      return false;
    }
    return true;
  }

  /**
   * Helper method to validate that an object is not null.
   *
   * @param value the object to check.
   * @param field the field name for the error map.
   * @param errs the map to collect validation errors.
   */
  private void requireNotNull(
      final Object value, final String field, final Map<String, String> errs) {

    if (value == null) {
      errs.put(field, "Field is required for this type.");
    }
  }

  /**
   * Helper method to validate that a string is not blank or null.
   *
   * @param value the string to check.
   * @param field the field name for the error map.
   * @param errs the map to collect validation errors.
   */
  private void requireNotBlank(
      final String value, final String field, final Map<String, String> errs) {

    if (value == null || value.isBlank()) {
      errs.put(field, "Field cannot be blank for this type.");
    }
  }
}
