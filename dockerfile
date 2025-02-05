# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Definir ARGs para las variables de entorno
ARG VITE_API_LOGIN=http://44.211.200.133:3010/api/auth/login
ARG VITE_API_LOGOUT=http://44.202.93.0:3011/logout
ARG VITE_API_FORGOT_PASSWORD=http://3.95.189.218:3012/email/check-email
ARG VITE_API_RESET_PASSWORD=http://3.95.189.218:3013/api/password-reset
ARG VITE_API_REGISTER=http://54.165.7.197:3020/api/users
ARG VITE_API_DELETE_PROFILE=http://54.145.166.17:3021/users
ARG VITE_API_UPDATE_PROFILE=http://44.204.167.222:3022/users
ARG VITE_API_FETCH_PROFILE=http://3.88.178.194:3023/api/users
ARG VITE_API_CHATBOT=http://18.212.39.23:3030/api/chat
ARG VITE_API_MAPGENERATOR=http://34.238.53.174:3031/map

# Convertir ARGs a ENVs para que estén disponibles durante el build
ENV VITE_API_LOGIN=${VITE_API_LOGIN}
ENV VITE_API_LOGOUT=${VITE_API_LOGOUT}
ENV VITE_API_FORGOT_PASSWORD=${VITE_API_FORGOT_PASSWORD}
ENV VITE_API_RESET_PASSWORD=${VITE_API_RESET_PASSWORD}
ENV VITE_API_REGISTER=${VITE_API_REGISTER}
ENV VITE_API_DELETE_PROFILE=${VITE_API_DELETE_PROFILE}
ENV VITE_API_UPDATE_PROFILE=${VITE_API_UPDATE_PROFILE}
ENV VITE_API_FETCH_PROFILE=${VITE_API_FETCH_PROFILE}
ENV VITE_API_CHATBOT=${VITE_API_CHATBOT}
ENV VITE_API_MAPGENERATOR=${VITE_API_MAPGENERATOR}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage - Corregido con origen y destino
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
