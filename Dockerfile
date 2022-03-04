FROM node:lts-alpine
WORKDIR /artifact
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run transpile

FROM node:lts-alpine
WORKDIR /server
COPY --from=0 /artifact/package*.json /artifact/dist /artifact/README.md ./
RUN npm ci --only=prod
CMD ["npm", "start"]