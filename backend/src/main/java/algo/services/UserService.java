package algo.services;

import algo.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/** Service for user operations. Handles registration and auth. */
@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

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
