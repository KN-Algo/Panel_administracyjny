package algo.repository;

import algo.module.Project;
import algo.module.ProjectType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

/** Repository for Project entity with basic CRUD operations. */
public interface ProjectRepository extends JpaRepository<Project, Long> {

  /**
   * Loads a project with its translations and images to avoid N+1 queries.
   *
   * @param projectId id of the project
   * @return optional project with initialized relations
   */
  @EntityGraph(attributePaths = {"translations", "images"})
  Optional<Project> findWithTranslationsByProjectId(Long projectId);

  /** Returns all projects with relations ordered by displayOrder then id. */
  @EntityGraph(attributePaths = {"translations", "images"})
  List<Project> findAllByOrderByDisplayOrderAscProjectIdDesc();

  /** Returns all projects for given status with relations ordered by displayOrder then id. */
  @EntityGraph(attributePaths = {"translations", "images"})
  List<Project> findAllByStatusOrderByDisplayOrderAscProjectIdDesc(ProjectType status);
}

