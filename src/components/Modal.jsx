import React from "react";
import { ACTIONS } from "../App";

function Modal({ dispatch, wordToGuess, message }) {
  return (
    <div className="modal">
      <div className="modal-card">
        <span
          className="heading"
          style={{ color: `${message ? "lightgreen" : "red"}` }}
        >
          {message
            ? "Bravo! You guessed the correct word"
            : "Opps! Better luck next time"}
        </span>
        <div className="correct-word row">
          {wordToGuess.split("").map((letter, index) => (
            <div key={index} className="tile">
              {letter}
            </div>
          ))}
        </div>
        <button
          className="btn--play"
          onClick={() => dispatch({ type: ACTIONS.REPLAY })}
        >
          play
        </button>
      </div>
    </div>
  );
}

export default Modal;
