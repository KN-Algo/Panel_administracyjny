package algo.module;

import static jakarta.persistence.GenerationType.IDENTITY;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Collection;
import java.util.Collections;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/** DB Entity for application user. Implements Security UserDetails. */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppUser implements UserDetails {

  /** DB unique identifier. */
  @Id
  @GeneratedValue(strategy = IDENTITY)
  private Long userId;

  /** Email address login. */
  @Column(unique = true, nullable = false)
  private String email;

  /** Encrypted password. */
  @Column(nullable = false)
  private String password;

  /** Display username. */
  @Column(unique = true, nullable = false)
  private String username;

  /** User authorization role. */
  private String role;

  @Override
  public final Collection<? extends GrantedAuthority> getAuthorities() {
    final SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);
    return Collections.singletonList(authority);
  }

  @Override
  public final boolean isAccountNonExpired() {
    return UserDetails.super.isAccountNonExpired();
  }

  @Override
  public final boolean isAccountNonLocked() {
    return UserDetails.super.isAccountNonLocked();
  }

  @Override
  public final boolean isCredentialsNonExpired() {
    return UserDetails.super.isCredentialsNonExpired();
  }

  @Override
  public final boolean isEnabled() {
    return UserDetails.super.isEnabled();
  }
}
