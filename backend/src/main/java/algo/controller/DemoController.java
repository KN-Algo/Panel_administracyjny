package algo.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Controller used for demonstration purposes and testing API endpoints. */
@RestController
public class DemoController {

  /** Default constructor. Required by the PMD AtLeastOneConstructor rule. */
  public DemoController() {
    // Replace @NoArgsConstructor special for PMD
  }

  /**
   * Secured endpoint returns the current user's authentication details.
   *
   * @return a welcome message containing login and roles
   */
  @GetMapping("/home")
  public String home() {

    final SecurityContext context = SecurityContextHolder.getContext();
    final Authentication auth = context.getAuthentication();

    return "Welcome! \n"
        + "Your login: "
        + auth.getName()
        + "\n"
        + "Your role: "
        + auth.getAuthorities();
  }

  /**
   * Root endpoint of the application.
   *
   * @return a simple hello world string
   */
  @GetMapping("/")
  public String test() {
    return "Hello World";
  }
}
