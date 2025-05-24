# Hotel Booking Website 🏨

This is a **full-stack hotel booking web application** built with **ReactJS** and **Supabase**. It powers the actual online presence and booking system for a real hotel located in Uttarakhand, India.

## 🌐 Live Features

- **Frontend** built using **ReactJS**
- **Backend / Database** handled via **Supabase**
- Fully functional **admin portal** with authentication, live room inventory, and booking management
- **Secure login** for administrators
- **Room booking management** including:
  - Guest information entry
  - Room assignment based on availability
  - Live inventory tracking of room status (available/booked)
- Support for **special requests** and tracking **booking sources**

## 📁 Tech Stack

| Layer      | Technology                                                                |
| ---------- | ------------------------------------------------------------------------- |
| Frontend   | ReactJS, TailwindCSS                                                      |
| Backend    | Supabase (PostgreSQL + Auth)                                              |
| Auth       | Supabase Auth                                                             |
| Deployment | Hosted Live ([Hotel Vedic Alaknanda](https://vedicalaknanda.netlify.app)) |

## 📦 Features for Admins

- Secure login and authentication
- View available room inventory by type
- Create, edit, and cancel bookings with guest details
- Track booking sources (e.g., direct, phone, walk-in, website)
- Responsive design for desktop and mobile use

## 🛏️ Room Types

Although 30 rooms exist in the hotel, the public site displays only **3 main room types**, hardcoded into the frontend. The full room-level data is used only in the admin panel to manage booking operations.

Room Types:

- Deluxe Single Room with Balcony
- Standard Family Room
- Family Room with Terrace

## 🔐 Admin Operations

- Admin login system with secure Supabase authentication
- Calendar UI for managing room availability and bookings
- Booking form with room type selection and auto-filtering of available rooms

## 🧱 Database Schema (Simplified)

### `rooms` Table

Stores room inventory used by the admin portal.

- `id`, `number`, `type`, `status`, `created_at`, `updated_at`

### `bookings` Table

Stores all guest booking information.

- `id`, `room_id`, `guest_name`, `guest_email`, `phone`, `check_in`, `check_out`, `adult`, `total_price`, `status`, `special_request`, `address`, `gov_id_number`, `booking_source`

## 📌 Notes

- Only admins can access the backend/admin portal.
- Public users can view room types, but not individual room availability.
- Project is production-ready and actively used by the hotel staff.

---

🧑‍💻 Built with ❤️ using ReactJS + Supabase
