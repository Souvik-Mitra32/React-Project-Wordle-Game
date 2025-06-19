import React, { useEffect, useState } from "react";
import WordRow from "./WordRow";

function GameBoard({
  guessedWords,
  wordToGuess,
  isDictionaryWord,
  submitted,
  replay,
}) {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!isDictionaryWord) {
      setShowAlert(true);
      const timeout = setTimeout(() => setShowAlert(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [isDictionaryWord]);

  return (
    <div className="game-board">
      {showAlert && (
        <div className="alert-box">
          <span className="alert">not in word lists</span>
        </div>
      )}

      {guessedWords.map((word, index) => (
        <WordRow
          key={index}
          guessedWord={word}
          wordToGuess={wordToGuess}
          submitted={submitted}
          replay={replay}
        />
      ))}
    </div>
  );
}

export default GameBoard;
