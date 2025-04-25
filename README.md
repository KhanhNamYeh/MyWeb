# React + Vite + PHP (XAMPP)

This project uses **React + Vite** for the frontend and **PHP (XAMPP)** for the backend. It also includes a MySQL database to store and manage data such as books, categories, users, etc.

## 🔧 Technologies Used

- **Frontend**: React + Vite
- **Backend**: PHP (via XAMPP)
- **Database**: MySQL (accessed via phpMyAdmin)

---

## 📦 Installation & Usage Guide

Follow the steps below to set up and run the project locally:

### 1. Backend Setup (PHP + MySQL)

1. Download and install **[XAMPP](https://www.apachefriends.org/index.html)**.
2. Start **Apache** and **MySQL** using the XAMPP Control Panel.
3. Copy the entire PHP backend folder into the following directory:
   ```
   xampp/htdocs/
   ```
4. Open your browser and go to:
   ```
   http://localhost/phpmyadmin
   ```
5. Import the SQL file located in the `database/` directory (e.g., `database/db.sql`) to set up the database.

### 2. Frontend Setup (React + Vite)

1. Make sure you have **Node.js** and **npm** installed.
2. Open a terminal in the root folder of the project.
3. Run the following command to start the development server:
   ```
   npm install
   npm run dev
   ```

4. Your frontend should now be running at:
   ```
   http://localhost:5173
   ```

---

## 🧩 Notes

- Ensure the PHP backend endpoints (e.g., `http://localhost/backend-folder/...`) are correctly referenced in your frontend code.
- You may need to configure **CORS** headers in PHP if you're running the frontend and backend on different ports.

---

## 📁 Project Structure Overview

```
project-root/
│
├── php/                      # PHP backend folder (to be placed inside xampp/htdocs)
│   ├── db.php                # Database connection
│   ├── admin_books.php       # Admin operations for books
│   └── ...
│
├── database/
│   └── db.sql                # SQL file for creating tables and sample data
│
├── src/                      # React frontend
│   ├── components/
│   ├── pages/
│   └── ...
│
├── public/
├── index.html
├── package.json
└── vite.config.js
```

---

## 🔗 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://reactjs.org/)
- [PHP Manual](https://www.php.net/manual/en/)
- [XAMPP Download](https://www.apachefriends.org/index.html)
- [phpMyAdmin](https://www.phpmyadmin.net/)
