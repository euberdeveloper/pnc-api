FROM node:lts-alpine
WORKDIR /api-client
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run docs
RUN npm install -g http-server
CMD [ "http-server", "docs/html" ]
