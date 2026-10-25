# Apache + PHP module, with the proxy modules needed to expose
# phpMyAdmin under /phpMyAdmin/ on the same port as the app.
FROM php:8.5-apache

RUN a2enmod proxy proxy_http rewrite \
    && docker-php-ext-install pdo_mysql

COPY apache/phpmyadmin-proxy.conf /etc/apache2/conf-enabled/phpmyadmin-proxy.conf
COPY apache/logging.conf /etc/apache2/conf-enabled/logging.conf
COPY apache/htaccess.conf /etc/apache2/conf-enabled/htaccess.conf

# php:*-apache does NOT wire Apache's logs to the container's stdout/stderr.
# Redirect them so that error_log() calls are visible in `docker compose up`.
RUN ln -sf /dev/stderr /var/log/apache2/error.log \
    && ln -sf /dev/stdout /var/log/apache2/access.log
