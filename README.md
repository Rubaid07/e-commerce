# Realm Ware - Shopping platform

A lightning-fast, mobile-first shopping storefront powered by React 18, Vite and Tailwind CSS that plugs straight into your Express + MongoDB back-end. Browse, cart, checkout, wishlist and admin controls—all in one sleek PWA-ready package.

![e-commerce Banner](https://i.postimg.cc/63RkW89k/Screenshot-3.png)

---

## 🌟 Features

- Browse products by category / search
- Add to cart & adjust quantities
- Wishlist (persisted per user)
- Firebase Authentication (email / Google)
- Secure checkout → creates order via REST API
- Admin dashboard (products + orders + stats)

---

## ⚙️ Tech Stack

- React
- Vite 
- React-Router
- Tailwind CSS 
- Firebase Auth
- Axios
- React-Hook-Form
- Chart.js (admin stats)

---

## 🚀 Quick Start (Local)

1. Clone & install
   ```bash
   git clone https://github.com/Rubaid07/e-commerce-client.git
   cd e-commerce-client
   npm install
   ```
2. Environment variables
Create .env in root:
  ```typescript
  VITE_API_URL=http://localhost:5000
  VITE_FIREBASE_API_KEY=your-firebase-api-key
  VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=your-project-id
  VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
  VITE_FIREBASE_APP_ID=1:xxx:web:xxx
  ```
3. Run dev server
   ```bash
   npm run dev
   ```
Opens at http://localhost:5173

## 📦 Build for Production
```bash
npm run build
```
## 🔐 Auth Flow
1. User signs in with Firebase (email or Google popup).
2. Front-end receives Firebase ID-token.
3. Token is attached to every authenticated request: `Authorization: Bearer <idToken>`
4. Server middleware verifies token & returns user data.

## 🌐 Sample API Calls (Axios)
```typescript
// public
axios.get(`${import.meta.env.VITE_API_URL}/api/products`)

// authenticated
axios.post(`${API}/api/wishlist`, 
  { productId }, 
  { headers: { Authorization: `Bearer ${token}` }})
```

## 📁 Project Structure
```
src/
├─ api/               # Axios instances & interceptors
├─ assets/            # images, icons
├─ components/        # reusable UI
├─ hooks/             # useAuth, useCart, useOrders
├─ pages/
│  ├─ Home.jsx
│  ├─ ProductDetail.jsx
│  ├─ Cart.jsx
│  ├─ Checkout.jsx
│  ├─ Wishlist.jsx
│  └─ Admin/
│     ├─ Products.jsx
│     ├─ Orders.jsx
│     └─ Stats.jsx
├─ router/            # Route guards (AuthGuard, AdminGuard)
├─ store/             # Context providers (Cart, Auth)
├─ utils/             # helpers, constants
└─ main.jsx           # entry point
```

## 🚀 Deploy to Vercel
1. Push to GitHub.
2. Vercel Dashboard → Add New → Import Git Repository.
3. Add environment variables (same as .env).
4. Deploy.
Auto-deploys on every push to main.
