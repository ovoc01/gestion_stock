FROM openjdk:17-jdk-slim
VOLUME /tmp
RUN mvn clean compile
COPY ./backend/target/*.jar app.jar
ENTRYPOINT [ "java","-jar","/app.jar" ]