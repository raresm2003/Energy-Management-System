# ⚡ Energy Management System

Welcome to the **Integrated Energy Management System**!

## 📌 Project Overview

This system aims to efficiently manage users and their smart energy metering devices while integrating monitoring, asynchronous communication, and security mechanisms. The system consists of two projects:

### 🔹 Project 1: **Energy Management System with Monitoring**
- **Features Implemented:**
  - User & Device Management with authentication & authorization.
  - Message Broker for asynchronous communication using **RabbitMQ**.
  - Monitoring & Communication Microservice to process energy consumption data.
  - Smart Metering Device Simulator to generate energy usage data.

### 🔹 Project 2: **Energy Management System with Chat**
- **Features Implemented:**
  - User & Device Management with authentication & authorization.
  - Real-time chat microservice for user-administrator communication.
  - Secure Authorization using **OAuth2 & JWT**.
  - WebSockets for bidirectional messaging.

---

## 🛠️ Tech Stack

| Component                  | Technology Used |
|----------------------------|----------------|
| Frontend                   | React.js |
| Backend                    | Java Spring Boot (REST API, WebSockets, Security) |
| Database                   | MySQL |
| Messaging                  | RabbitMQ |
| Security                   | OAuth2, JWT, HTTPS, SSL |
| Containerization           | Docker |

---

## 🏗️ System Architecture

The **Energy Management System** follows a **microservices architecture** with the following components:

1. **User Management Microservice**  
   - Handles user authentication & authorization.  
   - Implements role-based access control (Admin & Client).  

2. **Device Management Microservice**  
   - Manages smart energy metering devices.  
   - Allows admins to associate devices with users.  

3. **Monitoring & Communication Microservice**  
   - Receives & processes energy consumption data.  
   - Stores hourly energy usage in the database.  

4. **Chat Microservice**  
   - Enables real-time communication between users & admins.  
   - Uses **WebSockets** for instant messaging.  

---

## 🐳 Deployment with Docker

This project includes **two separate Docker configurations** for deploying each component!  

### ▶️ Running the Project

1. **Clone the repository:**
   ```sh
   git clone https://github.com/raresm2003/Energy-Management-System.git
   cd energy-management-system
   ```

2. **Run the desired system:**
     ```sh
     docker-compose -f docker-compose.yml up -d
     ```

3. **Access the services:**
   - **Frontend:** `http://localhost:3000`  
   - **Backend APIs:** `http://localhost:8080`  
   - **RabbitMQ Management UI:** `http://localhost:15672`  

---

## 🚀 Future Improvements

- Implement database synchronization for device monitoring.  
- Add real-time notifications for energy limit violations.  
- Improve security by enforcing stricter **JWT policies**.  
- Implement HTTPS everywhere.  
- Add dashboards with real-time consumption tracking.  
- Automate deployments using GitLab CI/CD.  
- Deploy on **AWS/GCP/Azure** using Kubernetes.  

---

## 👨‍💻 Contributors

**[Miclea Rareș](https://github.com/raresm2003)**   

Feel free to contribute by opening a PR!  

---

### ⭐ If you like this project, give it a star! ⭐  
