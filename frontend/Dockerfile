# Step 1: Build React (Vite) app
FROM node:18-alpine AS build
WORKDIR /app

ARG api_base_url
ENV VITE_API_BASE_URL=$api_base_url

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
