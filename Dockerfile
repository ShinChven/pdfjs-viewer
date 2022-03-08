FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY ["html","/usr/share/nginx/html"]
