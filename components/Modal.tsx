import React, { Children, useEffect, useState } from 'react';

//modalOpen the state determining whether the modal is open or not
//closeModal: a function to close the modal
//children: whats inside the modal wrapper
interface modalProps {
  isOpen: boolean,
  setIsOpen: any,
  children: any,
}

export default function Modal({ isOpen, setIsOpen, children }: modalProps) {

  // useEffect(() => {
  //   const handleEscape = (event: any) => {
  //     if (event.key === "Escape") {
  //       setIsOpen(false)
  //     }
  //   };

  //   const handleOutsideClick = (event: any) => {
  //     if (!event.target.closest(".modal-container")) {
  //       setIsOpen(false);
  //     }
  //   };

  //   window.addEventListener("keydown", handleEscape);
  //   window.addEventListener("mousedown", handleOutsideClick);

  //   return () => {
  //     window.removeEventListener("keydown", handleEscape);
  //     window.removeEventListener("mousedown", handleOutsideClick);
  //   };
  // }, []);

  return (
    <>
      {isOpen &&
        <div
          style={{position: 'fixed', zIndex: 9999, left: 0, top: 0, width: '100%', height: '100%', backgroundColor: "rgba(0,0,0,0.5)", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        >
          <div className="modal-container" style={{backgroundColor: "#222", marginLeft: 'auto', marginRight: 'auto', padding: "30px 50px", position: 'relative', borderRadius: "20px", maxHeight: "90vh", display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'column'}}>
            {children}
          </div>
        </div>
      }
    </>
  )
}