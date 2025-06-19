import React, { useEffect, useState } from "react";

function WordRow({ guessedWord, wordToGuess, submitted, replay }) {
  const [tileClasses, setTileClasses] = useState({});
  function getStyledClassName(guessedWord, letter, index, wordToGuess) {
    if (letter === "") return "";
    if (!wordToGuess.includes(letter)) return "letter-not-included";
    if (guessedWord[index] === wordToGuess[index])
      return "letter-included position-right";

    return "letter-included";
  }

  useEffect(() => {
    if (submitted) {
      const updated = {};
      guessedWord.forEach((letter, index) => {
        updated[index] = getStyledClassName(
          guessedWord,
          letter,
          index,
          wordToGuess
        );
      });
      setTileClasses((prev) => ({ ...prev, ...updated }));
    }
  }, [submitted]);

  useEffect(() => {
    if (replay) {
      setTileClasses({});
    }
  }, [replay]);

  return (
    <div className="row">
      {guessedWord.map((letter, index) => (
        <div key={index} className={`tile ${tileClasses[index] || ""}`}>
          {letter}
        </div>
      ))}
    </div>
  );
}

export default WordRow;
