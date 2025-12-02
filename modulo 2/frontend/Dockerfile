# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Install gettext for envsubst and curl for health check
RUN apk add --no-cache gettext curl

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

EXPOSE 80

CMD ["/bin/sh", "-c", "echo 'Waiting for backend...'; until curl -s -I http://${BACKEND_HOST} > /dev/null; do echo 'Backend not ready, sleeping...'; sleep 5; done; echo 'Backend ready!'; envsubst '${BACKEND_HOST} ${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
