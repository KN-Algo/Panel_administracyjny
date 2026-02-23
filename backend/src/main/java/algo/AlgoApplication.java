package algo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** Initializes the Spring context. */
@SpringBootApplication
public final class AlgoApplication {

    /** Private constructor to prevent instantiation. */
    private AlgoApplication() {
        // Empty constructor
    }

    /**
     * Main method that starts the app.
     *
     * @param args command-line arguments
     */
    public static void main(final String[] args) {

        SpringApplication.run(AlgoApplication.class, args);
    }
}