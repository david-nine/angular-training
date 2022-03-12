FROM node:17

COPY . .

WORKDIR /app

VOLUME . /app

RUN npm install

EXPOSE 4200

CMD [ "npm", "start"]