# Library Manager (BIWA2110)

React + Express + MySQL library stock system.

## 1. Database
mysql -u root -p < backend/schema.sql

## 2. Backend
cd backend
cp .env.example .env     # then set DB_PASSWORD
npm install
npm run seed             # creates admin  A001 / admin123
npm run dev              # http://localhost:5000

## 3. Frontend
cd frontend
npm install
npm run dev              # http://localhost:5173

## API
GET/POST /books, PUT/DELETE /books/:id
GET/POST /transactions   (type: ADD_STOCK | BORROW)
GET/POST /users, PUT/DELETE /users/:id, POST /users/login
