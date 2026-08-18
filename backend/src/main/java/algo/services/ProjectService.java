package algo.services;

import algo.dto.ProjectRequestDto;
import algo.module.Project;
import algo.module.ProjectType;
import algo.repository.ProjectRepository;
import algo.services.exceptions.ProjectNotFoundException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Service for managing projects. */
@Service
public class ProjectService {

  /** Repository for Project persistence operations. */
  private final ProjectRepository projectRepository;

  private final ProjectMap mapper;

  /**
   * Creates service with required repository dependency.
   *
   * @param repository project repository
   */
  public ProjectService(final ProjectRepository repository, ProjectMap mapper) {
    this.projectRepository = repository;
      this.mapper = mapper;
  }

  /**
   * Persists a project after validation.
   *
   * @param entity project entity to save
   * @return persisted project entity
   */
  @Transactional
  public Project save(final Project entity) {
    return projectRepository.save(entity);
  }

  /**
   * Updates a project by id with incoming DTO data.
   *
   * @param projectId id of project to update
   * @param dto DTO with updated values
   * @return updated and persisted project entity
   */
  @Transactional
  public Project update(final Long projectId, final ProjectRequestDto dto) {
    final Project existing =
            projectRepository
                    .findWithTranslationsByProjectId(projectId)
                    .orElseThrow(() -> new ProjectNotFoundException(projectId));

    mapper.applyToEntity(existing, dto);

    return projectRepository.save(existing);
  }

  /**
   * Returns one project by id (with relations).
   *
   * @param projectId id of project to fetch
   * @return found project entity
   */
  @Transactional(readOnly = true)
  public Project getOne(final Long projectId) {
    return projectRepository
        .findWithTranslationsByProjectId(projectId)
        .orElseThrow(() -> new ProjectNotFoundException(projectId));
  }

  /**
   * Deletes one project by id.
   *
   * @param projectId id of project to delete
   */
  @Transactional
  public void delete(final Long projectId) {
    final Project entity =
        projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException(projectId));
    projectRepository.delete(entity);
  }

  /**
   * Lists projects with optional status filtering.
   *
   * @param status optional status filter
   * @return projects ordered by displayOrder then id
   */
  @Transactional(readOnly = true)
  public List<Project> list(final ProjectType status) {
    if (status == null) {
      return projectRepository.findAllByOrderByDisplayOrderAscProjectIdDesc();
    }
    return projectRepository.findAllByStatusOrderByDisplayOrderAscProjectIdDesc(status);
  }
}
