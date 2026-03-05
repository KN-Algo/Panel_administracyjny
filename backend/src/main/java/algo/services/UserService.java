package algo.services;

import algo.repository.UserRepository;
import java.util.regex.Pattern;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/** Service for user operations. Handles registration and auth. */
@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

  /** Regex part 1 - local and @. */
  private static final String MAIL_PT1 = "^[A-Za-z0-9+_.-]+@";

  /** Regex part 2 - domain body. */
  private static final String MAIL_PT2 = "[A-Za-z0-9.-]+";

  /** Regex part 3 - domain extension. */
  private static final String MAIL_PT3 = "\\.[A-Za-z]{2,64}$";

  /** Full email regex pattern. */
  private static final String MAIL_REGEX = MAIL_PT1 + MAIL_PT2 + MAIL_PT3;

  /** Compiled email regex. */
  private static final Pattern MAIL_PAT = Pattern.compile(MAIL_REGEX);

  /** User repository. */
  private final UserRepository userRepository;

  @Override
  public final UserDetails loadUserByUsername(final String username)
      throws UsernameNotFoundException {
    return userRepository
        .findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }
}
