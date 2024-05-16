import React from "react";
import "./score-page.css";

const close = () => {
  window.location.reload();
}


const scorePage = ({ score, totalQuestions }) => {
  return (
    <div className="score-page">
      <h1>Score:</h1>
      <h2>{score} out of {totalQuestions}</h2>
      <h3>{score > totalQuestions / 2 ? "Well done!" : "Better luck next time!"}</h3>
      <button onClick={close} className="close">Next Time</button>
    </div>
  );
}

export default scorePage;