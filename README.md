# SecureBank — Online Banking System

A full-stack online banking demo application with a React frontend and Spring Boot backend. Built for educational purposes — not intended for production use with real customer funds.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, React Router, Axios, Recharts, React Hook Form, React Toastify |
| Backend | Java 17, Spring Boot 3, Spring Security, Spring Data JPA, JWT |
| Database | MySQL 8 |

## Features

- User registration & JWT authentication
- Role-based access (USER / ADMIN)
- Account management (Savings & Current)
- Money transfer, deposit & withdrawal
- Transaction history with search, filters & pagination
- Beneficiary management
- User profile & password change
- Admin dashboard (users, accounts, transactions, stats)
- Responsive UI with toast notifications & confirmation dialogs

## Prerequisites

- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+**
- **MySQL 8** running on `localhost:3306`

## Database Setup

1. Start MySQL server
2. Update credentials in `backend/src/main/resources/application.properties` if needed:

```properties
spring.datasource.username=root
spring.datasource.password=root
```

3. The database `banking_db` is created automatically on first run (`createDatabaseIfNotExist=true`)

## Running the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts at **http://localhost:8080**

On first startup, a default admin account is created:
- **Email:** admin@securebank.com
- **Password:** admin123

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at **http://localhost:5173** (API requests proxy to port 8080)

## Demo Workflow

1. **Register** a new customer account at `/register`
2. **Login** and create a **Savings** or **Current** account
3. **Deposit** funds into your account
4. Register a second user (or use another browser) to test **transfers**
5. Login as **admin** to view all users, accounts, and transactions

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET/POST | `/api/accounts` | List / create accounts |
| GET | `/api/accounts/{id}` | Get account by ID |
| POST | `/api/transactions/transfer` | Transfer money |
| POST | `/api/transactions/deposit` | Deposit |
| POST | `/api/transactions/withdraw` | Withdraw |
| GET | `/api/transactions/history` | Transaction history |
| GET/POST/DELETE | `/api/beneficiaries` | Manage beneficiaries |
| GET/PUT | `/api/users/profile` | Profile management |
| PUT | `/api/users/password` | Change password |
| GET | `/api/admin/stats` | Admin statistics |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/accounts` | All accounts |
| GET | `/api/admin/transactions` | All transactions |

## Project Structure

```
├── backend/          # Spring Boot REST API
│   └── src/main/java/com/banking/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── entity/
│       ├── dto/
│       ├── security/
│       ├── config/
│       └── exception/
└── frontend/         # React SPA
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── pages/
        └── utils/
```

## Security Notes

This is a **demo/educational project**. Before any real-world deployment, you would need:

- HTTPS everywhere
- Rate limiting & fraud detection
- Email verification & password reset flows
- Audit logging & compliance controls
- Professional penetration testing
- Regulatory compliance review

## Build for Production

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && mvn clean package
java -jar target/banking-backend-1.0.0.jar
```
