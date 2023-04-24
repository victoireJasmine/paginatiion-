FROM node:17-alpine3.12

WORKDIR /usr/src/app



COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV PORT 8080

EXPOSE 8080

CMD ["npm", "run", "start", "api"]


