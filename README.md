# SmartFund - Goal-Based Mutual Fund Planner

![SmartFund Banner](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue) ![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green) ![MySQL](https://img.shields.io/badge/Database-MySQL-orange)

A modern, full-stack application designed to help users track mutual fund performance, analyze their risk profiles, and plan for financial goals through automated SIP calculations.

**Live Frontend Interface:**  
https://rajeswari168.github.io/Mutual-Fund-Performance-Tracker-And-Risk-Analyzer---Project/

> **Note:** The live link hosts the frontend user interface on GitHub Pages. To experience full functionality, including login and saving data, you must run the backend server locally because GitHub Pages does not support Java/Spring Boot or MySQL hosting.

---

## Key Features

- **User Dashboard:** Real-time portfolio tracking and asset allocation visualizations.
- **Mutual Fund Discovery:** Search and analyze various mutual fund schemes with live NAV tracking.
- **Goal Planner:** Input your financial targets (e.g., Buying a House, Retirement) and calculate the exact monthly SIP required to reach it.
- **Risk Analyzer:** Determine your risk tolerance and receive personalized investment strategies.

---

## Technology Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Recharts (for data visualization)
- **Backend:** Java Spring Boot, Hibernate/JPA, Spring Security
- **Database:** MySQL

---

## How to Run Locally

To get the full application running on your own machine (including the database and backend logic), follow these steps:

### 1. Start the Backend Server

Ensure you have MySQL installed and running on port **3306** with a database named `mutual_funds_db`.

```bash
cd backend
mvn spring-boot:run
```

### 2. Start the Frontend Server

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

### 3. Quick Start (Windows)

Alternatively, double-click the `run.bat` file in the root directory to automatically launch both the backend and frontend simultaneously in separate windows.

Open your browser and navigate to:

```
http://localhost:5173
```

**Default Test Credentials**

- **Email:** `test@example.com`
- **Password:** `password123`
- 
