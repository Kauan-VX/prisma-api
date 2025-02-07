FROM node:20

RUN npm install -g @nestjs/cli

WORKDIR /home/node/app