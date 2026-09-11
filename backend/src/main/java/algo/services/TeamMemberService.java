package algo.services;

import algo.dto.TeamMemberRequestDto;
import algo.dto.TeamMemberResponseDto;
import algo.dto.TeamMemberTranslationDto;
import algo.module.TeamMember;
import algo.module.TeamMemberTranslation;
import algo.module.TeamRole;
import algo.repository.TeamMemberRepository;

import java.util.List;
import java.util.Map;
import java.util.Set;

import algo.security.HtmlSanitizer;
import algo.services.exceptions.TeamMemberNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * Service class for managing team members.
 * Handles business logic, CRUD operations, and mapping between DTOs and entities.
 */
@Service
@RequiredArgsConstructor
public class TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;

    /**
     * Retrieves team members filtered by their specific role.
     *
     * @param role the role to filter by
     * @return a list of team members matching the role
     */
    @Transactional(readOnly = true)
    public List<algo.dto.TeamMemberResponseDto> getAllTeamMembers(final TeamRole role, final String search) {

        final String safeSearch = (search == null || search.isBlank()) ? "" : search.trim();

        return teamMemberRepository.findAllWithFilters(role, safeSearch).stream()
                .map(this::mapToDto)
                .toList();
    }

    /**
     * Retrieves a specific team member by their ID.
     *
     * @param id the ID of the team member
     * @return the response DTO of the found team member
     * @throws RuntimeException if the team member is not found
     */
    @Transactional(readOnly = true)
    public TeamMemberResponseDto getTeamMemberById(final Long id) {
        return teamMemberRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new TeamMemberNotFoundException("Team member not found with ID: " + id));}

    /**
     * Creates a new team member from the provided request DTO.
     *
     * @param requestDto the data for the new team member
     * @return the created team member mapped to a response DTO
     */
    @Transactional
    public TeamMemberResponseDto createTeamMember(final TeamMemberRequestDto requestDto) {
        validateRequest(requestDto);
        final TeamMember teamMember = new TeamMember();
        updateEntityFromDto(teamMember, requestDto);
        final TeamMember savedMember = teamMemberRepository.save(teamMember);
        return mapToDto(savedMember);
    }

    /**
     * Updates an existing team member.
     *
     * @param id the ID of the team member to update
     * @param requestDto the updated data
     * @return the updated team member mapped to a response DTO
     * @throws RuntimeException if the team member is not found
     */
    @Transactional
    public TeamMemberResponseDto updateTeamMember(final Long id, final TeamMemberRequestDto requestDto) {
        final TeamMember teamMember = teamMemberRepository.findById(id)
                .orElseThrow(() -> new TeamMemberNotFoundException("Team member not found with ID: " + id));

        updateEntityFromDto(teamMember, requestDto);
        final TeamMember updatedMember = teamMemberRepository.save(teamMember);

        return mapToDto(updatedMember);
    }

    /**
     * Deletes a team member by their ID.
     *
     * @param id the ID of the team member to delete
     * @throws RuntimeException if the team member is not found
     */
    @Transactional
    public void deleteTeamMember(final Long id) {
        if (!teamMemberRepository.existsById(id)) {
            throw new TeamMemberNotFoundException("Team member not found with ID: " + id);
        }
        teamMemberRepository.deleteById(id);
    }

    /**
     * Validates the incoming request DTO for creating or updating a team member.
     *
     * @param dto the team member request data to validate
     * @throws algo.services.exceptions.TeamMemberValidationException if any validation rule is violated
     */
    private void validateRequest(final TeamMemberRequestDto dto) {
        final Map<String, String> errors = new java.util.LinkedHashMap<>();

        validateTranslations(dto.translations(), errors);

        if (!errors.isEmpty()) {
            throw new algo.services.exceptions.TeamMemberValidationException(errors);
        }
    }

    /**
     * Validates the list of team member translations.
     * Ensures that exactly three required languages (PL, EN, DE) are provided,
     * rejects unsupported languages, and checks for duplicates.
     *
     * @param translations the list of translations to validate
     * @param errors       the map to collect validation errors
     */
    private void validateTranslations(
            final List<algo.dto.TeamMemberTranslationDto> translations, final Map<String, String> errors) {

        if (translations == null || translations.isEmpty()) {
            errors.put("translations", "must not be empty");
            return;
        }

        final List<String> providedLangs = translations.stream()
                .filter(t -> t != null && StringUtils.hasText(t.languageCode()))
                .map(t -> t.languageCode().toUpperCase())
                .toList();

        final List<String> requiredLangs = java.util.List.of("PL", "EN", "DE");
        final List<String> missingLangs = requiredLangs.stream()
                .filter(lang -> !providedLangs.contains(lang))
                .toList();

        if (!missingLangs.isEmpty()) {
            errors.put("translations.missing", "Missing required translation(s): " + String.join(", ", missingLangs));
        }

        final List<String> unsupportedLangs = providedLangs.stream()
                .filter(lang -> !requiredLangs.contains(lang))
                .toList();

        if (!unsupportedLangs.isEmpty()) {
            errors.put("translations.unsupported", "Unrecognized language(s) provided: " + String.join(", ", unsupportedLangs));
        }

        final Set<String> uniqueLangs = new java.util.HashSet<>();
        final List<String> duplicates = providedLangs.stream()
                .filter(lang -> !uniqueLangs.add(lang))
                .distinct()
                .toList();

        if (!duplicates.isEmpty()) {
            errors.put("translations.duplicates", "Duplicate translations found for language(s): " + String.join(", ", duplicates));
        }

        for (int i = 0; i < translations.size(); i++) {
            validateSingleTranslation(translations.get(i), i, errors);
        }
    }

    /**
     * Validates a single translation entry based on its content.
     * Checks for missing required fields using the list index for precise error reporting.
     *
     * @param translation the translation DTO to validate
     * @param index       the position of the translation in the request list
     * @param errors      the map to collect validation errors
     */
    private void validateSingleTranslation(
            final algo.dto.TeamMemberTranslationDto translation,
            final int index,
            final Map<String, String> errors) {

        final String prefix = "translations[" + index + "]";

        if (translation == null) {
            errors.put(prefix, "must not be null");
            return;
        }

        if (!StringUtils.hasText(translation.languageCode())) {
            errors.put(prefix + ".languageCode", "must not be blank");
        }

        if (!StringUtils.hasText(translation.displayedTitle())) {
            errors.put(prefix + ".displayedTitle", "must not be blank");
        }
    }

    /**
     * Updates a TeamMember entity using data from the provided DTO.
     * Applies XSS sanitization to plain text and rich text fields,
     * and recreates the collection of localized translations.
     *
     * @param entity the team member entity to update
     * @param dto    the data transfer object containing new values
     */
    private void updateEntityFromDto(final TeamMember entity, final TeamMemberRequestDto dto) {
        entity.setFirstName(HtmlSanitizer.sanitizePlainText(dto.firstName()));
        entity.setLastName(HtmlSanitizer.sanitizePlainText(dto.lastName()));
        entity.setRole(dto.role());
        entity.setSortOrder(dto.sortOrder() != null ? dto.sortOrder() : 999);

        if (dto.translations() != null) {
            for (final TeamMemberTranslationDto translationDto : dto.translations()) {
                final String lang = translationDto.languageCode().toUpperCase();

                final java.util.Optional<TeamMemberTranslation> existingTranslationOpt = entity.getTranslations().stream()
                        .filter(t -> t.getLanguageCode().equalsIgnoreCase(lang))
                        .findFirst();

                if (existingTranslationOpt.isPresent()) {
                    final TeamMemberTranslation existing = existingTranslationOpt.get();
                    existing.setDisplayedTitle(HtmlSanitizer.sanitizePlainText(translationDto.displayedTitle()));
                    existing.setDescription(HtmlSanitizer.sanitize(translationDto.description()));
                } else {
                    final TeamMemberTranslation newTranslation = new TeamMemberTranslation();
                    newTranslation.setLanguageCode(lang);
                    newTranslation.setDisplayedTitle(HtmlSanitizer.sanitizePlainText(translationDto.displayedTitle()));
                    newTranslation.setDescription(HtmlSanitizer.sanitize(translationDto.description()));

                    entity.addTranslation(newTranslation);
                }
            }
        }

        if (dto.imageUrls() != null) {
            final List<String> validUrls = dto.imageUrls().stream()
                    .filter(org.springframework.util.StringUtils::hasText)
                    .map(HtmlSanitizer::sanitizePlainText)
                    .toList();
            entity.setImageUrlsFromList(validUrls);
        } else {
            entity.setImageUrlsFromList(java.util.Collections.emptyList());
        }

        if (dto.socialLinks() != null && !dto.socialLinks().isEmpty()) {
            final Map<String, String> safeLinks = new java.util.HashMap<>();
            dto.socialLinks().forEach((k, v) -> {
                final String safeKey = HtmlSanitizer.sanitizePlainText(k);
                final String safeVal = HtmlSanitizer.sanitizePlainText(v);
                if (org.springframework.util.StringUtils.hasText(safeKey) && org.springframework.util.StringUtils.hasText(safeVal)) {
                    safeLinks.put(safeKey, safeVal);
                }
            });
            entity.setSocialLinks(safeLinks);
        } else {
            entity.setSocialLinks(java.util.Collections.emptyMap());
        }
    }

    /**
     * Maps a TeamMember entity back to its corresponding response DTO.
     *
     * @param entity the team member entity to map
     * @return the fully mapped TeamMemberResponseDto
     */
    private TeamMemberResponseDto mapToDto(final TeamMember entity) {
        final List<TeamMemberTranslationDto> translationDtos = entity.getTranslations().stream()
                .map(t -> new TeamMemberTranslationDto(
                        t.getId(),
                        t.getLanguageCode(),
                        t.getDisplayedTitle(),
                        t.getDescription()
                ))
                .toList();

        return new TeamMemberResponseDto(
                entity.getMemberId(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getRole(),
                entity.getSortOrder(),
                translationDtos,
                entity.getImageUrlsAsList(),
                entity.getSocialLinks()
        );
    }
}