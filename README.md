# Vehicle Rental System

A full-stack, microservices-based vehicle rental platform. A **Spring Cloud** backend — fronted by a dedicated **OAuth2 Authorization Server** — exposes cars, reservations, and users domains through an API gateway, with a modern **Next.js 15 / React 19** frontend secured via NextAuth.

## Architecture

```
   Next.js 15 frontend  ──login──▶  OAuth2 Authorization Server  (issues JWT access tokens)
   (NextAuth)                                │
        │                                    │ tokens
        │  API calls (Bearer JWT)            ▼
        └──────────────▶  API Gateway  ──routes──▶  ┌─────────────┐
                              │                     │ Cars        │  resource server
                              │                     ├─────────────┤
                              │                     │ Reservations│  resource server
                              │                     ├─────────────┤
                              │                     │ Users       │  resource server
                              │                     └─────────────┘
                    all services register with ▼
                          Eureka Service Registry
                    configuration served by ▼
                          Spring Cloud Config Server
```

## Highlights

- **Dedicated OAuth2 Authorization Server** issuing JWT access tokens; each business service acts as an OAuth2 **resource server** and validates tokens independently.
- **Role-based access control** enforced per service via Spring Security.
- **Service discovery + centralised config** — services register with Eureka and pull configuration from a Spring Cloud Config Server, so nothing is hard-coded.
- **API Gateway** as the single, secured entry point.
- **Modern frontend** — Next.js 15 App Router with NextAuth session handling, Zustand state, React Hook Form + Zod validation, and Recharts dashboards.
- **Postman collection** included for exercising the API.

## Services

| Component | Role |
|---|---|
| **Authorization Server** | OAuth2 — authenticates users and issues JWT access tokens |
| **Config Server** | Centralised, externalised configuration |
| **Eureka Server** | Service registry / discovery |
| **API Gateway** | Single secured entry point; routes to services |
| **cars-service** | Vehicle inventory domain (resource server) |
| **reservations-service** | Booking domain, with custom date (de)serialization (resource server) |
| **users-service** | User domain (resource server) |

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3, Spring Cloud (Eureka, Config, Gateway), Spring Security OAuth2, Spring Data JPA |
| Auth | OAuth2 Authorization Server, JWT |
| Docs | OpenAPI / Swagger, Postman collection |
| Frontend | Next.js 15, React 19, NextAuth, Zustand, React Hook Form, Zod, Recharts, Tailwind CSS |
| Build & runtime | Maven (multi-module), Docker |

## Running locally

**Prerequisites:** Java 17+, Maven, Node.js, Docker.

```bash
# Backend — start infrastructure, then services
cd backend
# bring up Eureka, Config Server, Authorization Server, Gateway, and the cars/reservations/users services
# (see each module's README / pom; run via Maven or Docker)

# Frontend
cd frontend
npm install
npm run dev        # http://localhost:3000
```

Sign in through the frontend; NextAuth obtains a JWT from the Authorization Server, and every API request carries that token to the gateway, which routes it to the appropriate resource server.

## Project structure

```
vehicle-rental-system/
├── backend/
│   ├── infrastructure/
│   │   ├── AuthorizationServerConfig/   OAuth2 authorization server
│   │   ├── configserver/                Spring Cloud Config
│   │   ├── eurekaserver/                service registry
│   │   └── gatewayservice/              API gateway
│   ├── services/
│   │   ├── cars-service/                vehicle inventory (resource server)
│   │   ├── reservations-service/        bookings (resource server)
│   │   └── users-service/               users (resource server)
│   └── Postman_Collection/              API request collection
└── frontend/                            Next.js 15 + NextAuth client
```
