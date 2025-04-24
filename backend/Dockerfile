FROM node:23-alpine

RUN apk add --no-cache netcat-openbsd dos2unix

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD ["sh", "./docker-entrypoint.sh"] 