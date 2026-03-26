package algo.services.exceptions;

/** Thrown when project does not exist. */
public final class ProjectNotFoundException extends RuntimeException {

  /** Missing project id. */
  private final Long projectId;

  /**
   * Creates exception for a missing project.
   *
   * @param pId project identifier
   */
  public ProjectNotFoundException(final Long pId) {
    super("Project not found: " + pId);
    this.projectId = pId;
  }

  /**
   * @return missing project id
   */
  public Long getProjectId() {
    return projectId;
  }
}

