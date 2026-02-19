package algo.controller;

import algo.dto.UserSummary;
import algo.module.AppUser;
import algo.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Controller handling authentication and user identity endpoints. */
@RestController
@RequiredArgsConstructor
public class AuthController {

  /** Service handling user-related operations. */
  private final UserService userService;

  /**
   * Retrieves the currently authenticated user's summary.
   *
   * @param appUser the authenticated user from the security context
   * @return a response containing the user summary
   */
  @GetMapping("/me")
  public ResponseEntity<UserSummary> getCurrentUser(
      @AuthenticationPrincipal final AppUser appUser) {

    final ResponseEntity<UserSummary> response;

    if (appUser == null) {
      response = ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    } else {
      final String email = appUser.getEmail();
      final String name = appUser.getUsername();
      final String role = appUser.getRole();

      final UserSummary userSummary = new UserSummary(email, name, role);
      response = ResponseEntity.ok(userSummary);
    }

    return response;
  }
}
