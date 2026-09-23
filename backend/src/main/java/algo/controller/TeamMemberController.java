package algo.controller;

import algo.config.SwaggerExamples;
import algo.dto.TeamMemberRequestDto;
import algo.dto.TeamMemberResponseDto;
import algo.module.TeamRole;
import algo.services.TeamMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing team members in the "Team" tab.
 */
@RestController
@RequestMapping("/api/team-members")
@RequiredArgsConstructor
@Tag(name = "Zarządzanie Zespołem", description = "Endpointy do obsługi wizytówek członków koła naukowego")
public class TeamMemberController {

    private final TeamMemberService teamMemberService;

    /**
     * Retrieves all team members.
     * Accessible to everyone (public).
     */
    @Operation(summary = "Pobierz wszystkich członków", description = "Zwraca pełną listę członków zespołu. Pozwala na opcjonalne filtrowanie po roli oraz wyszukiwanie tekstowe po imieniu i nazwisku.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pomyślnie znaleziono i zwrócono dane członka zespołu"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Nie znaleziono członka o podanym identyfikatorze",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.TEAM_MEMBER_404))
            )
    })
    @GetMapping
    public ResponseEntity<List<TeamMemberResponseDto>> getAllTeamMembers(
            @Parameter(description = "Filtrowanie po roli (np. BOARD, MEMBER)", example = "BOARD")
            @RequestParam(value = "role", required = false) final TeamRole role,

            @Parameter(description = "Wyszukiwanie po fragmencie imienia lub nazwiska", example = "Kowalski")
            @RequestParam(value = "search", required = false) final String search) {
        return ResponseEntity.ok(teamMemberService.getAllTeamMembers(role, search));
    }

    /**
     * Retrieves a single team member by their ID.
     * Accessible to everyone (public).
     */
    @Operation(summary = "Pobierz członka po ID", description = "Zwraca szczegółowe dane konkretnego członka na podstawie jego unikalnego identyfikatora ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pomyślnie znaleziono i zwrócono dane członka zespołu"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Nie znaleziono członka o podanym identyfikatorze",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.TEAM_MEMBER_404))
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<TeamMemberResponseDto> getTeamMemberById(
            @Parameter(description = "Unikalny identyfikator członka zespołu", example = "14")
            @PathVariable("id") final Long id) {
        return ResponseEntity.ok(teamMemberService.getTeamMemberById(id));
    }

    /**
     * Creates a new team member.
     * Should be restricted to ADMIN role in SecurityConfig.
     */
    @Operation(summary = "Dodaj nowego członka", description = "Tworzy nową wizytówkę członka zespołu na podstawie przesłanych danych w formacie JSON. Endpoint wymaga zalogowania.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pomyślnie utworzono nowego członka zespołu"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Błąd walidacji przesłanych danych (np. brakujące pola, zła ilość tłumaczeń)",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.TEAM_MEMBER_400))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Nie znaleziono członka o podanym identyfikatorze",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.TEAM_MEMBER_404))
            )
    })
    @PostMapping
    public ResponseEntity<TeamMemberResponseDto> createTeamMember(
            @Parameter(description = "Kompletny obiekt zawierający dane nowego członka zespołu")
            @Valid @RequestBody final TeamMemberRequestDto requestDto) {
        return ResponseEntity.ok(teamMemberService.createTeamMember(requestDto));
    }

    /**
     * Updates an existing team member.
     * Should be restricted to ADMIN role in SecurityConfig.
     */
    @Operation(summary = "Aktualizuj dane członka", description = "Całkowicie nadpisuje dane istniejącego członka zespołu. Endpoint wymaga zalogowania.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pomyślnie zaktualizowano dane członka"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Błąd walidacji przesłanych danych",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.TEAM_MEMBER_400))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Nie znaleziono członka o podanym identyfikatorze",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.TEAM_MEMBER_404))
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<TeamMemberResponseDto> updateTeamMember(
            @Parameter(description = "ID członka zespołu do zaktualizowania", example = "14")
            @PathVariable("id") final Long id,

            @Parameter(description = "Obiekt z nowymi danymi członka zespołu")
            @Valid @RequestBody final TeamMemberRequestDto requestDto) {
        return ResponseEntity.ok(teamMemberService.updateTeamMember(id, requestDto));
    }

    /**
     * Deletes a team member by ID.
     * Should be restricted to ADMIN role in SecurityConfig.
     */
    @Operation(summary = "Usuń członka zespołu", description = "Trwale usuwa rekord członka zespołu z bazy danych. Endpoint wymaga zalogowania.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Pomyślnie usunięto rekord (brak zawartości do zwrócenia)"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Nie znaleziono członka o podanym identyfikatorze",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = SwaggerExamples.TEAM_MEMBER_404))
            )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeamMember(
            @Parameter(description = "ID członka zespołu, który ma zostać usunięty", example = "14")
            @PathVariable("id") final Long id) {
        teamMemberService.deleteTeamMember(id);
        return ResponseEntity.noContent().build();
    }
}