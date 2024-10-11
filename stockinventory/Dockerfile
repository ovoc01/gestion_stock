FROM maven:3.9.6 AS build

WORKDIR /app
COPY ./stockinventory/pom.xml ./
RUN mvn dependency:go-offline

COPY ./stockinventory/src ./src

ARG SPRING_PROFILES_ACTIVE
# This sets the environment variable for the build stage only
RUN mvn clean package -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}

FROM openjdk:17.0.2-jdk-slim

# Set the environment variable for the runtime stage
ARG SPRING_PROFILES_ACTIVE
ENV SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE}

VOLUME "/tmp"
COPY --from=build /app/target/*.jar app.jar

# Use CMD instead of ENTRYPOINT
CMD ["java", "-jar", "/app.jar", "--spring.profiles.active=${SPRING_PROFILES_ACTIVE}"]
