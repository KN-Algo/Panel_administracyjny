package algo.dto;

import algo.module.ProjectType;
import java.util.List;

/** Full admin-facing DTO (includes id and all translations). */
public record ProjectResponseDto(
    Long projectId,
    ProjectType status,
    Integer displayOrder,
    List<String> images,
    List<ProjectTranslationDto> translations) {}

