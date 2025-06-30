# Backend build
FROM node:18-alpine as backend

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/. .
EXPOSE 5000
CMD ["npm", "start"]
