FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN ./gradlew clean build

CMD ["java", "-jar", "build/libs/project-0.0.1-SNAPSHOT.jar"]