package algo.repository;

import algo.module.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TempAnnouncementRepo extends JpaRepository<TempAnnouncementRepo, Long> {
}
