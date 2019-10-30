FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/index.html
RUN rm -rf /usr/share/nginx/html/50x.html

ENV API_URL="http://localhost:51002"

COPY dist/otus /usr/share/nginx/html/otus
COPY server/nginx.conf /etc/nginx/nginx.conf
COPY server/otus.conf /etc/nginx/conf.d/default.conf

COPY server/entrypoint.sh /usr/local/bin/commands.sh
RUN chmod +x /usr/local/bin/commands.sh

CMD ["/bin/sh", "-c", "/usr/local/bin/commands.sh && nginx -g 'daemon off;'"]

