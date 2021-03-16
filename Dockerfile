FROM node:15

ARG NODE_ENV

# Create app directory
WORKDIR /usr/app

COPY package*.json ./

RUN if [ "$NODE_ENV" = "dev" ]; then  npm install ; else npm ci --only=production ; fi

COPY src src

EXPOSE 3000
CMD [ "node", "src/index.js" ]
