import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [problem, setProblem] = useState({});
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameStatus, setGameStatus] = useState("notStarted"); // 'notStarted', 'playing', 'ended'

  useEffect(() => {
    let timer;
    if (gameStatus === "playing" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameStatus === "playing") {
      checkAnswer();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStatus]);

  const generateProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operator = ["+", "-", "*"][Math.floor(Math.random() * 3)];

    let solution;
    switch (operator) {
      case "+":
        solution = num1 + num2;
        break;
      case "-":
        solution = num1 - num2;
        break;
      case "*":
        solution = num1 * num2;
        break;
      default:
        solution = 0;
    }

    return { num1, num2, operator, solution };
  };

  const displayProblem = () => {
    const newProblem = generateProblem();
    setProblem(newProblem);
    setAnswer("");
    setResult("");
    setTimeLeft(10);
  };

  const checkAnswer = () => {
    const userAnswer = parseInt(answer);
    if (userAnswer === problem.solution) {
      setResult("Correct!");
      setScore(score + 10);
    } else {
      setResult(`Wrong! The correct answer was ${problem.solution}.`);
    }
    setQuestionCount(questionCount + 1);

    if (questionCount < 4) {
      setTimeout(displayProblem, 2000);
    } else {
      setTimeout(endGame, 2000);
    }
  };

  const startGame = () => {
    setScore(0);
    setQuestionCount(0);
    setGameStatus("playing");
    displayProblem();
  };

  const endGame = () => {
    setGameStatus("ended");
    setTimeLeft(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkAnswer();
  };

  return (
    <div className="outer-container">
      <div className="App">
        <h1>Math Master Challenge</h1>
        {gameStatus === "playing" && (
          <>
            <div id="problem">{`${problem.num1} ${problem.operator} ${problem.num2} = ?`}</div>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer"
              />
              <button type="submit">Submit</button>
            </form>
            <div id="result">{result}</div>
            <div id="score">Score: {score}</div>
            <div id="time">Time: {timeLeft}s</div>
          </>
        )}
        {gameStatus === "notStarted" && (
          <button onClick={startGame}>Start Game</button>
        )}
        {gameStatus === "ended" && (
          <>
            <div id="result">
              {score >= 30
                ? `You won! Your final score is ${score}.`
                : `Game over. Your final score is ${score}. You need at least 30 points to win.`}
            </div>
            <button onClick={startGame}>Play Again</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
