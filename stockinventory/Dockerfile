FROM maven:3.9.6 as build

WORKDIR /app
COPY ./stockinventory/pom.xml ./
RUN mvn dependency:go-offline

COPY ./stockinventory/src ./src

RUN mvn clean package

FROM openjdk:17.0.2-jdk-slim
VOLUME "/tmp"
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT [ "java","-jar" ,"/app.jar"]