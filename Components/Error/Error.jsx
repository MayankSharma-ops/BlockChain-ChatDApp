import React, { useContext } from "react";

// INTERNAL IMPORT
import Style from "./Error.module.css";
import { ChatAppContext } from "../../Context/ChatAppContext";

const Error = () => {
  const { error, clearError } = useContext(ChatAppContext);

  if (!error) return null; // ✅ Don't show if no error

  return (
    <div className={Style.Error}>
      <div className={Style.Error_box}>
        
        {/* CLOSE BUTTON */}
        <button
          className={Style.closeBtn}
          onClick={clearError}
        >
          ✕
        </button>

        <h1>Something went wrong</h1>

        <p>{error}</p>
      </div>
    </div>
  );
};

export default Error;