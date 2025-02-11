# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Definir ARGs para las variables de entorno
ARG VITE_API_LOGIN
ARG VITE_API_LOGOUT
ARG VITE_API_FORGOT_PASSWORD
ARG VITE_API_RESET_PASSWORD
ARG VITE_API_REGISTER
ARG VITE_API_DELETE_PROFILE
ARG VITE_API_UPDATE_PROFILE
ARG VITE_API_FETCH_PROFILE
ARG VITE_API_CHATBOT
ARG VITE_API_MAPGENERATOR
ARG VITE_API_GET_PRODUCTS
ARG VITE_API_GET_CATEGORY
ARG VITE_API_GET_USER

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
ENV VITE_API_GET_PRODUCTS=${VITE_API_GET_PRODUCTS}
ENV VITE_API_GET_CATEGORY=${VITE_API_GET_CATEGORY}
ENV VITE_API_GET_USER=${VITE_API_GET_USER}

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
