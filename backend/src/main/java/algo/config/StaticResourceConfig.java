package algo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class for serving static resources from the local file
 * system. Maps external URL requests to the physical directory where
 * uploaded files are safely stored.
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    /**
     * The physical directory path where uploaded files are stored.
     * Injected directly from the application properties.
     */
    @Value("${app.upload.dir}")
    private String uploadDir;

    /**
     * Registers resource handlers to serve static files.
     * Ensures the directory path is properly formatted with a "file:"
     * prefix and a trailing slash for Spring's internal resource loader.
     *
     * @param registry the resource handler registry to configure.
     */
    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {

        String resourceLocation = uploadDir.startsWith("file:")
                ? uploadDir
                : "file:" + uploadDir;

        if (!resourceLocation.endsWith("/")
                && !resourceLocation.endsWith("\\")) {
            resourceLocation += "/";
        }

        registry.addResourceHandler("/img/**")
                .addResourceLocations(resourceLocation);
    }
}