FROM node:19.4.0
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3018
CMD ["yarn","dev"]