Product Requirements Document (PRD)


2. Product Overview

Product Name: CarRental Platform

Category: Two‑sided marketplace (Renters ↔ Car Owners)

Core Value:

Renters can safely book cars with guaranteed availability

Owners can manage inventory, approve bookings, and track real revenue

3. User Roles & Access Control
3.1 Guest

View homepage

Browse cars

View car details

Cannot book

3.2 Authenticated User (Renter)

Register / Login

Search cars by location & date

Create bookings

View booking history

3.3 Owner (Role‑based, not separate user type)

All renter permissions

List cars

Update car availability

Approve / reject bookings

View revenue dashboard

Access Control Rule:

Single users collection

Role enforced via JWT + middleware

4. Core Systems (This Is What Makes the Project Strong)
4.1 Authentication & Authorization System

Email/password authentication

Password hashing (bcrypt)

JWT access tokens

Role‑based route protection

4.2 Inventory & Availability System

Each car has availability derived from bookings

Car availability = no overlapping confirmed bookings

Disabled booking for unavailable cars

4.3 Booking Lifecycle System (CRITICAL)

Booking states:

pending

confirmed

completed

cancelled

Rules:

Booking cannot overlap confirmed bookings

Owner cannot book their own car

Status transitions are enforced server‑side

Completed bookings are auto‑updated after return date

This booking lifecycle is implemented as a state machine, not ad‑hoc updates.

4.4 Revenue & Accounting System

Revenue only includes:

confirmed bookings

pickup date ≤ current date

Cancelled bookings excluded

Monthly revenue calculated using MongoDB aggregation pipelines

4.5 Data Integrity Rules (Interview‑Grade)

Cannot delete car with active or future bookings

Cannot confirm booking for unavailable car

Booking price locked at creation time

Timezone‑safe date handling

5. Feature Enhancements (Advanced – Required)
 A: Availability Calendar (MANDATORY)

Purpose: Expose real booking constraints visually and logically.

Features:

Per‑car availability calendar

Booked dates highlighted

Backend‑driven availability (not frontend guessing)

Shared logic with booking validation

 B: Payment Lifecycle Simulation (MANDATORY)

Purpose: Demonstrate understanding of transactional flows without real payments.

States:

unpaid

reserved

paid

Rules:

Booking created → unpaid

Owner confirms → reserved

Simulated payment → paid

No external gateway required. Logic only.

6. Functional Features
6.1 Homepage

Animated sections (Framer Motion)

Search form (location, pickup, return)

Featured cars

Newsletter email capture

6.2 Cars Listing Page

All available cars

Search by brand, model, features

Price per day

6.3 Car Details Page

Image gallery

Specs & features

Availability calendar

Booking form

6.4 My Bookings (User)

Booking cards

Status indicators

Total price

6.5 Owner Dashboard

Metrics:

Total cars

Total bookings

Pending vs confirmed

Monthly revenue

Management:

Add / update / delete cars

Approve or cancel bookings

7. Non‑Functional Requirements
Performance

API response < 300ms (local)

Lazy‑loaded images

Security

JWT auth middleware

Role checks on all protected routes

UX

Disabled actions when invalid

Loading & error states everywhere

8. Tech Stack (Locked)
Frontend

React.js (Vite)

Tailwind CSS

Framer Motion

Axios

Backend

Node.js

Express.js

JWT Authentication

Database

MongoDB

Mongoose

Media

ImageKit

Deployment

Frontend: Vercel

Backend: Render / Railway

Database: MongoDB Atlas


9. Database Schema (High Level)
User

name

email

password

role

avatar

Car

ownerId

brand

model

year

pricePerDay

category

transmission

fuelType

seats

location

description

features[]

images[]

isAvailable

Booking

userId

carId

pickupDate

returnDate

totalPrice

bookingStatus

paymentStatus

createdAt

10. API Structure
Auth

POST /auth/register

POST /auth/login

Cars

GET /cars

GET /cars/:id

POST /cars (owner)

PATCH /cars/:id/status

DELETE /cars/:id

Bookings

POST /bookings

GET /bookings/my

GET /bookings/owner

PATCH /bookings/:id/status

PATCH /bookings/:id/payment