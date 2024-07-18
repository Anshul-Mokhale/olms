# Online Library Management System

## Project Description

This project is a comprehensive online library management system built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The system includes functionalities for both users and admin users. Admin users can issue and return books, add new books, and remove existing books. Normal users can browse the library catalog and view their personal transaction history.

## Core Technologies
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## Features

### Admin User Operations
- Issue and return books, altering their availability status.
- Add new books to the system.
- Remove existing books from the inventory.

### User Interactions (Read-Only)
- Browse the library catalog.
- View personal transaction history.

## Prerequisites

- Node.js
- npm (Node Package Manager)
- MongoDB

## Installation

### Clone the Repository

```bash
git clone https://github.com/Anshul-Mokhale/olms.git
cd library-management-system
```


## Backend Setup
Navigate to the backend directory:

```bash
Copy code
cd backend
```
## Install backend dependencies:

```bash
Copy code
npm install
```
Create a .env file in the backend directory and add the following environment variables:

makefile
Copy code
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret>
Start the backend server:

bash
Copy code
npm start
The backend server should now be running on http://localhost:8000.

Frontend Setup
Navigate to the frontend directory:

bash
Copy code
cd ../frontend
Install frontend dependencies:

bash
Copy code
npm install
Start the frontend server:

bash
Copy code
npm start
The frontend server should now be running on http://localhost:5173.

## API Endpoints


## Backend Env Data

PORT=8000
MONGODB_URI=mongodb+srv://anshumokhale:anshul%40123@cluster0.bkpmtvh.mongodb.net/olms?retryWrites=true&w=majority&appName=Cluster0
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=my-secret-access
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=my-secret-refresh
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME = dxaw17f4u
CLOUDINARY_API_KEY=759357581887771
CLOUDINARY_API_SECRET=1jm-hT-6--li5d-jc32Nebq6gtg

##Project Structure

olms/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── server.js
│   └── .env
└── frontend/
    ├── public/
    ├── src/
    ├── .env
    └── package.json


##Deployment on AWS
Step 1: Set Up AWS Services
Create an AWS Account: Sign up for an AWS account if you don't have one.
Launch EC2 Instances:
Create two EC2 instances, one for the backend and one for the frontend.
Choose an appropriate instance type (e.g., t2.micro for small projects).
Configure security groups to allow HTTP (port 80) and HTTPS (port 443) traffic.
Attach an Elastic IP to each instance for consistent IP addresses.
