#Dockerfile for React 
FROM node:22 AS build

WORKDIR /app
COPY ./frontend/package*.json ./
RUN  yarn install
COPY ./frontend ./
RUN yarn dev


EXPOSE 3000

CMD [ "yarn","dev"]