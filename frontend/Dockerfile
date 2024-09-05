#Dockerfile for React 
FROM node:22 AS build

WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install -g yarn
RUN yarn
COPY ./frontend ./
RUN yarn run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx","-g","daemon off;" ]