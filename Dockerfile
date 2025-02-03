FROM node:20-alpine

# Install bash
RUN apk add --no-cache bash

# Set the working directory in the container
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4000

ENV NODE_ENV=production


CMD ["bash", "-c", "npm run db:migrate && npm run db:seed:production && npm start"]
