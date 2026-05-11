# 📒 Contact Book

A full-stack contact management web application built with **Node.js**, **Express**, and **Vanilla JavaScript**. Users can sign up, log in, and manage their personal contacts with full CRUD functionality.

---

## Features

-  **User Authentication** — Register and log in securely with hashed passwords (bcrypt)
-  **Per-User Contacts** — Each user sees only their own contacts
-  **Add Contacts** — Save name, email, phone, address, and notes
-  **Edit Contacts** — Update contact details anytime
-  **Delete Contacts** — Remove contacts with a single click
-  **Search / Filter** — Quickly find contacts by name or email
-  **JSON File Database** — Lightweight data persistence via `db.json`
-  **Live Server Ready** — Works with VS Code Live Server or any static host

---

## Project Structure

```
CONTACT-BOOK/
├── Controllers/
│   ├── authControllers.js       # Login & signup logic
│   └── contactControllers.js    # CRUD operations for contacts
├── Middleware/
│   └── authMiddleware.js        # JWT/session authentication middleware
├── Public/
│   ├── app.css                  # Global styles
│   ├── contacts.html            # Contacts page
│   ├── contacts.js              # Contacts page logic
│   ├── Index.html               # Landing / home page
│   ├── Script.js                # Main frontend script
│   ├── signup.html              # Signup page
│   ├── signup.js                # Signup logic
│   └── style.css                # Additional styles
├── Routes/
│   ├── authRoutes.js            # Auth endpoints (login, register)
│   └── contactRoutes.js         # Contact CRUD endpoints
├── Utils/
│   └── dbUtils.js               # Helpers for reading/writing db.json
├── db.json                      # JSON file database
├── server.js                    # Express server entry point
├── package.json
└── package-lock.json
```

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Runtime    | Node.js                 |
| Framework  | Express.js              |
| Frontend   | HTML, CSS, Vanilla JS   |
| Auth       | bcrypt, JWT (or sessions)|
| Database   | JSON file (`db.json`)   |
| Dev Tools  | VS Code, Live Server    |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/contact-book.git
   cd contact-book
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   node server.js
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

> Alternatively, open `Public/Index.html` with VS Code **Live Server** for frontend-only preview.

---

## API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint    | Description         |
|--------|-------------|---------------------|
| POST   | `/register` | Create a new account|
| POST   | `/login`    | Log in and get token|

### Contact Routes — `/api/contacts`

| Method | Endpoint    | Description              |
|--------|-------------|--------------------------|
| GET    | `/`         | Get all user contacts    |
| POST   | `/`         | Create a new contact     |
| PUT    | `/:id`      | Update a contact by ID   |
| DELETE | `/:id`      | Delete a contact by ID   |

> All contact routes are protected and require authentication.

---

## Data Models

### User
```json
{
  "id": "uuid",
  "username": "Mariel",
  "email": "user@example.com",
  "password": "$2a$10$...(hashed)",
  "createdAt": "2026-05-08T05:22:59.111Z"
}
```

### Contact
```json
{
  "id": "uuid",
  "userId": "owner-uuid",
  "name": "Alice Reyes",
  "email": "alice.reyes@gmail.com",
  "phone": "09171234501",
  "address": "123 Mango St, Davao City",
  "notes": "High School Friend",
  "createdAt": "2026-05-08T15:11:27.479Z",
  "updatedAt": "2026-05-08T15:11:27.479Z"
}
```

---

## Screenshots

> _Add your screenshots here_

| Login Page | Contacts Page |
|------------|---------------|
| ![login]() | ![contacts]() |

---

## Security Notes

- Passwords are hashed using **bcrypt** before being stored
- Authentication tokens protect all contact routes
- Each user can only access and modify their own contacts

---

## Future Improvements

- [ ] Add profile picture upload
- [ ] Export contacts to CSV
- [ ] Contact categories / tags
- [ ] Search with advanced filters
- [ ] Migrate from JSON file to a real database (MongoDB / PostgreSQL)
- [ ] Mobile responsive design improvements

---

## Author

**Mariel** — [@your-username](https://github.com/your-username)

---

## License

This project is open source and available under the [MIT License](LICENSE).
