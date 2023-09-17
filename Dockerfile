FROM node:18
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# RUN yarn install
# If you are building your code for production
RUN yarn install --frozen-lockfile --production
# Bundle app source
COPY . .
EXPOSE 3000
CMD [ "node", "index.js" ]