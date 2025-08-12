import React from "react";
import "./Model.css";

function Model({ children, setIsOpen }) {
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="backdrop" onClick={closeModal}>
        <div className="model" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </>
  );
}

export default Model;
