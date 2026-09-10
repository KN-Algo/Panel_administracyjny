package algo.dto;

import algo.module.TeamRole;
import java.util.List;
import java.util.Map;

/**
 * Data Transfer Object for returning team member details to the client.
 */
public record TeamMemberResponseDto(
        Long memberId,
        String firstName,
        String lastName,
        TeamRole role,
        Integer sortOrder,
        List<TeamMemberTranslationDto> translations,
        List<String> imageUrls,
        Map<String, String> socialLinks
) {}