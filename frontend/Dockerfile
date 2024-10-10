#Dockerfile for React 
FROM node:22 AS build

WORKDIR /app
COPY ./frontend/package.json ./
COPY ./frontend/yarn.lock ./
RUN yarn install
COPY ./frontend ./
RUN yarn build 


FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx","-g","daemon off;"]