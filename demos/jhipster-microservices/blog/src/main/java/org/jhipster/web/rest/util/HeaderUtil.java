package org.jhipster.web.rest.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;

/**
 * Utility class for HTTP headers creation.
 */
public final class HeaderUtil {

    private static final Logger log = LoggerFactory.getLogger(HeaderUtil.class);

    private HeaderUtil() {
    }

    public static HttpHeaders createAlert(String message, String param) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-blogApp-alert", message);
        headers.add("X-blogApp-params", param);
        return headers;
    }

    public static HttpHeaders createEntityCreationAlert(String entityName, String param) {
        return createAlert("blogApp." + entityName + ".created", param);
    }

    public static HttpHeaders createEntityUpdateAlert(String entityName, String param) {
        return createAlert("blogApp." + entityName + ".updated", param);
    }

    public static HttpHeaders createEntityDeletionAlert(String entityName, String param) {
        return createAlert("blogApp." + entityName + ".deleted", param);
    }

    public static HttpHeaders createFailureAlert(String entityName, String errorKey, String defaultMessage) {
        log.error("Entity creation failed, {}", defaultMessage);
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-blogApp-error", "error." + errorKey);
        headers.add("X-blogApp-params", entityName);
        return headers;
    }
}
