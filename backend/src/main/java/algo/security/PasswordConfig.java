package algo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/** Configuration class responsible for setting up the password encoder bean. */
@Configuration
public class PasswordConfig {

  /** Default constructor. Required by the PMD AtLeastOneConstructor rule. */
  public PasswordConfig() {
    // Empty default constructor
  }

  /**
   * Creates and configures the BCrypt password encoder.
   *
   * @return a new instance of BCryptPasswordEncoder
   */
  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
