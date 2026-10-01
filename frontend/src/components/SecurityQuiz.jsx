import { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';
import './SecurityQuiz.css';

const QUIZ_PASSWORDS = [
  ['password123', 'admin', 'Tr0ub4dour&3'],
  ['summer2024', 'S#mm3r!99', 'correcthorsebatterystaple'],
  ['12345678', 'qwertyuiop', 'j%8K#pL9!v'],
  ['dog', 'mycutepuppy', 'D0ggyB0n3z!'],
];

export default function SecurityQuiz() {
  const [currentRound, setCurrentRound] = useState(0);
  const [passwords, setPasswords] = useState([]);
  const [scores, setScores] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadRound();
  }, [currentRound]);

  const loadRound = () => {
    if (currentRound >= QUIZ_PASSWORDS.length) return;
    
    const currentList = [...QUIZ_PASSWORDS[currentRound]].sort(() => Math.random() - 0.5);
    const calculatedScores = currentList.map(p => ({
      password: p,
      result: zxcvbn(p)
    }));
    
    setPasswords(currentList);
    setScores(calculatedScores);
    setSelected(null);
    setShowResult(false);
  };

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    
    const highestScore = Math.max(...scores.map(s => s.result.score));
    if (scores[idx].result.score === highestScore) {
      setScore(s => s + 1);
    }
  };

  const nextRound = () => {
    setCurrentRound(r => r + 1);
  };

  const restart = () => {
    setCurrentRound(0);
    setScore(0);
  };

  if (currentRound >= QUIZ_PASSWORDS.length) {
    return (
      <div className="quiz-container slide-in">
        <h2>Quiz Complete!</h2>
        <p>You scored {score} out of {QUIZ_PASSWORDS.length}.</p>
        <button className="quiz-btn" onClick={restart}>Play Again</button>
      </div>
    );
  }

  const highestScore = scores.length ? Math.max(...scores.map(s => s.result.score)) : 0;

  return (
    <div className="quiz-container slide-in">
      <div className="quiz-header">
        <h2>Security Quiz: Round {currentRound + 1} of {QUIZ_PASSWORDS.length}</h2>
        <p>Which of these passwords do you think is the strongest?</p>
      </div>

      <div className="quiz-options">
        {passwords.map((pass, idx) => {
          let optionClass = "quiz-option";
          if (showResult) {
            if (scores[idx].result.score === highestScore) {
              optionClass += " correct";
            } else if (selected === idx) {
              optionClass += " incorrect";
            }
          }
          
          return (
            <div 
              key={idx} 
              className={optionClass}
              onClick={() => handleSelect(idx)}
            >
              <div className="quiz-pass-text">{pass}</div>
              {showResult && (
                <div className="quiz-feedback">
                  <div className="quiz-score">Score: {scores[idx].result.score}/4</div>
                  {scores[idx].result.feedback.warning && (
                    <div className="quiz-warning">{scores[idx].result.feedback.warning}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showResult && (
        <div className="quiz-action slide-in">
          <p className="quiz-result-text">
            {scores[selected].result.score === highestScore 
              ? "✅ Correct! This password offers the highest entropy." 
              : "❌ Incorrect. Another option was statistically stronger."}
          </p>
          <button className="quiz-btn" onClick={nextRound}>
            {currentRound === QUIZ_PASSWORDS.length - 1 ? "See Final Score" : "Next Round"}
          </button>
        </div>
      )}
    </div>
  );
}
