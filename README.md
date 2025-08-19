(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -1,143 +1,403 @@
-# Zencommerce 
-<!-- ![Zencommerce Logo](https://res.cloudinary.com/dg1wavm3u/image/upload/v1753352208/zencommerce_logo_jyhhkt.png) -->
-
-## Overview
-
-**Zencommerce** is a full-stack e-commerce platform featuring:
-- A mobile-first customer app (React Native/Expo)
-- An admin panel (React)
-- A Node.js/Express backend with MongoDB
-- Razorpay payment integration
-
----
-
-## Screenshots
-
-### 📱 Android App
-
-<p align="center">
-  <img src="https://www.dropbox.com/scl/fi/31be4mrmqo6t0ptgap7a7/Screenshot_2025-07-24-12-39-54-462_com.ramvarma01.Frontend.jpg?rlkey=80tci30c1we373matbmq6ylxd&raw=1" width="150" />
-  <img src="https://www.dropbox.com/scl/fi/i16wc4ie5izisqpqhd44p/Screenshot_2025-07-24-12-39-50-180_com.ramvarma01.Frontend.jpg?rlkey=sw6w4akixmcfeagl50nwbxnq7&raw=1" width="150" />
-  <img src="https://www.dropbox.com/scl/fi/jyww8eax0he7itmbmn30w/Screenshot_2025-07-24-12-39-47-063_com.ramvarma01.Frontend.jpg?rlkey=1ueoeo3cro2m45kclxjuno6cc&raw=1" width="150" />
-   <img src="https://www.dropbox.com/scl/fi/9lxckfn77vcnhr1roko7m/Screenshot_2025-07-24-12-39-29-783_com.ramvarma01.Frontend.jpg?rlkey=vqo6u1031wrxgwc8ytqv2u9uy&raw=1" width="150" />
-  <img src="https://www.dropbox.com/scl/fi/jskg846uadfiufm0s44r6/Screenshot_2025-07-24-12-38-04-280_com.ramvarma01.Frontend.jpg?rlkey=euxtyrp3nuv6i9bl1ep5337h7&raw=1" width="150" />
-</p>
-
-<p align="center">
- 
-  <img src="https://www.dropbox.com/scl/fi/9tg0utmou1yjzhorgss89/Screenshot_2025-07-24-12-37-55-425_com.ramvarma01.Frontend.jpg?rlkey=cx0c8kwzqfou79lhv7hurmc7x&raw=1" width="150" />
-   <img src="https://www.dropbox.com/scl/fi/yxdzspornn3srruws7hpl/Screenshot_2025-07-24-12-37-46-397_com.ramvarma01.Frontend.jpg?rlkey=bx3t2jh5a2r47gvtg30teysvl&raw=1" width="150" />
-  <img src="https://www.dropbox.com/scl/fi/oxr08zv4kot8b34r3b9el/Screenshot_2025-07-24-12-37-36-228_com.ramvarma01.Frontend.jpg?rlkey=8b4q2pumvje54vwomw0s8eka2&raw=1" width="150" />
-  <img src="https://www.dropbox.com/scl/fi/pl4akmjqiehe6c5fgqln6/Screenshot_2025-07-24-12-37-27-302_com.ramvarma01.Frontend.jpg?rlkey=lb24qkaapjvb9k3b8ywfxk9dq&raw=1" width="150" />
-    <img src="https://www.dropbox.com/scl/fi/ybnzu5i0phbdwrvwxg2y8/Screenshot_2025-07-24-12-37-02-427_com.ramvarma01.Frontend.jpg?rlkey=50na779phlmuzo1zxi1bxf9ln&raw=1" width="150" />
-</p>
-
-<p align="center">
- <img src="https://www.dropbox.com/scl/fi/79l52rotm3m1rk4mefqek/Screenshot_2025-07-24-12-36-52-984_com.ramvarma01.Frontend.jpg?rlkey=yme69440gc8anyjte6a2kadoo&raw=1" width="150" />
-  <img src="https://www.dropbox.com/scl/fi/2aousaonm6p9b6h5bz4r2/Screenshot_2025-07-24-12-36-45-555_com.ramvarma01.Frontend.jpg?rlkey=ak3vbomx0gvof4isq0edo4trg&raw=1" width="150" />
-  <img src="https://www.dropbox.com/scl/fi/i0jajhdufvc7a8pp0nhaf/Screenshot_2025-07-24-12-36-28-295_com.ramvarma01.Frontend.jpg?rlkey=co9gwqgei8xofb3737oi4ovy8&raw=1" width="150" />
-  <img src="https://www.dropbox.com/scl/fi/104gisear3n0i5gm3ga4z/Screenshot_2025-07-24-12-36-14-236_com.ramvarma01.Frontend.jpg?rlkey=yehi5i6vmsmk4o4wbar236o1s&raw=1" width="150" />
-  <img src="https://www.dropbox.com/scl/fi/hk158fpu1162nn9nnk945/Screenshot_2025-07-24-12-36-08-290_com.ramvarma01.Frontend.jpg?rlkey=21djkpywoymjcp25re4jn6jms&raw=1" width="150" />
-</p>
-
-
----
-
-### 🖥️ Admin Panel
-
-<p align="center">
-  <img src="https://www.dropbox.com/scl/fi/8oplw3vvlawwu3r4y5ry4/Screenshot-2025-07-24-123526.png?rlkey=iujb0r7ukm7sdmlsrj2x1byh9&raw=1" width="250" />
-  <img src="https://www.dropbox.com/scl/fi/z5owgd6n40pvdcdpblg7h/Screenshot-2025-07-24-123513.png?rlkey=kqaq0voqxj0jboheu033ol6oa&raw=1" width="250" />
-  <img src="https://www.dropbox.com/scl/fi/fhe5r94jt7t5fap2vxmvw/Screenshot-2025-07-24-123500.png?rlkey=6x8bphs0iz05b03pr71p749xo&raw=1" width="250" />
-</p>
-
-<p align="center">
-  <img src="https://www.dropbox.com/scl/fi/36d4vxbxaqz8dw3eg5he1/Screenshot-2025-07-24-123440.png?rlkey=5qqchykud9pwai3nhmqnanw0q&raw=1" width="250" />
-  <img src="https://www.dropbox.com/scl/fi/gfluveo0rxo3tre5110n9/Screenshot-2025-07-24-123430.png?rlkey=o7hd1rns82rbfzoecksfvtcii&raw=1" width="250" />
-  <img src="https://www.dropbox.com/scl/fi/lfav1opmjxx8y3cdhv6ly/Screenshot-2025-07-24-123411.png?rlkey=omrt1qat8wcbl8ggb8ud32x5w&raw=1" width="250" />
-</p>
-
-<p align="center">
-  <img src="https://www.dropbox.com/scl/fi/7pm3j9732bjp2amgf9f71/Screenshot-2025-07-24-123356.png?rlkey=6wse57u6ap9rxjlkwnhuvu939&raw=1" width="250" />
-  <img src="https://www.dropbox.com/scl/fi/sj2to0wwpx07gfv2g0j4w/Screenshot-2025-07-24-123318.png?rlkey=wexe13ogqpscm50vmmne3vkb2&raw=1" width="250" />
-</p>
-
-Or use your Dropbox images, e.g.:
-![Dropbox Image](https://www.dropbox.com/scl/fi/your-image-path/image.jpg?rlkey=yr7h232jqy3lqd22413jo9d2e&raw=1)
-
----
-
-## Features
-
-- User authentication (email, Google)
-- Product catalog with variants
-- Cart, wishlist, and order management
-- Razorpay payment gateway (UPI, cards, wallets, netbanking)
-- Admin panel for product and order management
-- Cloudinary image uploads
-- Responsive design
-
----
-
-## Tech Stack
-
-- **Frontend:** React Native (Expo), React, JavaScript
-- **Backend:** Node.js, Express, MongoDB, Mongoose
-- **Payments:** Razorpay
-- **Image Storage:** Cloudinary
-
----
-
-## Folder Structure
-
-```
-Zencommerce/
-  AdminPanel/    # React admin dashboard
-  Backend/       # Node.js/Express API
-  Frontend/      # React Native (Expo) app
-```
-
----
-
-## Setup Instructions
-
-### Prerequisites
-
-- Node.js & npm
-- MongoDB
-- Expo CLI (`npm install -g expo-cli`)
-
-### 1. Backend
-
-```bash
-cd Backend
-npm install
-# Set up .env with your MongoDB URI, Razorpay keys, Cloudinary keys
-npm start
-```
-
-### 2. Admin Panel
-
-```bash
-cd AdminPanel
-npm install
-npm run dev
-```
-
-### 3. Frontend (Mobile App)
-
-```bash
-cd Frontend
-npm install
-expo start
-```
-
----
-
-## API & Environment
-
-- Configure environment variables in each folder as needed:
-  - `Backend/.env` for DB, Razorpay, Cloudinary
-  - `Frontend/context/authContext.js` for API base URL
-
----
+# 🛒 Zencommerce 
+<!-- ![Zencommerce Logo](https://res.cloudinary.com/dg1wavm3u/image/upload/v1753352208/zencommerce_logo_jyhhkt.png) -->
+
+## 📋 Overview
+
+**Zencommerce** is a comprehensive full-stack e-commerce platform designed for modern retail businesses. The platform consists of three integrated components:
+
+- **📱 Mobile Customer App** - React Native/Expo cross-platform mobile application
+- **🖥️ Admin Dashboard** - React-based web admin panel for business management
+- **⚙️ Backend API** - Node.js/Express RESTful API with MongoDB database
+- **💳 Payment Integration** - Razorpay gateway supporting multiple payment methods
+
+## ✨ Key Features
+
+### 🛍️ Customer Features
+- **Multi-platform Support** - Native Android and iOS apps via Expo
+- **Social Authentication** - Email, Google, and Facebook login options
+- **Product Discovery** - Advanced search, filtering, and categorization
+- **Shopping Experience** - Cart management, wishlist, product variants
+- **Secure Payments** - Razorpay integration (UPI, cards, wallets, net banking)
+- **Order Management** - Real-time order tracking and history
+- **Push Notifications** - Firebase-powered notifications for order updates
+
+### 👨‍💼 Admin Features
+- **Product Management** - Complete CRUD operations with image uploads
+- **Order Processing** - Order tracking and status management
+- **Inventory Control** - Real-time stock management with variants
+- **Analytics Dashboard** - Business insights and performance metrics
+- **Image Management** - Cloudinary integration for optimized image storage
+
+### 🔧 Technical Features
+- **JWT Authentication** - Secure token-based authentication system
+- **RESTful API** - Well-structured API endpoints for all operations
+- **Database Design** - Optimized MongoDB schemas for scalability
+- **Cloud Storage** - Cloudinary for image optimization and CDN
+- **Responsive Design** - Mobile-first UI/UX across all platforms
+- **Email Notifications** - Automated email system for user communications
+
+---
+
+## Screenshots
+
+### 📱 Android App
+
+<p align="center">
+  <img src="https://www.dropbox.com/scl/fi/31be4mrmqo6t0ptgap7a7/Screenshot_2025-07-24-12-39-54-462_com.ramvarma01.Frontend.jpg?rlkey=80tci30c1we373matbmq6ylxd&raw=1" width="150" />
+  <img src="https://www.dropbox.com/scl/fi/i16wc4ie5izisqpqhd44p/Screenshot_2025-07-24-12-39-50-180_com.ramvarma01.Frontend.jpg?rlkey=sw6w4akixmcfeagl50nwbxnq7&raw=1" width="150" />
+  <img src="https://www.dropbox.com/scl/fi/jyww8eax0he7itmbmn30w/Screenshot_2025-07-24-12-39-47-063_com.ramvarma01.Frontend.jpg?rlkey=1ueoeo3cro2m45kclxjuno6cc&raw=1" width="150" />
+   <img src="https://www.dropbox.com/scl/fi/9lxckfn77vcnhr1roko7m/Screenshot_2025-07-24-12-39-29-783_com.ramvarma01.Frontend.jpg?rlkey=vqo6u1031wrxgwc8ytqv2u9uy&raw=1" width="150" />
+  <img src="https://www.dropbox.com/scl/fi/jskg846uadfiufm0s44r6/Screenshot_2025-07-24-12-38-04-280_com.ramvarma01.Frontend.jpg?rlkey=euxtyrp3nuv6i9bl1ep5337h7&raw=1" width="150" />
+</p>
+
+<p align="center">
+ 
+  <img src="https://www.dropbox.com/scl/fi/9tg0utmou1yjzhorgss89/Screenshot_2025-07-24-12-37-55-425_com.ramvarma01.Frontend.jpg?rlkey=cx0c8kwzqfou79lhv7hurmc7x&raw=1" width="150" />
+   <img src="https://www.dropbox.com/scl/fi/yxdzspornn3srruws7hpl/Screenshot_2025-07-24-12-37-46-397_com.ramvarma01.Frontend.jpg?rlkey=bx3t2jh5a2r47gvtg30teysvl&raw=1" width="150" />
+  <img src="https://www.dropbox.com/scl/fi/oxr08zv4kot8b34r3b9el/Screenshot_2025-07-24-12-37-36-228_com.ramvarma01.Frontend.jpg?rlkey=8b4q2pumvje54vwomw0s8eka2&raw=1" width="150" />
+  <img src="https://www.dropbox.com/scl/fi/pl4akmjqiehe6c5fgqln6/Screenshot_2025-07-24-12-37-27-302_com.ramvarma01.Frontend.jpg?rlkey=lb24qkaapjvb9k3b8ywfxk9dq&raw=1" width="150" />
+    <img src="https://www.dropbox.com/scl/fi/ybnzu5i0phbdwrvwxg2y8/Screenshot_2025-07-24-12-37-02-427_com.ramvarma01.Frontend.jpg?rlkey=50na779phlmuzo1zxi1bxf9ln&raw=1" width="150" />
+</p>
+
+<p align="center">
+ <img src="https://www.dropbox.com/scl/fi/79l52rotm3m1rk4mefqek/Screenshot_2025-07-24-12-36-52-984_com.ramvarma01.Frontend.jpg?rlkey=yme69440gc8anyjte6a2kadoo&raw=1" width="150" />
+  <img src="https://www.dropbox.com/scl/fi/2aousaonm6p9b6h5bz4r2/Screenshot_2025-07-24-12-36-45-555_com.ramvarma01.Frontend.jpg?rlkey=ak3vbomx0gvof4isq0edo4trg&raw=1" width="150" />
+  <img src="https://www.dropbox.com/scl/fi/i0jajhdufvc7a8pp0nhaf/Screenshot_2025-07-24-12-36-28-295_com.ramvarma01.Frontend.jpg?rlkey=co9gwqgei8xofb3737oi4ovy8&raw=1" width="150" />
+  <img src="https://www.dropbox.com/scl/fi/104gisear3n0i5gm3ga4z/Screenshot_2025-07-24-12-36-14-236_com.ramvarma01.Frontend.jpg?rlkey=yehi5i6vmsmk4o4wbar236o1s&raw=1" width="150" />
+  <img src="https://www.dropbox.com/scl/fi/hk158fpu1162nn9nnk945/Screenshot_2025-07-24-12-36-08-290_com.ramvarma01.Frontend.jpg?rlkey=21djkpywoymjcp25re4jn6jms&raw=1" width="150" />
+</p>
+
+
+---
+
+### 🖥️ Admin Panel
+
+<p align="center">
+  <img src="https://www.dropbox.com/scl/fi/8oplw3vvlawwu3r4y5ry4/Screenshot-2025-07-24-123526.png?rlkey=iujb0r7ukm7sdmlsrj2x1byh9&raw=1" width="250" />
+  <img src="https://www.dropbox.com/scl/fi/z5owgd6n40pvdcdpblg7h/Screenshot-2025-07-24-123513.png?rlkey=kqaq0voqxj0jboheu033ol6oa&raw=1" width="250" />
+  <img src="https://www.dropbox.com/scl/fi/fhe5r94jt7t5fap2vxmvw/Screenshot-2025-07-24-123500.png?rlkey=6x8bphs0iz05b03pr71p749xo&raw=1" width="250" />
+</p>
+
+<p align="center">
+  <img src="https://www.dropbox.com/scl/fi/36d4vxbxaqz8dw3eg5he1/Screenshot-2025-07-24-123440.png?rlkey=5qqchykud9pwai3nhmqnanw0q&raw=1" width="250" />
+  <img src="https://www.dropbox.com/scl/fi/gfluveo0rxo3tre5110n9/Screenshot-2025-07-24-123430.png?rlkey=o7hd1rns82rbfzoecksfvtcii&raw=1" width="250" />
+  <img src="https://www.dropbox.com/scl/fi/lfav1opmjxx8y3cdhv6ly/Screenshot-2025-07-24-123411.png?rlkey=omrt1qat8wcbl8ggb8ud32x5w&raw=1" width="250" />
+</p>
+
+<p align="center">
+  <img src="https://www.dropbox.com/scl/fi/7pm3j9732bjp2amgf9f71/Screenshot-2025-07-24-123356.png?rlkey=6wse57u6ap9rxjlkwnhuvu939&raw=1" width="250" />
+  <img src="https://www.dropbox.com/scl/fi/sj2to0wwpx07gfv2g0j4w/Screenshot-2025-07-24-123318.png?rlkey=wexe13ogqpscm50vmmne3vkb2&raw=1" width="250" />
+</p>
+
+Or use your Dropbox images, e.g.:
+![Dropbox Image](https://www.dropbox.com/scl/fi/your-image-path/image.jpg?rlkey=yr7h232jqy3lqd22413jo9d2e&raw=1)
+
+---
+
+## 🏗️ Architecture & Tech Stack
+
+### 📱 Mobile App (Frontend)
+- **Framework:** React Native 0.79.4 with Expo 53.0.12
+- **Navigation:** Expo Router with tab-based navigation
+- **State Management:** React Context API
+- **Authentication:** JWT tokens, Google OAuth, Facebook OAuth
+- **HTTP Client:** Axios for API communication
+- **Push Notifications:** Expo Notifications with Firebase
+- **Payments:** React Native Razorpay integration
+
+### 🖥️ Admin Panel
+- **Framework:** React 19 with Vite build tool
+- **UI Library:** Material-UI (MUI) for modern design
+- **Routing:** React Router DOM
+- **Styling:** CSS with Material Design components
+- **HTTP Client:** Axios for API communication
+
+### ⚙️ Backend API
+- **Runtime:** Node.js with Express.js framework
+- **Database:** MongoDB with Mongoose ODM
+- **Authentication:** JWT, bcrypt for password hashing
+- **File Upload:** Multer with Cloudinary storage
+- **Email Service:** Nodemailer for notifications
+- **Payment Gateway:** Razorpay SDK
+- **Logging:** Morgan for request logging
+
+### 🗄️ Database Schema
+- **Users:** Authentication, profiles, addresses, cart, wishlist
+- **Products:** Catalog with variants, images, inventory
+- **Orders:** Transaction records with payment and shipping details
+
+### ☁️ Third-Party Services
+- **Cloudinary:** Image storage, optimization, and CDN
+- **Razorpay:** Payment processing (UPI, cards, wallets, net banking)
+- **Firebase:** Push notifications and analytics
+- **Google/Facebook APIs:** Social authentication
+
+---
+
+## 📁 Project Structure
+
+```
+Zencommerce/
+├── 📱 Frontend/                    # React Native Mobile App
+│   ├── app/                       # Expo Router screens
+│   │   ├── (tabs)/               # Tab navigation screens
+│   │   │   ├── index.js          # Home screen
+│   │   │   ├── search.js         # Product search
+│   │   │   ├── cart.js           # Shopping cart
+│   │   │   └── wishlist.js       # User wishlist
+│   │   ├── (profile)/            # Profile screens
+│   │   ├── login.js              # Authentication
+│   │   ├── register.js           # User registration
+│   │   └── product/              # Product details
+│   ├── context/                  # React Context providers
+│   ├── assets/                   # Images and static files
+│   └── android/                  # Android-specific files
+│
+├── 🖥️ AdminPanel/                 # React Web Admin Dashboard
+│   ├── src/
+│   │   ├── pages/               # Admin pages
+│   │   │   ├── Dashboard.jsx    # Analytics dashboard
+│   │   │   ├── Products.jsx     # Product management
+│   │   │   ├── AddProduct.jsx   # Add new products
+│   │   │   ├── EditProduct.jsx  # Edit products
+│   │   │   ├── Orders.jsx       # Order management
+│   │   │   └── Login.jsx        # Admin authentication
+│   │   ├── components/          # Reusable components
+│   │   └── context/             # Admin context providers
+│
+└── ⚙️ Backend/                    # Node.js Express API
+    ├── models/                   # MongoDB schemas
+    │   ├── Users.js             # User model
+    │   ├── Products.js          # Product model
+    │   └── Orders.js            # Order model
+    ├── controllers/             # Business logic
+    │   ├── UserController.js    # User operations
+    │   ├── ProductController.js # Product operations
+    │   └── OrderController.js   # Order operations
+    ├── routes/                  # API endpoints
+    │   ├── UserRoutes.js        # User routes
+    │   ├── ProductRoutes.js     # Product routes
+    │   └── OrderRoutes.js       # Order routes
+    ├── services/                # External service integrations
+    ├── configDB.js              # Database configuration
+    ├── configCloudinary.js      # Image storage config
+    └── index.js                 # Server entry point
+```
+
+---
+
+## 🚀 Quick Start Guide
+
+### 📋 Prerequisites
+
+- **Node.js** (v16 or higher) & npm
+- **MongoDB** (local or cloud instance)
+- **Expo CLI** (`npm install -g @expo/cli`)
+- **Cloudinary Account** (for image storage)
+- **Razorpay Account** (for payments)
+- **Firebase Project** (for push notifications)
+
+### ⚙️ Backend Setup
+
+```bash
+cd Backend
+npm install
+
+# Create .env file with the following variables:
+# MONGO_URL=your_mongodb_connection_string
+# JWT_SECRET=your_jwt_secret_key
+# CLOUD_NAME=your_cloudinary_cloud_name
+# API_KEY=your_cloudinary_api_key
+# API_SECRET=your_cloudinary_api_secret
+# RAZORPAY_KEY_ID=your_razorpay_key_id
+# RAZORPAY_KEY_SECRET=your_razorpay_key_secret
+# EMAIL_HOST=your_email_host
+# EMAIL_PORT=your_email_port
+# EMAIL_USER=your_email_username
+# EMAIL_PASS=your_email_password
+
+npm start
+# Server will start on http://localhost:8080
+```
+
+### 🖥️ Admin Panel Setup
+
+```bash
+cd AdminPanel
+npm install
+npm run dev
+# Admin panel will start on http://localhost:5173
+```
+
+### 📱 Mobile App Setup
+
+```bash
+cd Frontend
+npm install
+
+# Update API base URL in context/authContext.js
+# Set your backend URL (default: https://zencommerce.onrender.com)
+
+expo start
+# Follow Expo CLI instructions to run on device/emulator
+```
+
+---
+
+## 🔧 Configuration Guide
+
+### 🗄️ Database Configuration
+- Set up MongoDB Atlas or local MongoDB instance
+- Update `MONGO_URL` in Backend/.env
+
+### 🖼️ Image Storage (Cloudinary)
+- Create Cloudinary account
+- Get cloud name, API key, and API secret
+- Update Backend/.env with Cloudinary credentials
+
+### 💳 Payment Gateway (Razorpay)
+- Create Razorpay account
+- Get key ID and key secret from dashboard
+- Update Backend/.env with Razorpay credentials
+
+### 🔔 Push Notifications (Firebase)
+- Create Firebase project
+- Download google-services.json for Android
+- Place in Frontend/android/app/ directory
+- Configure Firebase in your project
+
+### 📧 Email Configuration
+- Set up email service (Gmail, SendGrid, etc.)
+- Update email credentials in Backend/.env
+
+---
+
+## 🌐 API Endpoints
+
+### 👤 User Routes
+- `POST /register` - User registration
+- `POST /login` - User authentication
+- `POST /google-auth` - Google OAuth
+- `POST /facebook-auth` - Facebook OAuth
+- `GET /profile` - Get user profile
+- `PUT /profile` - Update user profile
+- `POST /forgot-password` - Password reset request
+- `POST /reset-password` - Reset password with OTP
+
+### 🛍️ Product Routes
+- `GET /products` - Get all products
+- `GET /products/:id` - Get single product
+- `POST /products` - Create product (Admin)
+- `PUT /products/:id` - Update product (Admin)
+- `DELETE /products/:id` - Delete product (Admin)
+- `GET /products/search` - Search products
+
+### 📦 Order Routes
+- `POST /orders` - Create new order
+- `GET /orders` - Get user orders
+- `GET /orders/:id` - Get single order
+- `PUT /orders/:id/status` - Update order status (Admin)
+- `POST /payment/verify` - Verify Razorpay payment
+
+---
+
+## 📱 Mobile App Features
+
+### 🏠 Home Screen
+- Featured products showcase
+- Category-based product browsing
+- New arrivals section
+- Search functionality
+
+### 🔍 Product Discovery
+- Advanced search with filters
+- Category-based navigation
+- Product variants support
+- High-quality image gallery
+
+### 🛒 Shopping Experience
+- Add to cart with quantity selection
+- Wishlist for saving products
+- Secure checkout process
+- Multiple payment options
+
+### 👤 User Management
+- Social login integration
+- Profile management
+- Multiple shipping addresses
+- Order history and tracking
+
+---
+
+## 🎯 Business Use Cases
+
+### 🏪 Retail Businesses
+- Fashion and apparel stores
+- Electronics and gadgets
+- Home and lifestyle products
+- Beauty and cosmetics
+
+### 🛍️ E-commerce Features
+- Multi-vendor support (with customization)
+- Inventory management
+- Order fulfillment
+- Customer relationship management
+
+### 📊 Analytics & Insights
+- Sales performance tracking
+- Customer behavior analysis
+- Inventory optimization
+- Revenue analytics
+
+---
+
+## 🚀 Deployment
+
+### 🌐 Production Deployment
+- **Backend:** Deploy to Render, Heroku, or AWS
+- **Admin Panel:** Deploy to Netlify, Vercel, or any static hosting
+- **Mobile App:** Build with `expo build` for app stores
+
+### 📱 Mobile App Distribution
+- **Android:** Build APK or AAB for Google Play Store
+- **iOS:** Build IPA for Apple App Store (requires Apple Developer account)
+- **Web:** Deploy as PWA using `expo build:web`
+
+---
+
+## 🤝 Contributing
+
+1. Fork the repository
+2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
+3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
+4. Push to the branch (`git push origin feature/AmazingFeature`)
+5. Open a Pull Request
+
+---
+
+## 📄 License
+
+This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
+
+---
+
+## 📞 Support
+
+For support and questions:
+- Create an issue in the GitHub repository
+- Contact the development team
+- Check the documentation for troubleshooting guides
+
+---
+
+## 🙏 Acknowledgments
+
+- **Expo Team** for the amazing React Native framework
+- **MongoDB** for the flexible database solution
+- **Razorpay** for seamless payment integration
+- **Cloudinary** for image management services
+- **Material-UI** for beautiful React components
+
+---
+
+
EOF
)