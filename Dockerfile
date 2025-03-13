# Build phase
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serve phase
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config nếu cần custom route
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
