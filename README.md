# 🏥 Medical Appointment Service

🚧 This project is actively under development.
New features, UI improvements, and architectural enhancements are continuously being added.

## 📌 Overview
Medical Appointment Service is a full-stack web application designed to streamline healthcare scheduling and management.

It provides a secure backend and dynamic role-based frontend, allowing seamless interaction between:
- 🧑‍⚕️ Doctors
- 🧑 Patients
- 🛠️ Administrators
The system supports secure authentication, appointment booking, real-time status updates, and email notifications.
 
## 🚀 Tech Stack
### Backend
- Java
- Spring Boot
- Spring Security (JWT Authentication)
- Spring Data JPA
- PostgreSQL
- MailHog (Email testing)
### Frontend
- React
- Axios
- TailwindCSS
- Material UI
### DevOps
- Docker
- Docker Compose

## ✨ Features 
### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Account approval system (Admin-controlled)
### 👥 Role-Based Actions
#### 🧑 Patient
- Browse doctors
- Book appointments
- Cancel appointments
- View appointment status
#### 🧑‍⚕️ Doctor
- Set availability
- View patient appointments
- Confirm or cancel appointments
#### 🛠️ Admin
- Manage users
- Approve accounts
- Delete users
#### 📧 Notifications
- Email notifications for
  - Registration
  - Appointment booking
  - Appointment confirmation
  - Appointment cancellation
- In-app notification system 

## 🏗️ Architecture
- RESTful API built with Spring Boot
- JWT Authentication with role-based authorization
- React SPA frontend with protected routes
- PostgreSQL relational database
- Dockerized services using Docker Compose

## 📂 Project Structure (Monorepo)
```text  
  Medical_Appointment_Service/
  │
  ├── backend/          → Spring Boot application
  ├── frontend/         → React application
  ├── docker-compose.yml
  └── README.md
```

## ⚙️ Installation
### 1️⃣ Clone the repository
```bash
git clone https://github.com/chalatsis2004/Medical_Appointment_Service
cd Medical_Appointment_Service
```
### 2️⃣ Start the application
```bash
docker-compose up --build
```

## 🌐 Services
After running Docker:
| Service       | URL                    |
| ------------- | ---------------------- |
| Frontend      | http://localhost:3000  |
| Backend       | http://localhost:8080  |
| MailHog       | http://localhost:8025  |
| PostgreSQL    | localhost:5432         |

## 🗄️ Database Setup
This project uses PostgreSQL

If you already have PostgreSQL running: 
- Update application.properties in the backend with your database credentials
If not:
- Uncomment the **DB** service in **docker-compose.yml**
Example
```yaml
db:
  image: postgres:15
  container_name: db
  environment:
    POSTGRES_DB: medical_appointments
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
  ports:
    - "5432:5432"
  volumes:
    - db_data:/var/lib/postgresql/data
```
Then restart:
```bash
docker-compose up --build
```

## 🔑 Default Credentials (Testing)
You can register new users via the frontend

Default admin account:
```code
Username: admin1
Password: admin123
```
Available Roles:
- ROLE_ADMIN
- ROLE_DOCTOR
- ROLE_PATIENT

## 🔌 Example API Endpoint
### Create Appointment
#### Post /api/appointment
```json
{
  "doctorId": 3,
  "date": "2026-03-01",
  "time": "10:30"
}
```
Response: 
```json
{
  "id": 15,
  "status": "PENDING"
}
```

## 📸 Screenshots
### Landing Page
<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/a52d0361-62a9-4f47-abaf-86f15a6e77d4" />

### Admin Dashboard 
<img width="1919" height="987" alt="image" src="https://github.com/user-attachments/assets/b3d5283d-08b8-4720-8bf7-74a9c093d289" />

### Doctor Dashboard
<img width="1919" height="989" alt="image" src="https://github.com/user-attachments/assets/69601ece-7017-4edb-8e1c-06c249f1ba4a" />

### Patient Dashboard
<img width="1919" height="983" alt="image" src="https://github.com/user-attachments/assets/ae80350b-6fad-4558-ad62-e1cfc17e8362" />

## 🔮 Future Improvements
- Real-time notifications (WebSockets)
- Appointment Reminders
- Payment Integration
- CI/CD Pipeline
- Cloud Deployment(AWS/Render)
- Unit & integration testing
- Calendar sync (Google Calendar)

## 🎯 Why This Project Matters
This project demonstrates:
- Full-stack development
- Secure authentication & authorization
- REST API design
- Role-based system architecture
- Containerization with Docker
- Real-world business logic implementation

## 📬 Contact
If you'd like to connect or discuss this project:
- GitHub: https://github.com/LamprosChalatsis
- Email: lambroshalatsis154@gmail.com

## ⭐ Final Notes
This project is continuously evolving and serves as a real-world demonstration of modern full-stack architecture using Spring Boot and React.

Contributions, feedback, and suggestions are welcome!


 
