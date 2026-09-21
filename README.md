# Student Armory — Image to PDF Converter (React + Spring Boot + ApyHub)

A full-stack, cloud-powered web application that converts images (**PNG, JPG, JPEG, GIF, SVG, TIFF, BMP**) into professional PDF documents using **React (Vite)** on the frontend and **Spring Boot** as a secure proxy backend integrated with the **ApyHub Image to PDF API**.

![Student Armory](frontend/src/assets/logo.png)

---

## 🛠️ Architecture Overview

```text
React Frontend (Vite)
     │
     │  POST /api/pdf/convert (multipart/form-data: file, landscape)
     ▼
Spring Boot Proxy Backend (Port 8080)
  ├── ImageToPdfController (REST API & CORS configured)
  ├── ImageToPdfService (Validation + HTTP client to ApyHub)
  ├── ApyHubConfig (Loads APYHUB_API_KEY securely from environment)
  └── GlobalExceptionHandler (Standardized error JSON)
     │
     │  POST https://api.eu.apyhub.com/apyhub/convert-image-to-pdf/file/download
     │  Header: apy-token: <APYHUB_API_KEY>
     ▼
ApyHub Cloud API
     │
     │  PDF Binary Stream
     ▼
Spring Boot (attachment; filename="converted.pdf")
     │
     ▼
React Frontend (Direct Browser Download & Preview)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 21+**
- **Node.js 18+** & **npm**
- **ApyHub API Key** (Free tier from [apyhub.com](https://apyhub.com))

---

### 1. Configure Backend & Start Server

Export your ApyHub token as an environment variable:

```bash
export APYHUB_API_KEY="your_actual_apyhub_api_token"
```

Navigate to `backend` directory and run:

```bash
cd backend
./mvnw spring-boot:run
```

The backend server will start on `http://localhost:8080`.

#### Test Backend Health:
```bash
curl http://localhost:8080/api/pdf/health
```

#### Test Image Conversion via cURL:
```bash
curl -X POST "http://localhost:8080/api/pdf/convert?landscape=false" \
  -F "file=@/path/to/your/image.png" \
  --output converted.pdf
```

---

### 2. Start React Frontend

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```text
student-armory/
│
├── backend/
│   ├── src/main/java/com/armory/backend/
│   │   ├── BackendApplication.java
│   │   ├── config/
│   │   │   ├── ApyHubConfig.java
│   │   │   └── WebConfig.java
│   │   ├── controller/
│   │   │   └── ImageToPdfController.java
│   │   ├── dto/
│   │   │   └── ErrorResponse.java
│   │   ├── exception/
│   │   │   ├── ImageConversionException.java
│   │   │   └── GlobalExceptionHandler.java
│   │   └── service/
│   │       └── ImageToPdfService.java
│   │
│   ├── src/main/resources/
│   │   └── application.properties
│   │
│   ├── src/test/java/com/armory/backend/
│   │   ├── BackendApplicationTests.java
│   │   └── ImageToPdfControllerTest.java
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.png
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── ImagePreview.jsx
│   │   │   ├── OrientationSelector.jsx
│   │   │   ├── FeaturesBanner.jsx
│   │   │   └── Footer.jsx
│   │   ├── services/
│   │   │   └── imageToPdfApi.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔒 Security Best Practices
- **Never expose your ApyHub token on the frontend.**
- The Spring Boot backend securely stores the token and attaches the `apy-token` header when communicating with ApyHub.
- Client uploads are validated for file format, emptiness, and file size limits (up to 100 MB).
