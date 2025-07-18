'use client'
import { NextPage } from 'next';
import React, { useState, useEffect } from 'react';

const COLORS = ['Red', 'Green', 'Blue', 'Yellow', 'Orange', 'Purple'] as const;
type Color = typeof COLORS[number];

type Guess = Color[];
type Feedback = { black: number; white: number };

const generateSecret = (length: number): Guess => {
  const secret: Guess = [];
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * COLORS.length);
    secret.push(COLORS[idx]);
  }
  return secret;
};

const calculateFeedback = (secret: Guess, guess: Guess): Feedback => {
  let black = 0;
  let white = 0;
  const secretCopy = [...secret];
  const guessCopy = [...guess];

  // Count black pegs (correct color & position)
  for (let i = guessCopy.length - 1; i >= 0; i--) {
    if (guessCopy[i] === secretCopy[i]) {
      black++;
      guessCopy.splice(i, 1);
      secretCopy.splice(i, 1);
    }
  }

  // Count white pegs (correct color, wrong position)
  guessCopy.forEach((g) => {
    const idx = secretCopy.indexOf(g);
    if (idx !== -1) {
      white++;
      secretCopy.splice(idx, 1);
    }
  });

  return { black, white };
};

const Mastermind: NextPage = () => {
  const CODE_LENGTH = 4;
  const MAX_TURNS = 10;
  const [secret, setSecret] = useState<Guess>([]);
  const [currentGuess, setCurrentGuess] = useState<Guess>(Array(CODE_LENGTH).fill(COLORS[0]));
  const [history, setHistory] = useState<{ guess: Guess; feedback: Feedback }[]>([]);
  const [won, setWon] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setSecret(generateSecret(CODE_LENGTH));
    setHistory([]);
    setWon(false);
    setCurrentGuess(Array(CODE_LENGTH).fill(COLORS[0]));
  };

  const handleColorChange = (position: number, color: Color) => {
    const newGuess = [...currentGuess] as Guess;
    newGuess[position] = color;
    setCurrentGuess(newGuess);
  };

  const handleSubmit = () => {
    if (won || history.length >= MAX_TURNS) return;
    const feedback = calculateFeedback(secret, currentGuess);
    const newHistory = [...history, { guess: [...currentGuess], feedback }];
    setHistory(newHistory);
    if (feedback.black === CODE_LENGTH) {
      setWon(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Mastermind Game</h1>
      <div className="w-full max-w-md">
        {history.map((entry, idx) => (
          <div key={idx} className="flex items-center mb-2">
            {entry.guess.map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 mr-1 rounded-full"
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
            <span className="ml-auto text-sm">
              Black: {entry.feedback.black}, White: {entry.feedback.white}
            </span>
          </div>
        ))}

        {won && <div className="text-green-600 font-semibold mb-2">You cracked the code!</div>}
        {!won && history.length >= MAX_TURNS && (
          <div className="text-red-600 font-semibold mb-2">
            Game Over! The code was {secret.join(', ')}.
          </div>
        )}

        {!won && history.length < MAX_TURNS && (
          <div className="flex mb-4">
            {currentGuess.map((color, pos) => (
              <select
                key={pos}
                value={color}
                onChange={(e) => handleColorChange(pos, e.target.value as Color)}
                className="flex-1 p-1 m-1 border rounded"
              >
                {COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            ))}
            <button
              onClick={handleSubmit}
              className="ml-2 p-2 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={won}
            >
              Guess
            </button>
          </div>
        )}

        <button onClick={resetGame} className="mt-2 p-2 bg-gray-700 text-white rounded">
          Reset
        </button>
      </div>
    </div>
  );
};

export default Mastermind;
