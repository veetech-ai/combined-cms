FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production


CMD ["bash", "-c", "npm run db:migrate:deploy && npm run db:seed:production && npm start"]
