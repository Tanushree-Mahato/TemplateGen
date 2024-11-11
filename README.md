# Full-Stack Project

This project is a full-stack web application built with a React frontend and Node.js/Express backend. The frontend uses Vite and Tailwind CSS for development, while the backend includes REST API routes for document and template management. The project is structured to maintain separation of concerns between frontend and backend.

## Project Structure


# Frontend Structure

📁 node_modules
📁 public
📁 src
    ├── 📁 apis
    ├── 📁 assets
    ├── 📁 components
    ├── 📁 pages
    ├── 📁 store
    └── 📁 styles
📄 index.css
📄 main.jsx
📄 router.jsx
📄 eslint.config.js
📄 index.html
📄 package-lock.json
📄 package.json
📄 postcss.config.js
📄 README.md
📄 tailwind.config.js
📄 vite.config.js

# BackendStructure
📁 config
📁 controllers
📁 export
📁 middleware
📁 models
📁 node_modules
📁 routes
    ├── authRoutes.js
    ├── docRoutes.js
    ├── templateRoutes.js
    └── uploadRoutes.js
📁 uploads
📁 utils
📄 .env
📄 .env.example
📄 package-lock.json
📄 package.json
📄 server.js

## Getting Started

### Prerequisites

- **Node.js** (>= 14.x)
- **NPM** or **Yarn** for package management
- **MongoDB** for database (if required for backend)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Tanushree-Mahato/TemplateGen.git
cd TemplateGen

# 2. Install Dependencies
# For backend:
cd Backend
npm install
# For Frontend
cd Frontend
npm install
# 3. Set Up Environment Variables
In the backend directory, create a .env file and configure the necessary environment variables (refer to .env.example).
In the frontend directory, create a .env file if needed for frontend environment variables (e.g., API base URL).

# Running the Application
Backend (Node.js/Express)
. Start the backend server: npm start
. The backend server should run on http://localhost:5000 (or your specified port).
# Frontend (React/Vite)
Start the development server: npm run dev
# Building for Production
To build the frontend for production, run:
The optimized build will be output to the frontend/dist folder.

# API Overview (Backend)
# The backend provides various API endpoints:

# Auth Routes (authRoutes.js): Handles user authentication and authorization.
# Document Routes (docRoutes.js): Manages document generation, download, and storage.
# Template Routes (templateRoutes.js): Allows CRUD operations on templates.
# Upload Routes (uploadRoutes.js): Manages file uploads.
# Each route file has its own set of endpoints, which can be tested using Postman or another API client.
Tailwind CSS Setup (Frontend)
The frontend uses Tailwind CSS for rapid UI styling. Customize settings in tailwind.config.js and index.css as needed.


This `README.md` file combines the frontend and backend documentation, explaining the setup, structure, and basic usage for each. Adjust the content as needed to match specific project details or configurations.
