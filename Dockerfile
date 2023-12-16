FROM node:20.10

COPY src src

WORKDIR /src

RUN npm run build

CMD npm start