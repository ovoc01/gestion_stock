FROM maven:3.8.6-openjdk-11 as build

WORKDIR /app
COPY ./backend/pom.xml ./
COPY ./backend/src ./src
RUN mvn clean package

FROM openjdk:17-jdk-slim
VOLUME "/tmp"
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT [ "java","-jar" ,"/app.jar"]