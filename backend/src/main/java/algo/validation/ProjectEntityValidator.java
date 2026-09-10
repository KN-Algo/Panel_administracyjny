package algo.validation;

import algo.module.Project;
import algo.module.ProjectTranslation;
import algo.services.exceptions.ProjectValidationException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

/**
 * Validator for Project entity business rules. Ensures project data meets
 * all translation and content constraints.
 */
@Component
public class ProjectEntityValidator {

    /** List of languages required for a project to be published. */
    private static final Set<String> REQUIRED_LANGS = Set.of("PL", "EN", "DE");

    public ProjectEntityValidator() {
    }

    /**
     * Validates project data. Throws an exception if the data is invalid.
     *
     * @param entity the project entity to validate.
     * @throws ProjectValidationException if validation errors occur.
     */
    public void validateProjectData(final Project entity) {
        final Map<String, String> errs = new LinkedHashMap<>();

        validateTranslations(entity, errs);

        if (!errs.isEmpty()) {
            throw new ProjectValidationException(errs);
        }
    }

    /**
     * Validates translations (title and description) and ensures all required languages exist.
     *
     * @param entity the project entity to validate.
     * @param errs the map to collect validation errors.
     */
    private void validateTranslations(final Project entity, final Map<String, String> errs) {

        if (checkTranslationsExist(entity, errs)) {
            for (final ProjectTranslation t : entity.getTranslations()) {
                final boolean hasCode = t.getLanguageCode() != null && !t.getLanguageCode().isBlank();
                final String langCode = hasCode ? t.getLanguageCode().toUpperCase() : "UNKNOWN";
                final String pfx = "translations[" + langCode + "].";

                requireNotBlank(t.getTitle(), pfx + "title", errs);
                requireNotBlank(t.getDescription(), pfx + "description", errs);
            }
        }
    }

    /**
     * Checks if the translations list contains all required language codes.
     *
     * @param entity the project entity to check.
     * @param errs the map to collect validation errors.
     * @return true if all required translations exist, false otherwise.
     */
    private boolean checkTranslationsExist(final Project entity, final Map<String, String> errs) {

        if (entity.getTranslations() == null || entity.getTranslations().isEmpty()) {
            errs.put("translations", "Translations list cannot be null or empty.");
            return false;
        }

        final Set<String> providedLangs = entity.getTranslations().stream()
                .map(t -> t.getLanguageCode() != null ? t.getLanguageCode().toUpperCase() : "")
                .collect(Collectors.toSet());

        final List<String> missingLangs = REQUIRED_LANGS.stream()
                .filter(lang -> !providedLangs.contains(lang))
                .toList();

        if (!missingLangs.isEmpty()) {
            errs.put("translations", "Missing required translations for languages: " + String.join(", ", missingLangs));
            return false;
        }

        return true;
    }

    /**
     * Helper method to validate that a string is not blank or null.
     *
     * @param value the string to check.
     * @param field the field name for the error map.
     * @param errs the map to collect validation errors.
     */
    private void requireNotBlank(final String value, final String field, final Map<String, String> errs) {
        if (value == null || value.isBlank()) {
            errs.put(field, "Field cannot be blank.");
        }
    }
}