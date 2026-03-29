package algo.security;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

public class HtmlSanitizer {

    private static final Safelist SAFELIST = Safelist.relaxed()
            .addAttributes("p", "style", "class")
            .addAttributes("span", "style", "class")
            .addEnforcedAttribute("a", "target", "_blank")
            .addEnforcedAttribute("a", "rel", "noopener noreferrer")
            .addProtocols("a", "href", "http", "https", "mailto");

    public static String sanitize(String untrustedHtml) {
        if (untrustedHtml == null || untrustedHtml.isBlank()) {
            return untrustedHtml;
        }
        return Jsoup.clean(untrustedHtml, SAFELIST);
    }
}