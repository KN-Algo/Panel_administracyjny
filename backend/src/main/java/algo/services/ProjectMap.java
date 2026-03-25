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
import org.springframework.stereotype.Component;

/** Maps project DTOs to and from the Project entity. */
@Component
public class ProjectMap {

  /** Default no-arg constructor required by Spring for dependency injection. */
  public ProjectMap() {
    // Intentionally empty constructor required by Spring DI
  }

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

    final Map<String, Long> existingIdsByLang = new HashMap<>();
    if (target.getTranslations() != null) {
      for (final ProjectTranslation existingTranslation : target.getTranslations()) {
        existingIdsByLang.put(existingTranslation.getLanguageCode(), existingTranslation.getId());
      }
    }

    target.clearTranslations();
    if (dto.translations() != null) {
      for (final ProjectTranslationDto translationDto : dto.translations()) {
        final ProjectTranslation translation = new ProjectTranslation();
        if (translationDto.translationId() != null) {
          translation.setId(translationDto.translationId());
        } else if (existingIdsByLang.containsKey(translationDto.languageCode())) {
          translation.setId(existingIdsByLang.get(translationDto.languageCode()));
        }
        translation.setLanguageCode(translationDto.languageCode());
        translation.setTitle(translationDto.title());
        translation.setDescription(translationDto.description());
        target.addTranslation(translation);
      }
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
