package algo.controller;

import algo.config.SwaggerExamples;
import algo.dto.ProjectResponseDto;
import algo.dto.ProjectRequestDto;
import algo.module.Project;
import algo.module.ProjectType;
import algo.services.ProjectMap;
import algo.services.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@RequestMapping("/api/projects")
@Tag(name = "Zarządzanie Projektami", description = "Endpointy do zarządzania portfolio projektów koła naukowego")
public class ProjectController {

  private final ProjectService service;
  private final ProjectMap mapper;

  public ProjectController(final ProjectService pServ, final ProjectMap pMap) {
    this.service = pServ;
    this.mapper = pMap;
  }

  @Operation(summary = "Utwórz nowy projekt", description = "Tworzy nowy projekt w bazie danych. Endpoint wymaga zalogowania.")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "200", description = "Pomyślnie utworzono nowy projekt"),
          @ApiResponse(
                  responseCode = "400",
                  description = "Błąd walidacji przesłanych danych (np. zła ilość tłumaczeń)",
                  content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.PROJECT_400))
          )
  })
  @PostMapping
  public ResponseEntity<ProjectResponseDto> create(
          @Parameter(description = "Kompletny obiekt zawierający dane nowego projektu")
          @Valid @RequestBody final ProjectRequestDto dto) {
    final Project entity = mapper.toEntity(dto);
    final Project saved = service.save(entity);
    return ResponseEntity.ok(mapper.toAdminResponse(saved));
  }

  @Operation(summary = "Aktualizuj dane projektu", description = "Nadpisuje dane istniejącego projektu. Endpoint wymaga zalogowania.")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "200", description = "Pomyślnie zaktualizowano dane projektu"),
          @ApiResponse(
                  responseCode = "400",
                  description = "Błąd walidacji przesłanych danych",
                  content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.PROJECT_400))
          ),
          @ApiResponse(
                  responseCode = "404",
                  description = "Nie znaleziono projektu o podanym identyfikatorze",
                  content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.PROJECT_404))
          )
  })
  @PutMapping("/{id}")
  public ResponseEntity<ProjectResponseDto> update(
          @Parameter(description = "ID projektu do zaktualizowania", example = "42")
          @PathVariable("id") final Long projectId,

          @Parameter(description = "Obiekt z nowymi danymi projektu")
          @Valid @RequestBody final ProjectRequestDto dto) {
    final Project saved = service.update(projectId, dto);
    return ResponseEntity.ok(mapper.toAdminResponse(saved));
  }

  @Operation(summary = "Pobierz projekt po ID", description = "Zwraca szczegółowe dane konkretnego projektu na podstawie jego unikalnego identyfikatora ID.")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "200", description = "Pomyślnie znaleziono i zwrócono dane projektu"),
          @ApiResponse(
                  responseCode = "404",
                  description = "Nie znaleziono projektu o podanym identyfikatorze",
                  content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.PROJECT_404))
          )
  })
  @GetMapping("/{id}")
  public ResponseEntity<ProjectResponseDto> get(
          @Parameter(description = "Unikalny identyfikator projektu", example = "42")
          @PathVariable("id") final Long projectId) {
    final Project entity = service.getOne(projectId);
    return ResponseEntity.ok(mapper.toAdminResponse(entity));
  }

  @Operation(summary = "Pobierz wszystkie projekty", description = "Zwraca pełną listę projektów, opcjonalnie z możliwością filtrowania.")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "200", description = "Lista projektów pobrana pomyślnie")
  })
  @GetMapping
  public ResponseEntity<List<ProjectResponseDto>> list(
          @Parameter(description = "Filtrowanie po statusie projektu (np. COMPLETED, IN_PROGRESS)", example = "COMPLETED")
          @RequestParam(value = "status", required = false) final ProjectType status) {
    final List<Project> entities = service.list(status);
    final List<ProjectResponseDto> result = new ArrayList<>(entities.size());
    for (final Project p : entities) {
      result.add(mapper.toAdminResponse(p));
    }
    return ResponseEntity.ok(result);
  }

  @Operation(summary = "Usuń projekt", description = "Trwale usuwa projekt wraz z przypisanymi obrazkami i tłumaczeniami. Endpoint wymaga zalogowania.")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "204", description = "Pomyślnie usunięto projekt"),
          @ApiResponse(
                  responseCode = "404",
                  description = "Nie znaleziono projektu o podanym identyfikatorze",
                  content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.PROJECT_404))
          )
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(
          @Parameter(description = "ID projektu, który ma zostać usunięty", example = "42")
          @PathVariable("id") final Long projectId) {
    service.delete(projectId);
    return ResponseEntity.noContent().build();
  }
}
