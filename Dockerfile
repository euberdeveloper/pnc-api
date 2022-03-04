FROM node:lts-alpine
WORKDIR /artifact
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run transpile:source

FROM node:lts-alpine
WORKDIR /server
COPY --from=0 /artifact/package*.json /artifact/README.md ./
COPY --from=0 /artifact/dist ./dist
RUN npm ci --only=prod
CMD ["npm", "start"]