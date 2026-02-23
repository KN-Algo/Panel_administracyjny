package algo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/** DTO for user profile summary. Sent to frontend post-login. */
@Data
@AllArgsConstructor
public class UserSummary {

  /** * Primary email identifier. */
  private String email;

  /** * Display name or username. */
  private String name;
}
