package algo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class for serving static resources. Maps external URLs to the physical upload
 * directory.
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

  /** The physical directory path where uploaded files are stored. */
  private final String uploadDir;

  /**
   * Constructs the configuration with the required upload directory.
   *
   * @param uploadDir the physical path injected from properties.
   */
  public StaticResourceConfig(@Value("${app.upload.dir}") final String uploadDir) {
    this.uploadDir = uploadDir;
  }

  /**
   * Registers resource handlers to serve static files. Ensures the path has a "file:" prefix and
   * trailing slash.
   *
   * @param registry the resource handler registry to configure.
   */
  @Override
  public void addResourceHandlers(final ResourceHandlerRegistry registry) {

    final String prefix = uploadDir.startsWith("file:") ? "" : "file:";

    final String suffix = uploadDir.endsWith("/") || uploadDir.endsWith("\\") ? "" : "/";

    final String resourceLocation = prefix + uploadDir + suffix;

    registry.addResourceHandler("/img/**").addResourceLocations(resourceLocation);
  }
}
