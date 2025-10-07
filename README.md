# 🔐 Secure Password Vault

## 🌐 Live Demo

You can check out the deployed version of the app here:  
👉 **[Secure Password Vault — Live Demo](https://password-vault-yczq.vercel.app/)**

A **full-stack, zero-knowledge password manager** built with **Next.js, Next-Auth, and MongoDB**.  
This application enables users to generate, store, and manage sensitive credentials in an encrypted vault that **only they can unlock**.

---

## 🚀 Features

- **🔑 Secure User Authentication:**  
  Full registration and login system managed by Next-Auth.

- **🧠 Zero-Knowledge Architecture:**  
  All vault data is encrypted/decrypted **client-side** using a user-provided Master Password.  
  The server never sees or stores unencrypted data or the Master Password itself.

- **⚙️ Strong Password Generator:**  
  Generate strong, unique passwords with adjustable rules (length, numbers, symbols).

- **🗂️ Full CRUD Functionality:**  
  Create, read, update, and delete vault items securely.

- **📥 Encrypted Import/Export:**  
  Export your vault as a secure, encrypted `.json` file or import it back easily.

- **🧹 Clipboard Security:**  
  Auto-clears copied passwords after 15 seconds to prevent accidental exposure.

- **🌗 Light/Dark Mode:**  
  User-friendly theme toggle for comfortable usage.

- **📱 Responsive Design:**  
  Clean, modern UI built with Tailwind CSS — optimized for all screen sizes.

---

## 🧰 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Framework** | Next.js (App Router) |
| **Auth** | Next-Auth.js |
| **Database** | MongoDB with Mongoose |
| **Styling** | Tailwind CSS |
| **Encryption** | AES (Crypto-JS) — client-side only |
| **UI Components** | Custom React components (Button, Input, Modals) |
| **Deployment** | Vercel ready |

---

## 🛠️ Getting Started

Follow these steps to run the project locally.

### ✅ Prerequisites

- Node.js **v18+**
- npm / yarn / pnpm
- MongoDB instance (use [MongoDB Atlas](https://www.mongodb.com/atlas) if needed)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/secure-password-vault.git
cd secure-password-vault
```

### 2️⃣ Install Dependencies
```bash
npm install
# or
yarn install
```

### 3️⃣ Set Environment Variables

Create a .env.local file in the project root and add:

```bash
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
# NextAuth secrets
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4️⃣ Run the Development Server
```bash
npm run dev
```
Then open http://localhost:3000 in your browser.


---

## 🧠 Security Model Explained

This app is built on the **Zero-Knowledge** principle — meaning even the server cannot access your credentials.

### 🔒 Master Password
- Known **only to the user**.  
- Never transmitted or stored — not even hashed on the server.

### 🔐 Client-Side Encryption
- When saving an item, data is **encrypted in the browser** using **AES** with the Master Password as the key.  
- Only the encrypted data (`encryptedData`) is stored in **MongoDB**.

### 🧩 Client-Side Decryption
- To view or edit items, the user enters their **Master Password**.  
- Decryption happens entirely in the **browser** — if the password is wrong, the data remains unreadable.  
- Even if the database is compromised, attackers can’t decrypt your data without your **Master Password**.

---

## 🧪 Testing

You can test:
- ✅ Creating, viewing, editing, and deleting vault items  
- 🔁 Exporting vaults and re-importing them successfully  
- ⏱ Clipboard timeout for password generator  
- 🌗 Theme toggle and responsive layout  

---

## ☁️ Deployment

This app is **fully compatible with Vercel**.  
Simply add your **environment variables** in the platform dashboard and deploy the repo.
