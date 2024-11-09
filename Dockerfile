
FROM node:18-alpine AS build

WORKDIR /src

COPY package*.json ./

COPY .env ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "8080"]

EXPOSE 8080
