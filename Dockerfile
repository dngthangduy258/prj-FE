# Step 1: Build app
FROM node:18 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve bằng Nginx
FROM nginx:alpine

# Copy file build vào Nginx folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy config Nginx nếu cần
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
