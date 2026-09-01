# personal-website-handler

Spring Boot API for handling personal website contact form submissions.

## Requirements

- Java 21
- Maven Wrapper (`./mvnw`) — no system Maven install required

## Development

Install dependencies and run tests:

```bash
./.cursor/scripts/cloud-agent-install.sh
```

Start the API server:

```bash
./mvnw spring-boot:run
```

The server listens on `http://localhost:8080`.

## API

### Health check

```bash
curl http://localhost:8080/actuator/health
```

### Submit a contact message

```bash
curl -X POST http://localhost:8080/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","message":"Hello from the website handler"}'
```

### List submitted messages

```bash
curl http://localhost:8080/api/contact
```
