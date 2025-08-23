import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <CloseIcon></CloseIcon>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 