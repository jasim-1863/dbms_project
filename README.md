# Mess Management System

A web application for managing a mess/canteen service. This project is built using the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication**: Student login/signup with JWT authentication
- **Meal Booking**: Book or skip meals for the current day
- **Menu Display**: View daily and weekly menu
- **Billing**: Track number of meals consumed by each user and generate bills
- **Admin Panel**: Manage users, menu, bookings, and bills

## Setup Instructions

### Requirements
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install server dependencies:
   ```
   npm install
   ```
3. Install client dependencies:
   ```
   cd client
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/mess_management
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

### Running the application

1. Start the server:
   ```
   npm run dev
   ```
2. Start the client:
   ```
   npm run client
   ```
3. For concurrent execution of both server and client:
   ```
   npm run dev
   ```

## Usage

1. Register as a new user
2. Login with your credentials
3. View the menu for the day/week
4. Book or skip meals for the day
5. View your billing history

## Admin Features

1. View all registered users
2. Update the weekly menu
3. View meal booking statistics
4. Generate and manage bills

## Technology Stack

- **Frontend**: React, React Router, Bootstrap
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

- `/client` - React frontend
- `/config` - Server configuration
- `/controllers` - API controllers
- `/middleware` - Express middleware
- `/models` - MongoDB models
- `/routes` - API routes

## Database Schema

The application uses the following data models:
- User
- Menu
- Booking
- Bill 