import React, { useEffect, useState } from "react";
import { ACTIONS } from "../App";

const KEYS = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
];

function KeyBoard({ guessedWords, wordToGuess, replay, submitted, dispatch }) {
  const [keyClasses, setKeyClasses] = useState({});
  function getStyledClassName(guessedWords, key, wordToGuess) {
    const submittedWords = guessedWords.filter((word) => !word.includes(""));
    const wordLetters = wordToGuess.split("");

    if (submittedWords.flat().includes(key) && !wordLetters.includes(key))
      return "letter-not-included";

    const commonLetters = submittedWords
      .map((word) => {
        return word.filter((letter, index) => wordLetters[index] === letter);
      })
      .flat();
    if (commonLetters.includes(key)) return "letter-included position-right";

    if (submittedWords.flat().includes(key) && wordLetters.includes(key))
      return "letter-included";

    return "";
  }

  useEffect(() => {
    if (submitted) {
      const updated = {};
      KEYS.forEach((key) => {
        updated[key] = getStyledClassName(guessedWords, key, wordToGuess);
      });
      setKeyClasses((prev) => ({ ...prev, ...updated }));
    }
  }, [submitted, guessedWords, wordToGuess, replay]);

  useEffect(() => {
    if (replay) {
      setKeyClasses({});
    }
  }, [replay]);

  return (
    <div className="keyboard">
      {KEYS.map((key) => (
        <button
          key={key}
          className={`key ${keyClasses[key] || ""}`}
          onClick={() =>
            dispatch({
              type: ACTIONS.ADD_LETTER,
              payload: { key },
            })
          }
        >
          {key}
        </button>
      ))}
      <button
        className="key"
        onClick={() => dispatch({ type: ACTIONS.REMOVE_LETTER })}
      >
        delete
      </button>
      <button
        className="key"
        onClick={() => dispatch({ type: ACTIONS.SUBMIT_WORD })}
      >
        enter
      </button>
    </div>
  );
}

export default KeyBoard;
