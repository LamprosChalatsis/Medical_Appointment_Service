# Στάδιο 1: build τα static αρχεία της React εφαρμογής
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Στάδιο 2: σέρβιρε τα static αρχεία με nginx (production-ready, όχι dev server)
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
