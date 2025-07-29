# Chatter

A real-time chat application with WebSockets and REST integrations.

## 🧪 Getting started

### 1. Initialize the postgres database:

```
docker compose up -d
```

### 2. Run the API:

```
cd api
mvn clean package -DskipTests
mvn spring-boot:run
```

The API will be available at http://localhost:8080.

You can access the API documentation and test endpoints via Swagger UI:
http://localhost:8080/swagger-ui/index.html#/

### 3. Run the UI:

```
cd ui
npm i
npm run dev
```

The development UI server runs at http://localhost:5173/.
