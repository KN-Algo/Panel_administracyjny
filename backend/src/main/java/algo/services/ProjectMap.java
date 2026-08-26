package algo.services;

import algo.dto.ProjectResponseDto;
import algo.dto.ProjectRequestDto;
import algo.dto.ProjectTranslationDto;
import algo.module.Project;
import algo.module.ProjectTranslation;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import algo.security.HtmlSanitizer;
import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

/** Maps project DTOs to and from the Project entity. */
@Component
@NoArgsConstructor
public class ProjectMap {
  /**
   * Maps request DTO to a new {@link Project} entity.
   *
   * @param dto request payload
   * @return new project entity filled with request values
   */
  public Project toEntity(final ProjectRequestDto dto) {
    final Project project = new Project();
    applyToEntity(project, dto);
    return project;
  }

  /**
   * Applies DTO values to an existing {@link Project} entity.
   *
   * @param target entity to update
   * @param dto source DTO with updated values
   */
  public void applyToEntity(final Project target, final ProjectRequestDto dto) {
    target.setStatus(dto.status());
    target.setDisplayOrder(dto.displayOrder());

    target.getImages().clear();
    if (dto.images() != null) {
      target.getImages().addAll(dto.images());
    }

    if (dto.translations() != null) {
      final List<String> incomingLangs = dto.translations().stream()
              .map(t -> t.languageCode().toUpperCase())
              .toList();

      target.getTranslations().removeIf(existing ->
              !incomingLangs.contains(existing.getLanguageCode().toUpperCase())
      );

      for (final ProjectTranslationDto tDto : dto.translations()) {
        final ProjectTranslation existingTranslation = target.getTranslations().stream()
                .filter(t -> t.getLanguageCode().equalsIgnoreCase(tDto.languageCode()))
                .findFirst()
                .orElse(null);

        final String safeDescription = HtmlSanitizer.sanitize(tDto.description());

        if (existingTranslation != null) {
          existingTranslation.setTitle(tDto.title());
          existingTranslation.setDescription(safeDescription);
        } else {
          final ProjectTranslation newTranslation = new ProjectTranslation();
          newTranslation.setLanguageCode(tDto.languageCode().toUpperCase());
          newTranslation.setTitle(tDto.title());
          newTranslation.setDescription(safeDescription);
          target.addTranslation(newTranslation);
        }
      }
    } else {
      target.clearTranslations();
    }
  }

  /**
   * Maps a {@link Project} entity to an admin response DTO.
   *
   * @param entity source project entity
   * @return mapped admin response DTO
   */
  public ProjectResponseDto toAdminResponse(final Project entity) {
    final List<ProjectTranslationDto> translations = new ArrayList<>();
    if (entity.getTranslations() != null) {
      for (final ProjectTranslation t : entity.getTranslations()) {
        translations.add(new ProjectTranslationDto(t.getId(), t.getLanguageCode(), t.getTitle(), t.getDescription()));
      }
    }

    return new ProjectResponseDto(
        entity.getProjectId(),
        entity.getStatus(),
        entity.getDisplayOrder(),
        new ArrayList<>(entity.getImages()),
        translations);
  }
}
