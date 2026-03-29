package algo.security;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

/** Utility class for sanitizing HTML content. Prevents XSS attacks using Jsoup safelist. */
public final class HtmlSanitizer {

  /** Safelist configuration defining allowed HTML elements. */
  private static final Safelist SAFELIST =
      Safelist.relaxed()
          .addAttributes("p", "style", "class")
          .addAttributes("span", "style", "class")
          .addEnforcedAttribute("a", "target", "_blank")
          .addEnforcedAttribute("a", "rel", "noopener noreferrer")
          .addProtocols("a", "href", "http", "https", "mailto")
          .removeTags("img");

  /** Prevents instantiation of this utility class. */
  private HtmlSanitizer() {
    throw new UnsupportedOperationException("Utility class cannot be instantiated");
  }

  /**
   * Sanitizes the given HTML string by removing non-whitelisted tags.
   *
   * @param untrustedHtml the raw HTML string containing malicious code
   * @return the sanitized HTML string, or the original string if it is null or blank
   */
  public static String sanitize(final String untrustedHtml) {
    final String result;

    if (untrustedHtml == null || untrustedHtml.isBlank()) {
      result = untrustedHtml;
    } else {
      result = Jsoup.clean(untrustedHtml, SAFELIST);
    }

    return result;
  }
}
