package algo.services;

import algo.dto.RegisterRequest;
import algo.module.AppUser;
import algo.repository.UserRepository;
import java.util.regex.Pattern;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/** Service for user operations. Handles registration and auth. */
@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

  /** Regex part 1 - letters and digits. */
  private static final String REGEX1 = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)";

  /** Regex part 2 - special chars and length. */
  private static final String REGEX2 = "(?=.*[^\\da-zA-Z]).{8,64}$";

  /** Compiled regex. */
  private static final Pattern PATTERN = Pattern.compile(REGEX1 + REGEX2);

  /** Password error message. */
  private static final String PWD_ERR =
      "Password must be 8-64 chars with lower, upper, digit, special.";

  /** User repository. */
  private final UserRepository userRepository;

  /** Password encoder. */
  private final PasswordEncoder passwordEncoder;

  @Override
  public final UserDetails loadUserByUsername(final String username)
      throws UsernameNotFoundException {
    return userRepository
        .findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }

  /**
   * Registers a new user.
   *
   * @param req user details
   * @throws IllegalStateException if taken
   * @throws IllegalArgumentException if weak pwd
   */
  public final void registerUser(final RegisterRequest req) {

    final String rawPwd = req.getPassword();
    validatePassword(rawPwd);

    final String email = req.getEmail();
    final boolean emailExists = userRepository.findByEmail(email).isPresent();
    if (emailExists) {
      throw new IllegalStateException("Email taken");
    }

    final String name = req.getUsername();
    final boolean nameExists = userRepository.findByUsername(name).isPresent();
    if (nameExists) {
      throw new IllegalStateException("Username taken");
    }

    final AppUser user = new AppUser();
    user.setUsername(name != null ? name : email);
    user.setEmail(email);
    user.setPassword(passwordEncoder.encode(rawPwd));
    user.setRole("ROLE_USER");

    userRepository.save(user);
  }

  /**
   * Validates password strength.
   *
   * @param pwd raw password
   */
  private void validatePassword(final String pwd) {
    if (pwd == null || !PATTERN.matcher(pwd).matches()) {
      throw new IllegalArgumentException(PWD_ERR);
    }
  }
}
