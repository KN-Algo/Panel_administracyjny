package algo.security;


import jakarta.servlet.http.HttpServletResponse;
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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import algo.services.UserService;

import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {

//    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationSuccessHandler customAuthenticationSuccessHandler;
//    private final CustomOAuth2UserService customOAuth2UserService;

    @Bean
    protected SecurityFilterChain webSecurityFilterChain(HttpSecurity http) throws Exception {
        HttpSecurity httpSecurity = http
                .authorizeHttpRequests(customizer -> {
                            customizer
    //                                .requestMatchers("/admin", "/admin/**").hasAuthority("ROLE_ADMIN")
                                    .requestMatchers("/me").hasAuthority("ROLE_ADMIN")
    //                                .requestMatchers("/home", "/home/**").hasAuthority("ROLE_ADMIN")
    //                                .requestMatchers("/login").permitAll()
    //                                .requestMatchers("/forgotPassword", "/resetPassword").permitAll()
    //                                .requestMatchers("/actuator/health").permitAll() // Allow access to health check
                                    .anyRequest()
                                    .authenticated();
                        }
                )
//                .csrf(csrf -> csrf
//                        .ignoringRequestMatchers("/logout") // Wyłączenie CSRF tylko dla logout
//                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
//                )
                .csrf(csrf -> csrf.disable()) // Na czas testów w Postmanie  -Adam
                .formLogin(httpConfig -> httpConfig
//                        .loginPage("/login") Na potrzeby testów w PostMan
                        .permitAll()
                                .loginProcessingUrl("/login")
                                .successHandler((request, response, authentication) -> {
                                    response.setStatus(HttpServletResponse.SC_OK);
                                    response.setContentType("application/json");
                                    response.setCharacterEncoding("UTF-8");

                                    String role = authentication.getAuthorities()
                                            .stream()
                                            .map(GrantedAuthority::getAuthority)
                                            .collect(Collectors.joining(","));

                                    String name = authentication.getName();
                                    String jsonResponse = String.format("{\"message\": \"Login successful\", \"username\": \"%s\", \"roles\": \"%s\"}", name, role);
                                    response.getWriter().write(jsonResponse);
                                })
                                .failureUrl("/login?error=true")
                                .failureHandler((request, response, exception) -> {
                                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                                    response.setContentType("application/json");
                                    response.setCharacterEncoding("UTF-8");

                                    String message;
                                    if (exception instanceof DisabledException) {
                                        message = "Account is disabled";
                                    } else if (exception instanceof LockedException) {
                                        message = "Account is locked";
                                    } else if (exception instanceof BadCredentialsException) {
                                        message = "Invalid credentials";
                                    } else {
                                        message = "Authentication failed";
                                    }

                                    response.getWriter().write("{\"error\": \"" + message + "\"}");
                                })
                )
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout", "GET"))
                        .logoutSuccessUrl("/login?error=logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                        .maximumSessions(1)
                )
                .authenticationProvider(daoAuthenticationProvider());
//                .addFilterAfter(new CsrfTokenGeneratingFilter(), BasicAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(bCryptPasswordEncoder);
        provider.setUserDetailsService(userService);
        return provider;
    }

}