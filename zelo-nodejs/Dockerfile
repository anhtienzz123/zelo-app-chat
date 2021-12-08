FROM node:latest

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3001

CMD [ "node", "src/index.js" ]