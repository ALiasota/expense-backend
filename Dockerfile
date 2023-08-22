FROM --platform=linux/amd64 node:18

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

CMD [ "yarn", "start" ]