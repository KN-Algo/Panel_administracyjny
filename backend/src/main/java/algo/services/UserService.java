package algo.services;

import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import algo.dto.RegisterRequest;
import algo.module.User;
import algo.repository.UserRepository;

import java.util.regex.Pattern;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String PASSWORD_REGEX =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).{8,64}$";

    private static final Pattern PASSWORD_PATTERN =
            Pattern.compile(PASSWORD_REGEX);

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return user;
    }

    public void registerUser(RegisterRequest request) {

    validatePassword(request.getPassword());

    boolean userExists = userRepository.findByEmail(request.getEmail()).isPresent();
        if (userExists) {
        throw new IllegalStateException("Email is already taken.");
    }

    boolean userNameExists = userRepository.findByUsername(request.getUsername()).isPresent();
    if (userNameExists) {
        throw new IllegalStateException("Username is already taken.");
    }

    User user = new User();
        user.setUsername(request.getUsername() != null ? request.getUsername() : request.getEmail());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");
        userRepository.save(user);
    }

    private void validatePassword(String password) {
        if (password == null || !PASSWORD_PATTERN.matcher(password).matches()) {
            throw new IllegalArgumentException(
                    "Password must be 8-64 characters long and include: an uppercase letter, a lowercase letter, a digit, and a special character."
            );
        }
    }
}
