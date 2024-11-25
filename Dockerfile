FROM node:18

LABEL app="Nestjs_TypeORM"

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .
RUN npm install

RUN npm run build

CMD ["npm", "run", "start:prod"]