package algo.dto;

import lombok.Data;

/** DTO for user registration. Contains sign-up data. */
@Data
public class RegisterRequest {

  /** * Chosen username. */
  private String username;

  /** * User's email address. Used as login ID. */
  private String email;

  /** * Raw password string. Must be validated. */
  private String password;
}
