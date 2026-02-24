package algo.security;

import algo.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.http.HttpMethod;

/** Main security config class. Handles auth and sessions. */
@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {

  /** Service for loading user data. */
  private final UserService userService;

  /** Config injected via Lombok constructor to save line length. */
  private final AuthenticationConfiguration authConfig;

  /** Config injected via Lombok constructor to save line length. */
  private final ObjectMapper objectMapper;

  /**
   * Configures the main security filter chain.
   *
   * @param http HttpSecurity builder (short name for formatting)
   * @return SecurityFilterChain
   * @throws Exception if an error occurs
   */
  @Bean
  @SuppressWarnings("PMD.SignatureDeclareThrowsException")
  public SecurityFilterChain chain(final HttpSecurity http) throws Exception {

    http.authorizeHttpRequests(
            auth -> {
              auth.requestMatchers("/me").hasAuthority("ROLE_ADMIN");
              auth.anyRequest().authenticated();

              auth.requestMatchers(HttpMethod.GET, "/api/temp-posts/**").permitAll();

              auth.requestMatchers(HttpMethod.POST, "/api/temp-posts/**").hasRole("ADMIN");
              auth.requestMatchers(HttpMethod.PUT, "/api/temp-posts/**").hasRole("ADMIN");
              auth.requestMatchers(HttpMethod.DELETE, "/api/temp-posts/**").hasRole("ADMIN");

              auth.requestMatchers("/me").hasAuthority("ROLE_ADMIN");

              auth.anyRequest().authenticated();

            })
        .csrf(csrf -> csrf.disable())
        .formLogin(
            form -> {
              form.permitAll();
              form.loginProcessingUrl("/login");
              form.successHandler(customSuccessHandler());
              form.failureUrl("/login?error=true");
              form.failureHandler(customFailureHandler());
            })
        .logout(
            logout -> {
              logout.logoutRequestMatcher(getLogoutMatcher());
              logout.logoutSuccessUrl("/login?error=logout");
              logout.invalidateHttpSession(true);
              logout.deleteCookies("JSESSIONID");
            })
        .sessionManagement(
            session -> {
              session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED);
              session.maximumSessions(1);
            })
        .authenticationProvider(daoAuthenticationProvider());

    return http.build();
  }

  /**
   * Generates matcher for logout.
   *
   * @return AntPathRequestMatcher
   */
  private AntPathRequestMatcher getLogoutMatcher() {
    return new AntPathRequestMatcher("/logout", "GET");
  }

  /**
   * Helper method for successful login.
   *
   * @return AuthenticationSuccessHandler
   */
  private AuthenticationSuccessHandler customSuccessHandler() {
    return (request, response, auth) -> {
      response.setStatus(HttpServletResponse.SC_OK);
      response.setContentType("application/json");
      response.setCharacterEncoding("UTF-8");

      final Map<String, String> body = new ConcurrentHashMap<>();
      body.put("message", "Login successful");
      body.put("username", auth.getName());

      final ObjectMapper mapper = new ObjectMapper();
      final String json = mapper.writeValueAsString(body);

      response.getWriter().write(json);
    };
  }

  /**
   * Helper method for failed login.
   *
   * @return AuthenticationFailureHandler
   */
  private AuthenticationFailureHandler customFailureHandler() {
    return (request, response, ex) -> {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType("application/json");
      response.setCharacterEncoding("UTF-8");

      final String msg;
      if (ex instanceof DisabledException) {
        msg = "Account disabled";
      } else if (ex instanceof LockedException) {
        msg = "Account locked";
      } else if (ex instanceof BadCredentialsException) {
        msg = "Invalid credentials";
      } else {
        msg = "Auth failed";
      }

      final Map<String, String> errorBody = Map.of("error", msg);

      objectMapper.writeValue(response.getWriter(), errorBody);
    };
  }

  /**
   * Exposes AuthenticationManager as bean.
   *
   * @return AuthenticationManager
   * @throws Exception if error occurs
   */
  @Bean
  @SuppressWarnings("PMD.SignatureDeclareThrowsException")
  public AuthenticationManager authManager() throws Exception {
    return authConfig.getAuthenticationManager();
  }

  /**
   * Defines the password encoder bean.
   *
   * @return BCryptPasswordEncoder
   */
  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  /**
   * Configures DAO auth provider.
   *
   * @return DaoAuthenticationProvider
   */
  @Bean
  public DaoAuthenticationProvider daoAuthenticationProvider() {
    final DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setPasswordEncoder(passwordEncoder());
    provider.setUserDetailsService(userService);
    return provider;
  }
}
