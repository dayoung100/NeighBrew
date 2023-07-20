FROM adoptopenjdk/openjdk11

COPY ./build/libs/backend-0.0.1-SNAPSHOT.jar backend-0.0.1-SNAPSHOT.jar

EXPOSE 80

ENTRYPOINT [ "java" ,"-jar", "backend-0.0.1-SNAPSHOT.jar"]