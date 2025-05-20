// Contact.jsx
import React from "react";

const Contact = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg mb-2">
        <strong>Address:</strong> Narkota, near Rudraprayag, Uttarakhand
      </p>
      <p className="text-lg mb-2">
        <strong>Phone:</strong> +91-XXXXXXXXXX
      </p>
      <p className="text-lg mb-2">
        <strong>Email:</strong>{" "}
        <a href="mailto:hotelxyz@gmail.com" className="text-blue-600 underline">
          hotelxyz@gmail.com
        </a>
      </p>
    </div>
  );
};

export default Contact;
