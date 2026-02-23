package algo.repository;

import algo.module.AppUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** JPA Repo for {@link AppUser}. Handles database operations. */
@Repository
public interface UserRepository extends JpaRepository<AppUser, Long> {

  /**
   * Finds a user by email.
   *
   * @param email target email
   * @return {@link Optional} with user
   */
  Optional<AppUser> findByEmail(String email);

  /**
   * Finds a user by username.
   *
   * @param username target login
   * @return {@link Optional} with user
   */
  Optional<AppUser> findByUsername(String username);
}
