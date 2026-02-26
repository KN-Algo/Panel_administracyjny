package algo.dto;

@SuppressWarnings("PMD")
/**
 * * Supressing PMD is needed because this commed it too long for PMD. * (You can't split it because
 * checklist has ból dupy) DTO representing a translation of a post.
 *
 * @param translationId unique identifier of the translation
 * @param languageCode language code of the translation
 * @param title title of the post in this language
 * @param shortDescription short description in this language
 * @param fullDescription full description in this language
 */
public record PostTranslationDto(
    Long translationId,
    String languageCode,
    String title,
    String shortDescription,
    String fullDescription) {}
