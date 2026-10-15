package algo.controller;

import algo.dto.UserSummary;
import algo.module.AppUser;
import algo.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Controller handling authentication and user identity endpoints. */
@RestController
@RequiredArgsConstructor
@Tag(name = "Autoryzacja", description = "Endpointy do weryfikacji sesji i pobierania danych aktualnie zalogowanego użytkownika")
public class AuthController {

  /** Service handling user-related operations. */
  private final UserService userService;

  /**
   * Retrieves the currently authenticated user's summary.
   *
   * @param appUser the authenticated user from the security context
   * @return a response containing the user summary
   */
  @Operation(summary = "Pobierz moje dane", description = "Zwraca podsumowanie profilu zalogowanego użytkownika. Endpoint wymaga aktywnej sesji.")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "200", description = "Pomyślnie pobrano dane zalogowanego użytkownika"),
          @ApiResponse(
                  responseCode = "401",
                  description = "Brak autoryzacji",
                  content = @Content
          )
  })
  @GetMapping("/me")
  public ResponseEntity<UserSummary> getCurrentUser(
      @AuthenticationPrincipal final AppUser appUser) {

    final ResponseEntity<UserSummary> response;

    if (appUser == null) {
      response = ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    } else {
      final String email = appUser.getEmail();
      final String name = appUser.getUsername();

      final UserSummary userSummary = new UserSummary(email, name);
      response = ResponseEntity.ok(userSummary);
    }

    return response;
  }
}
