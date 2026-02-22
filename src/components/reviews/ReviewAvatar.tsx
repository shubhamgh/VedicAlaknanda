
import React from "react";

interface ReviewAvatarProps {
  name: string;
  image?: string | null;
  gender?: string | null;
}

const ReviewAvatar = ({ name, image, gender }: ReviewAvatarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const getAvatarBackgroundColor = (gender: string | null) => {
    switch (gender) {
      case "female":
        return "bg-pink-500";
      case "male":
        return "bg-blue-500";
      default:
        return "bg-purple-500";
    }
  };

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-20 h-20 rounded-full mb-4 object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            const initialsDiv = document.createElement("div");
            initialsDiv.className = `w-20 h-20 rounded-full mb-4 flex items-center justify-center text-white font-bold text-xl ${getAvatarBackgroundColor(
              gender
            )}`;
            initialsDiv.textContent = getInitials(name);
            parent.insertBefore(initialsDiv, target);
          }
        }}
      />
    );
  }

  return (
    <div
      className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center text-white font-bold text-xl ${getAvatarBackgroundColor(
        gender
      )}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default ReviewAvatar;
