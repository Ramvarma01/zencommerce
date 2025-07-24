# Zencommerce [Zencommerce Logo](https://res.cloudinary.com/dg1wavm3u/image/upload/v1753352208/zencommerce_logo_jyhhkt.png)



## Overview

**Zencommerce** is a full-stack e-commerce platform featuring:
- A mobile-first customer app (React Native/Expo)
- An admin panel (React)
- A Node.js/Express backend with MongoDB
- Razorpay payment integration

---

## Screenshots

### Customer App

![App Screenshot 1](UI/Screenshot_2025-07-24-12-39-54-462_com.ramvarma01.Frontend.jpg)
![App Screenshot 2](UI/Screenshot_2025-07-24-12-39-50-180_com.ramvarma01.Frontend.jpg)
![App Screenshot 3](UI/Screenshot_2025-07-24-12-39-47-063_com.ramvarma01.Frontend.jpg)
<!-- Add more as needed -->

### Product Images

![Product 1](Data/81qP-BrYCjL._SL1500_.jpg)
![Product 2](Data/81HUSJKoQkL._SL1500_.jpg)
<!-- Add more as needed -->

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
