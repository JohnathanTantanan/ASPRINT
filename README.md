# CCAPDEV-Phase3-Group10

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

## Installation Guide (Two Ways)
## Local Host
### 1. Clone or Extract the Project
- If using a ZIP file, unzip `CCAPDEV-Phase3-Group10.zip`.
- Move the extracted `CCAPDEV-Phase3-Group10` folder to a safe directory.
- Open **Command Prompt** and navigate to the project directory:

 ``` sh
  cd path\to\CCAPDEV-Phase3-Group10
 ```

### 2. Install Dependencies
Run the following command to install all required packages:

```sh
npm install dotenv express express-ejs-layouts cookie-parser express-session connect-mongo body-parser mongoose gridfs-stream multer multer-gridfs-storage jsonwebtoken bcryptjs nodemon --save --legacy-peer-deps
```

### 3. Run the Server
Start the Node.js server with:

```sh
npm run dev
```
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
## Web Host
### 1. Open Web Browser to use Application
Once the web browser is open, visit this URL: https://the-forum.onrender.com

## Troubleshooting
- **If Render takes too long to load**, the server might have timed out. This happens because Render's free tier spins down with inactivity. The first request after inactivity will wake up the server, but may take 30-60 seconds to respond.
- **If the application crashes or shows errors**, try refreshing the page or clearing your browser cache.
- **If images don't load properly**, this could be due to temporary storage limitations on Render's free tier.
- **For persistent issues**, please use the local installation method described above for a more reliable experience during development and testing.
- **Database connection issues** may occur if there are too many simultaneous connections. If this happens, wait a few minutes before trying again.




