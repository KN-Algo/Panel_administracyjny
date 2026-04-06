package algo.validation;

import algo.module.PostTranslation;
import algo.module.PostType;
import algo.module.Posts;
import algo.services.exceptions.PostValidationException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Component;

/** Validator for Posts entity business rules. */
@Component
public class PostEntityValidator {

    /** Prefix used for translation array validation errors. */
    private static final String TRANS_PREFIX = "translations[";

    /**
     * Validates post data and throws exception if invalid.
     *
     * @param entity post to validate
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
            default -> {
                // Ignored to satisfy NonExhaustiveSwitch for potential future types
            }
        }

        if (!errs.isEmpty()) {
            throw new PostValidationException(errs);
        }
    }

    private void validateStandardFields(
            final Posts entity, final Map<String, String> errs) {
        requireNotNull(entity.getEventDate(), "eventDate", errs);
        requireNotBlank(entity.getThumbnailUrl(), "thumbnailUrl", errs);
        requireNotBlank(entity.getImageUrls(), "imageUrls", errs);
    }

    private void validateTempDates(
            final Posts entity, final Map<String, String> errs) {
        requireNotNull(entity.getStartsAt(), "startsAt", errs);
        requireNotNull(entity.getExpiresAt(), "expiresAt", errs);

        if (entity.getStartsAt() != null && entity.getExpiresAt() != null
                && entity.getExpiresAt().isBefore(entity.getStartsAt())) {
            errs.put("expiresAt", "expiresAt must be >= startsAt.");
        }
    }

    private void validateBasicTranslations(
            final Posts entity, final Map<String, String> errs) {
        if (!checkTranslationsExist(entity, errs)) {
            return;
        }
        int index = 0;
        for (final PostTranslation t : entity.getTranslations()) {
            final String pfx = TRANS_PREFIX + index + "].";
            requireNotBlank(t.getTitle(), pfx + "title", errs);
            requireNotBlank(t.getFullDescription(), pfx + "fullDesc", errs);
            index++;
        }
    }

    private void validateFullTranslations(
            final Posts entity, final Map<String, String> errs) {
        if (!checkTranslationsExist(entity, errs)) {
            return;
        }
        int index = 0;
        for (final PostTranslation t : entity.getTranslations()) {
            final String pfx = TRANS_PREFIX + index + "].";
            requireNotBlank(t.getTitle(), pfx + "title", errs);
            requireNotBlank(t.getFullDescription(), pfx + "fullDesc", errs);
            requireNotBlank(t.getShortDescription(), pfx + "shortDesc", errs);
            index++;
        }
    }

    private boolean checkTranslationsExist(
            final Posts entity, final Map<String, String> errs) {
        boolean exists = true;
        if (entity.getTranslations() == null || entity.getTranslations().isEmpty()) {
            errs.put("translations", "At least one translation required.");
            exists = false;
        }
        return exists;
    }

    private void requireNotNull(
            final Object value, final String field, final Map<String, String> errs) {
        if (value == null) {
            errs.put(field, "Field is required for this type.");
        }
    }

    private void requireNotBlank(
            final String value, final String field, final Map<String, String> errs) {
        if (value == null || value.isBlank()) {
            errs.put(field, "Field cannot be blank for this type.");
        }
    }
}