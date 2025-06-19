import React, { useEffect, useReducer } from "react";
import COMMON_WORDS from "./5-letter-words.json";
import GameBoard from "./components/GameBoard";
import KeyBoard from "./components/KeyBoard";
import Modal from "./components/Modal";

const NO_OF_LETTERS = 5;
const NO_OF_CHANCES = 6;
const MESSAGE = {
  success: 1,
  failure: 0,
};
export const ACTIONS = {
  ADD_LETTER: "add-letter",
  REMOVE_LETTER: "remove-letter",
  SUBMIT_WORD: "submit-word",
  REPLAY: "replay",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_LETTER:
      return {
        ...state,
        submitted: false,
        isDictionaryWord: true,
        guessedWords: addLetter(
          state.guessedWords,
          state.currentRowIndex,
          payload.key
        ),
      };

    case ACTIONS.REMOVE_LETTER:
      return {
        ...state,
        isDictionaryWord: true,
        guessedWords: removeLetter(state.guessedWords, state.currentRowIndex),
      };

    case ACTIONS.SUBMIT_WORD:
      const currentRow = state.guessedWords[state.currentRowIndex];
      // if guessed word is less than 5 letters
      if (currentRow.includes("")) return state;
      // if guessed word is not a dictionary word
      if (!COMMON_WORDS.includes(currentRow.join("")))
        return {
          ...state,
          isDictionaryWord: false,
        };
      // if guessed word is correct
      if (currentRow.join("") === state.wordToGuess)
        return {
          ...state,
          guessedWords: clearWords(NO_OF_CHANCES, NO_OF_LETTERS),
          submitted: false,
          isDictionaryWord: true,
          isCorrect: true,
          replay: true,
          chanceLeft: NO_OF_CHANCES,
          currentRowIndex: 0,
        };
      // if guessed word is already guessed
      if (duplicateWord(state.guessedWords, state.currentRowIndex))
        return state;

      return {
        ...state,
        isDictionaryWord: true,
        submitted: true,
        replay: state.chanceLeft > 0 ? false : true,
        chanceLeft: state.chanceLeft > 0 ? state.chanceLeft - 1 : 0,
        currentRowIndex:
          state.currentRowIndex < NO_OF_CHANCES - 1
            ? state.currentRowIndex + 1
            : state.currentRowIndex,
      };

    case ACTIONS.REPLAY:
      return {
        ...state,
        wordToGuess: getRandomWord(),
        guessedWords: clearWords(NO_OF_CHANCES, NO_OF_LETTERS),
        submitted: false,
        isDictionaryWord: true,
        isCorrect: false,
        replay: true,
        chanceLeft: NO_OF_CHANCES,
        currentRowIndex: 0,
      };
  }
}

function getRandomWord() {
  return COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
}

function addLetter(wordsArray, currentRowIndex, letter) {
  const currentRow = wordsArray[currentRowIndex];
  // If current row is not empty
  if (!currentRow.includes("")) return wordsArray;
  const emptyIndex = currentRow.findIndex((e) => e === "");
  currentRow[emptyIndex] = letter;
  wordsArray[currentRowIndex] = currentRow;
  return wordsArray;
}

function removeLetter(wordArray, currentRowIndex) {
  const currentRow = wordArray[currentRowIndex];
  // If no empty string
  if (!currentRow.includes("")) {
    currentRow[currentRow.length - 1] = "";
  } else {
    // If all empty string
    if (!(currentRow.filter((e) => e === "").length === NO_OF_LETTERS)) {
      const replacableIndex = currentRow.findIndex((e) => e === "") - 1;
      currentRow[replacableIndex] = "";
    }
  }
  wordArray[currentRowIndex] = currentRow;
  return wordArray;
}

function duplicateWord(wordsArray, currentRowIndex) {
  const currentWord = wordsArray[currentRowIndex].join("");
  const guessedWords = wordsArray.map((word) => word.join(""));
  if (guessedWords.filter((word) => word === currentWord).length < 2)
    return false;
  return true;
}

function clearWords(NO_OF_CHANCES, NO_OF_LETTERS) {
  return new Array(NO_OF_CHANCES)
    .fill(null)
    .map(() => new Array(NO_OF_LETTERS).fill(""));
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    wordToGuess: getRandomWord(),
    guessedWords: clearWords(NO_OF_CHANCES, NO_OF_LETTERS),
    isDictionaryWord: true,
    isCorrect: false,
    submitted: false,
    chanceLeft: NO_OF_CHANCES,
    currentRowIndex: 0,
    replay: false,
  });

  useEffect(() => {
    const handler = (event) => {
      const { key } = event;
      event.preventDefault();

      if (key === "Backspace") dispatch({ type: ACTIONS.REMOVE_LETTER });
      if (key === "Enter") dispatch({ type: ACTIONS.SUBMIT_WORD });
      if (!key.match(/^[a-z]$/)) return;
      dispatch({ type: ACTIONS.ADD_LETTER, payload: { key } });
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="container">
      <h1 onClick={() => console.log(state)}>WORDLE UNLIMITED</h1>
      <GameBoard
        guessedWords={state.guessedWords}
        wordToGuess={state.wordToGuess}
        isDictionaryWord={state.isDictionaryWord}
        submitted={state.submitted}
        replay={state.replay}
      />
      {state.isCorrect && (
        <Modal
          dispatch={dispatch}
          wordToGuess={state.wordToGuess}
          message={MESSAGE.success}
        />
      )}
      {state.chanceLeft === 0 && (
        <Modal
          dispatch={dispatch}
          wordToGuess={state.wordToGuess}
          message={MESSAGE.failure}
        />
      )}
      <KeyBoard
        dispatch={dispatch}
        guessedWords={state.guessedWords}
        wordToGuess={state.wordToGuess}
        replay={state.replay}
        submitted={state.submitted}
      />
    </div>
  );
}

export default App;
