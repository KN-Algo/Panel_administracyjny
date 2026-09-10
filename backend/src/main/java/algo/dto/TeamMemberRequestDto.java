package algo.dto;

import algo.module.TeamRole;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;

/**
 * Data Transfer Object for creating and updating a team member.
 *
 * @param firstName    the first name of the team member
 * @param lastName     the last name of the team member
 * @param role         the organizational role of the team member
 * @param translations list of localized translations for the displayed title and description
 * @param imageUrls    list of URLs pointing to the team member's images
 * @param socialLinks  map of social media links (e.g., "github" -> "link")
 */
public record TeamMemberRequestDto(

        @NotBlank(message = "First name cannot be blank.")
        @Size(max = 100, message = "First name is too long.")
        String firstName,

        @NotBlank(message = "Last name cannot be blank.")
        @Size(max = 100, message = "Last name is too long.")
        String lastName,

        @NotNull(message = "Role must be specified.")
        TeamRole role,

        Integer sortOrder,

        @NotEmpty(message = "Translations must not be empty.")
        @Valid
        List<TeamMemberTranslationDto> translations,

        List<String> imageUrls,

        Map<String, String> socialLinks
) {}