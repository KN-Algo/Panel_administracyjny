package algo.services;


import algo.module.TempAnnouncementModule;
import algo.repository.TempAnnouncementRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;


/** Service for managing temporary announcements. */
@Service
@RequiredArgsConstructor
public class TempAnnouncementService {

    private final TempAnnouncementRepo repo;

    /** Returns currently active announcement if exists. */
    @Transactional
    public TempAnnouncementModule getActiveNow() {
        final long now = Instant.now().toEpochMilli();
        return repo.findActiveNow(now).orElse(null);
    }
}
