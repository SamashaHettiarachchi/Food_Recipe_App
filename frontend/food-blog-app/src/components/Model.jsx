import React from "react";
import "./Model.css";

function Model({ children, setIsOpen }) {
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="backdrop" onClick={closeModal}> </div>
      <dialog className="model" open onClick={(e) => e.stopPropagation()}>
        {children}
      </dialog>
    </>
  );
}

export default Model;
