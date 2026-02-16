package stronaKNAlgo.security;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import stronaKNAlgo.services.UserService;

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
    protected SecurityFilterChain webSecurityFilterChain(HttpSecurity http) throws Exception { //zmieniłem, hasAuthority tylko na ROLE_ADMIN - Adam
        http
                .authorizeHttpRequests(customizer ->
                        customizer
                                .requestMatchers("/api/v1/authorized/admin/**").hasAuthority("ROLE_ADMIN") // Only for ADMIN
                                .requestMatchers("/api/v1/authorized/**").hasAuthority("ROLE_ADMIN") // Only for ADMIN
                                .requestMatchers("/room/**").hasAuthority("ROLE_ADMIN")// Only for ADMIN
                                .requestMatchers("/api/v1/**").permitAll() // Only for ADMIN
                                .requestMatchers("/admin", "/admin/**").hasAuthority("ROLE_ADMIN")
                                .requestMatchers("/home", "/home/**").hasAuthority("ROLE_ADMIN")
                                .requestMatchers("/login", "/api/v1/**", "/register", "/activate").permitAll()
                                .requestMatchers("/forgotPassword", "/resetPassword").permitAll()
                                .requestMatchers("/**", "/static/**", "/resources/**").permitAll() // Allow access to static resources
                                .requestMatchers("/styles/**", "/scripts/**", "/img/**", "/fonts/**").permitAll() // Allow access to static resources
                                .requestMatchers("/actuator/health").permitAll() // Allow access to health check
                                .requestMatchers("/styles/**", "/scripts/**", "/img/**", "/fonts/**").permitAll() // Allow access to static resources
                                .anyRequest()
                                .authenticated()
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
                        .successHandler(customAuthenticationSuccessHandler) // Custom success handler
                        .failureUrl("/login?error=true")
                        .failureHandler((_, response, exception) -> {
                            if (exception.getMessage().equals("User is disabled")) {
                                response.sendRedirect("/login?error=disabled");
                            } else {
                                response.sendRedirect("/login?error=true");
                            }
                        })
                )
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout", "GET"))
                        .logoutSuccessUrl("/login?error=logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                )
//                .oauth2Login(oauth2 -> oauth2 // Na razie wyłączone bo nie wiem czy będzie przydatne w tym projekcie - Adam
//                        .loginPage("/login") // Strona logowania
//                        .defaultSuccessUrl("/home", true) // Po zalogowaniu przekierowuje na /home
//                        .userInfoEndpoint(userInfo -> userInfo
//                                .userService(customOAuth2UserService) // Nasz serwis obsługujący użytkowników Discord
//                        )
//                )
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