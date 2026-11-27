# Baut das Quarkus-Backend (./backend) und startet es.
# Erster Build-Schritt: mit Maven kompilieren. Zweiter Schritt: nur die fertige App in ein schlankes Java-Image.
# Java-Version (21) an die Version im pom.xml anpassen.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn -B package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/target/quarkus-app/ ./
EXPOSE 8080
CMD ["java", "-jar", "quarkus-run.jar"]
