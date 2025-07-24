# Zencommerce 
<!-- ![Zencommerce Logo](https://res.cloudinary.com/dg1wavm3u/image/upload/v1753352208/zencommerce_logo_jyhhkt.png) -->
<p align="center">
  <img src="https://www.dropbox.com/scl/fi/cjyn3ixdqjlyi4yf45hlb/zencommerce_logo.png?rlkey=1r80m0mggosm4wo5dmlx0as3o&raw=1"
       alt="Zencommerce Logo"
       width="80"
       height="80"/>
</p>


## Overview

**Zencommerce** is a full-stack e-commerce platform featuring:
- A mobile-first customer app (React Native/Expo)
- An admin panel (React)
- A Node.js/Express backend with MongoDB
- Razorpay payment integration

---

## Screenshots

### 📱 Android App

<div align="center">
  <img src="https://www.dropbox.com/scl/fi/31be4mrmqo6t0ptgap7a7/Screenshot_2025-07-24-12-39-54-462_com.ramvarma01.Frontend.jpg?rlkey=80tci30c1we373matbmq6ylxd&raw=1" alt="Android Screenshot 1" width="250" style="margin: 10px;" />
  <img src="https://www.dropbox.com/scl/fi/i16wc4ie5izisqpqhd44p/Screenshot_2025-07-24-12-39-50-180_com.ramvarma01.Frontend.jpg?rlkey=sw6w4akixmcfeagl50nwbxnq7&raw=1" alt="Android Screenshot 2" width="250" style="margin: 10px;" />
  <img src="https://www.dropbox.com/scl/fi/jyww8eax0he7itmbmn30w/Screenshot_2025-07-24-12-39-47-063_com.ramvarma01.Frontend.jpg?rlkey=1ueoeo3cro2m45kclxjuno6cc&raw=1" alt="Android Screenshot 3" width="250" style="margin: 10px;" />
</div>

---

### 🖥️ Admin Panel

<!-- Add admin panel screenshots here -->
<!-- Example:
<img src="https://your-image-url.com/admin1.jpg" alt="Admin Panel Screenshot 1" width="300" />
-->

Or use your Dropbox images, e.g.:
![Dropbox Image](https://www.dropbox.com/scl/fi/your-image-path/image.jpg?rlkey=yr7h232jqy3lqd22413jo9d2e&raw=1)

---

## Features

- User authentication (email, Google)
- Product catalog with variants
- Cart, wishlist, and order management
- Razorpay payment gateway (UPI, cards, wallets, netbanking)
- Admin panel for product and order management
- Cloudinary image uploads
- Responsive design

---

## Tech Stack

- **Frontend:** React Native (Expo), React, JavaScript
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Payments:** Razorpay
- **Image Storage:** Cloudinary

---

## Folder Structure

```
Zencommerce/
  AdminPanel/    # React admin dashboard
  Backend/       # Node.js/Express API
  Frontend/      # React Native (Expo) app
```

---

## Setup Instructions

### Prerequisites

- Node.js & npm
- MongoDB
- Expo CLI (`npm install -g expo-cli`)

### 1. Backend

```bash
cd Backend
npm install
# Set up .env with your MongoDB URI, Razorpay keys, Cloudinary keys
npm start
```

### 2. Admin Panel

```bash
cd AdminPanel
npm install
npm run dev
```

### 3. Frontend (Mobile App)

```bash
cd Frontend
npm install
expo start
```

---

## API & Environment

- Configure environment variables in each folder as needed:
  - `Backend/.env` for DB, Razorpay, Cloudinary
  - `Frontend/context/authContext.js` for API base URL

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## License

[MIT](LICENSE)

---

## Credits

- Images and screenshots from [Dropbox folder](https://www.dropbox.com/scl/fo/m9r9wa44yps85g06sdd9b/AMtyk91hlBdEMT5_QJBIGwY?rlkey=yr7h232jqy3lqd22413jo9d2e&dl=0)

---

**How to use Dropbox images:**  
Replace `your-logo-path/logo.png` and `your-image-path/image.jpg` with the actual file paths from your Dropbox folder. To embed Dropbox images in markdown, use the `?raw=1` query at the end of the link.

---
