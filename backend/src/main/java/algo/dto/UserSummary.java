package algo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

/** DTO for user profile summary. Sent to frontend post-login. */
@Data
@AllArgsConstructor
@Schema(description = "Podstawowe dane zalogowanego użytkownika", example = """
        {
          "email": "adamKruszczynski@pwr.edu.pl",
          "name": "Adam Kruszczyński"
        }
        """)
public class UserSummary {

  /** * Primary email identifier. */
  private String email;

  /** * Display name or username. */
  private String name;
}
