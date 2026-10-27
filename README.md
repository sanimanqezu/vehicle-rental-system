# Vehicle Rental System

[![CI](https://github.com/sanimanqezu/vehicle-rental-system/actions/workflows/ci.yml/badge.svg)](https://github.com/sanimanqezu/vehicle-rental-system/actions/workflows/ci.yml)

A full-stack, microservices-based vehicle rental platform. A **Spring Cloud** backend — fronted by a dedicated **OAuth2 Authorization Server** — exposes cars, reservations, and users domains through an API gateway, with a modern **Next.js 15 / React 19** frontend secured via NextAuth.

## Architecture

```
   Next.js 15 frontend  ──login──▶  OAuth2 Authorization Server  (issues JWT access tokens)
   (NextAuth)                                │          :8080
        │                                    │ tokens
        │  API calls (Bearer JWT)            ▼
        └──────────────▶  API Gateway  ──routes──▶  ┌──────────────────────────┐
                            :7000                   │ cars-service        :9102 │  resource server
                              │                     ├──────────────────────────┤
                              │                     │ reservations-service :9103│  resource server
                              │                     ├──────────────────────────┤
                              │                     │ users-service       :9101 │  resource server
                              │                     └──────────────────────────┘
                    all services register with ▼
                          Eureka Service Registry  :8761
                    configuration served by ▼
                          Spring Cloud Config Server  :9001
```

Each business service owns its own PostgreSQL database (`vehicle_cars`, `vehicle_reservations`, `vehicle_users`) and reaches it through `DB_*` environment variables, so a single centralised Postgres instance can back the whole platform.

## Highlights

- **Dedicated OAuth2 Authorization Server** issuing JWT access tokens; each business service acts as an OAuth2 **resource server** and validates tokens independently against the issuer's JWK set.
- **Scope-based access control** enforced per service via Spring Security — e.g. `SCOPE_cars.read` / `SCOPE_cars.write`, `SCOPE_reservations.*`, with method-level `@PreAuthorize` as well.
- **Service discovery + centralised config** — services register with Eureka and import configuration from a Spring Cloud Config Server, so environment specifics are not hard-coded.
- **API Gateway** as the single, secured entry point, routing by path to the discovered services (`lb://…`).
- **Contract-first APIs** — each service's REST interface is generated from an OpenAPI spec (`api.yml`) via the OpenAPI Generator, and entities are mapped to DTOs with MapStruct.
- **Modern frontend** — Next.js 15 App Router with NextAuth session handling, Zustand state, React Hook Form + Zod validation, and Recharts dashboards.
- **Postman collection** included for exercising the API.

## Key design points

- **Layered per service** — `controller` (implements the generated API interface) → `core` service interface + `core.impl` implementation → `persistance` JPA entity + Spring Data repository, with a MapStruct `adapter` mapper between entity and DTO.
- **Resource-server isolation** — no business service trusts another; every request is authorised from the JWT it carries. There is no shared session.
- **Custom date handling** — `reservations-service` registers explicit `LocalDate` (de)serializers so reservation date ranges round-trip cleanly over JSON.
- **Externalised persistence** — DB host/port/name/credentials come from `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, defaulting to a local Postgres for development.

## Services

| Component | Port | Role |
|---|---|---|
| **Authorization Server** | 8080 | OAuth2 — authenticates users and issues JWT access tokens |
| **Config Server** | 9001 | Centralised, externalised configuration |
| **Eureka Server** | 8761 | Service registry / discovery |
| **API Gateway** | 7000 | Single secured entry point; routes to services |
| **cars-service** | 9102 | Vehicle inventory domain (resource server) |
| **reservations-service** | 9103 | Booking domain, with custom date (de)serialization (resource server) |
| **users-service** | 9101 | User domain (resource server) |

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Java 25, Spring Boot 3.5.16, Spring Cloud 2025.0.0 (Eureka, Config, Gateway), Spring Security OAuth2 Resource Server, Spring Data JPA |
| Auth | OAuth2 Authorization Server, JWT |
| Persistence | PostgreSQL |
| API & mapping | OpenAPI / Swagger (contract-first, OpenAPI Generator), MapStruct, Lombok |
| Testing | JUnit 5, Mockito, AssertJ, Spring MVC Test (`@WebMvcTest`) |
| Frontend | Next.js 15, React 19, NextAuth, Zustand, React Hook Form, Zod, Recharts, Tailwind CSS |
| Build & runtime | Maven (multi-module), Docker |

## Running locally

**Prerequisites:** JDK 25, Maven, Node.js, Docker, PostgreSQL.

### 1. Centralised PostgreSQL

Start one Postgres instance and create the three databases. If you use the portfolio's shared Postgres container, attach everything to the shared `portfolio-net` Docker network so the services can resolve it by hostname.

```bash
# create the per-service databases
createdb vehicle_cars
createdb vehicle_reservations
createdb vehicle_users
```

Point the services at it (defaults shown):

```bash
export DB_HOST=localhost DB_PORT=5432 DB_USERNAME=postgres DB_PASSWORD=postgres
```

### 2. Backend — start infrastructure first, then services

```bash
cd backend
export JAVA_HOME=/path/to/jdk-25

# infrastructure, in order
(cd infrastructure/configserver            && ./mvnw spring-boot:run)   # :9001
(cd infrastructure/eurekaserver            && ./mvnw spring-boot:run)   # :8761
(cd infrastructure/AuthorizationServerConfig && ./mvnw spring-boot:run) # :8080
(cd infrastructure/gatewayservice          && ./mvnw spring-boot:run)   # :7000

# business services (reach them through the gateway on :7000)
mvn -pl services/cars-service spring-boot:run          # :9102
mvn -pl services/reservations-service spring-boot:run  # :9103
mvn -pl services/users-service spring-boot:run         # :9101
```

The config server (9001) and Eureka (8761) should be up before the business services, so each service can import its configuration and register for discovery. Traffic normally enters through the gateway on **:7000**.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

Sign in through the frontend; NextAuth obtains a JWT from the Authorization Server, and every API request carries that token to the gateway, which routes it to the appropriate resource server.

## Tests

Business logic is covered at two layers, with no database or network — repositories and collaborators are mocked:

- **Service-layer unit tests** (`@ExtendWith(MockitoExtension.class)`): happy paths, not-found handling, partial-update semantics, search aggregation, and domain edge cases (password hashing on user creation, average-mileage / cheapest / newest car queries, etc.).
- **Controller slice tests** (`@WebMvcTest` + `@MockitoBean`, security filters disabled): HTTP status codes, request/response mapping, path and query-parameter binding, and delegation to the service layer.

**66 tests** in total across the three business services:

| Service | Service-layer | Controller | Total |
|---|---|---|---|
| cars-service | 20 | 8 | 28 |
| reservations-service | 12 | 6 | 18 |
| users-service | 14 | 6 | 20 |

```bash
cd backend
mvn -pl services/cars-service,services/reservations-service,services/users-service test
```

The infrastructure modules (Config Server, Eureka Server, API Gateway, Authorization Server) are intentionally **not** unit-tested — they are thin Spring Cloud configuration and hold no business logic worth isolating.

## Project structure

```
vehicle-rental-system/
├── backend/
│   ├── infrastructure/
│   │   ├── AuthorizationServerConfig/   OAuth2 authorization server      (:8080)
│   │   ├── configserver/                Spring Cloud Config              (:9001)
│   │   ├── eurekaserver/                service registry                 (:8761)
│   │   └── gatewayservice/              API gateway                      (:7000)
│   ├── services/
│   │   ├── cars-service/                vehicle inventory (resource server, :9102)
│   │   │   └── src/{main,test}/java     controller · core · persistance · adapter
│   │   ├── reservations-service/        bookings (resource server, :9103)
│   │   └── users-service/               users (resource server, :9101)
│   ├── Postman_Collection/              API request collection
│   └── pom.xml                          Maven multi-module aggregator
└── frontend/                            Next.js 15 + NextAuth client
```
