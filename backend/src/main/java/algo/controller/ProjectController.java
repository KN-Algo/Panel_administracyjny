package algo.controller;

import algo.dto.ProjectResponseDto;
import algo.dto.ProjectRequestDto;
import algo.module.Project;
import algo.module.ProjectType;
import algo.services.ProjectMap;
import algo.services.ProjectService;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Admin REST controller for managing projects (create/update/delete). */
@RestController
@RequestMapping("/api/admin/projects")
public class ProjectController {

  private final ProjectService service;
  private final ProjectMap mapper;

  public ProjectController(final ProjectService pServ, final ProjectMap pMap) {
    this.service = pServ;
    this.mapper = pMap;
  }

  @PostMapping
  public ResponseEntity<ProjectResponseDto> create(
      @Valid @RequestBody final ProjectRequestDto dto) {
    final Project entity = mapper.toEntity(dto);
    final Project saved = service.save(entity);
    return ResponseEntity.ok(mapper.toAdminResponse(saved));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ProjectResponseDto> update(
      @PathVariable("id") final Long projectId, @Valid @RequestBody final ProjectRequestDto dto) {
    final Project merged = mapper.toEntity(dto);
    final Project saved = service.update(projectId, merged);
    return ResponseEntity.ok(mapper.toAdminResponse(saved));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProjectResponseDto> get(@PathVariable("id") final Long projectId) {
    final Project entity = service.getOne(projectId);
    return ResponseEntity.ok(mapper.toAdminResponse(entity));
  }

  @GetMapping
  public ResponseEntity<List<ProjectResponseDto>> list(
      @RequestParam(value = "status", required = false) final ProjectType status) {
    final List<Project> entities = service.list(status);
    final List<ProjectResponseDto> result = new ArrayList<>(entities.size());
    for (final Project p : entities) {
      result.add(mapper.toAdminResponse(p));
    }
    return ResponseEntity.ok(result);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") final Long projectId) {
    service.delete(projectId);
    return ResponseEntity.noContent().build();
  }
}

