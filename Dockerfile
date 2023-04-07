FROM node:latest

WORKDIR /usr/gpt_discord_bot

COPY package*.json ./

RUN npm install

COPY . /usr/gpt_discord_bot/

CMD ["npm", "start"]

