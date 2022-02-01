FROM node:14-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN yarn install
add . .
RUN yarn build
CMD ["node", "./dist/main.js"]
