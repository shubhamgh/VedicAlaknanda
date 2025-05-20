// Contact.jsx
import React from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/" className="text-blue-600 underline mb-4">
        <a
          href="/book-now"
          className="bg-hotel-gold hover:bg-opacity-90 text-white py-3 px-8 text-base uppercase tracking-wider font-medium transition-all"
        >
          Home Page
        </a>
        <img
          className="w-full mb-4"
          src="https://i.etsystatic.com/5187628/r/il/35fd3e/4480464557/il_fullxfull.4480464557_c01n.jpg"
          alt="Under Construction"
        />
      </Link>

      <h1 className="text-3xl font-bold mb-4">UNDER DEVELOPMENT</h1>
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg mb-2">
        <strong>Address:</strong> Narkota, near Rudraprayag, Uttarakhand
      </p>
      <p className="text-lg mb-2">
        <strong>Phone:</strong> +91-9815812309
      </p>
      <p className="text-lg mb-2">
        <strong>Email:</strong>{" "}
        <a
          href="mailto:vedicalaknanda@gmail.com"
          className="text-blue-600 underline"
        >
          VedicAlaknanda@gmail.com
        </a>
      </p>
    </div>
  );
};

export default Contact;
