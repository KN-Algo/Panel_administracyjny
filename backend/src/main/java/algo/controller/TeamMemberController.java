package algo.controller;

import algo.dto.TeamMemberRequestDto;
import algo.dto.TeamMemberResponseDto;
import algo.module.TeamRole;
import algo.services.TeamMemberService;
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
public class TeamMemberController {

    private final TeamMemberService teamMemberService;

    /**
     * Retrieves all team members.
     * Accessible to everyone (public).
     */
    @GetMapping
    public ResponseEntity<List<TeamMemberResponseDto>> getAllTeamMembers(
            @RequestParam(required = false) final TeamRole role,
            @RequestParam(required = false) final String search) {

        return ResponseEntity.ok(teamMemberService.getAllTeamMembers(role, search));
    }

    /**
     * Retrieves a single team member by their ID.
     * Accessible to everyone (public).
     */
    @GetMapping("/{id}")
    public ResponseEntity<TeamMemberResponseDto> getTeamMemberById(@PathVariable final Long id) {
        return ResponseEntity.ok(teamMemberService.getTeamMemberById(id));
    }

    /**
     * Creates a new team member.
     * Should be restricted to ADMIN role in SecurityConfig.
     */
    @PostMapping
    public ResponseEntity<TeamMemberResponseDto> createTeamMember(@Valid @RequestBody final TeamMemberRequestDto requestDto) {
        return ResponseEntity.ok(teamMemberService.createTeamMember(requestDto));
    }

    /**
     * Updates an existing team member.
     * Should be restricted to ADMIN role in SecurityConfig.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TeamMemberResponseDto> updateTeamMember(
            @PathVariable final Long id,
            @Valid @RequestBody final TeamMemberRequestDto requestDto) {
        return ResponseEntity.ok(teamMemberService.updateTeamMember(id, requestDto));
    }

    /**
     * Deletes a team member by ID.
     * Should be restricted to ADMIN role in SecurityConfig.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeamMember(@PathVariable final Long id) {
        teamMemberService.deleteTeamMember(id);
        return ResponseEntity.noContent().build();
    }
}