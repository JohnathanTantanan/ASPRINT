# CCAPDEV-Phase2-Group10

## Project Setup and Installation

### Prerequisites
Before setting up the project, ensure you have the following installed:
- **Node.js** (Download from [Node.js official website](https://nodejs.org/))
- **MongoDB** (Ensure MongoDB is installed and running)

To verify Node.js installation, run the following commands in Command Prompt:
```
node -v
npm -v
```
If both commands return version numbers, Node.js and npm are correctly installed.

---

## Installation Guide

### 1. Clone or Extract the Project
- If using a ZIP file, unzip `CCAPDEV-Phase2-Group10.zip`.
- Move the extracted `CCAPDEV-Phase2-Group10` folder to a safe directory.
- Open **Command Prompt** and navigate to the project directory:

  command:
  cd path\to\CCAPDEV-Phase2-Group10
  

### 2. Install Dependencies
Run the following command to install all required packages:

command:
npm install dotenv express express-ejs-layouts cookie-parser express-session connect-mongo body-parser mongoose gridfs-stream multer multer-gridfs-storage jsonwebtoken bcryptjs nodemon --save --legacy-peer-deps


### 3. Run the Server
Start the Node.js server with:

command:
npm run dev

- The server will be listening on **port 3000**.

### 4. Open the Web Application
Once the server is running, open your web browser and visit:
```
http://localhost:3000
```

---

## Troubleshooting
- **If `npm run dev` does not work**, check the `package.json` file to ensure it contains:
  ```json
  "scripts": {
    "dev": "nodemon app.js"
  }
  ```


