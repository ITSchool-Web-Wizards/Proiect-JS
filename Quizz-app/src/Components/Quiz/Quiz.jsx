import React, { useState, useRef } from 'react'
import './Quiz.css'
import { data } from '../../assets/data/data'
import ScorePage from './score-page';   

const Quiz = () => {

    let [index, setIndex] = useState(0);
    let [question, setQuestion] = useState(data[index]);
    let [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    let [showScorePage, setShowScorePage] = useState(false);

    const option1 = useRef(null);
    const option2 = useRef(null);
    const option3 = useRef(null);
    const option4 = useRef(null);

    let optionArray = [option1, option2, option3, option4];

    const checkAnswer = (e, answer) => {
        if (lock) {
            return;
        }
        e.target.classList.add("lock");
        if (question.answer === answer) {
            e.target.classList.add("correct");
            setLock(true);
            setScore(score + 1);
        } else {
            e.target.classList.add("wrong");
            setLock(true);
            optionArray[question.answer].current.classList.add("correct");
        }
    }

    const backButton = () => {
        if (index <= data.length - 1 && index > 0) {
            setIndex(index - 1);
            setQuestion(data[index - 1]);
            setLock(false);
            optionArray.forEach((option, i) => {
                option.current.classList.remove("lock");
                option.current.classList.remove("correct");
                option.current.classList.remove("wrong");
            });
        }
    }
 
    const nextQuestion = () => {
        if (index < data.length - 1) {
            setIndex(index + 1);
            setQuestion(data[index + 1]);
            setLock(false);
            optionArray.forEach((option) => {
                option.current.classList.remove("lock");
                option.current.classList.remove("correct");
                option.current.classList.remove("wrong");
            })
        } else {
            setShowScorePage(true);
        }
    }

    const refreshQuiz = () => {
        setIndex(0);
        setQuestion(data[0]);
        setLock(false);
        setScore(0);
        setShowScorePage(false);
        optionArray.forEach((option) => {
            option.current.classList.remove("lock", "correct", "wrong");
        })
    }

    return (
        <>
            {!showScorePage ? (
                <div className='container'>
                    <h1>Guess the games by their famous quotes</h1>
                    <hr />
                    <h2>{index + 1}. {question.question}</h2>
                    <ul>
                        <li ref={option1} onClick={(e) => { checkAnswer(e, 0) }}>{question.options[0]}</li>
                        <li ref={option2} onClick={(e) => { checkAnswer(e, 1) }}>{question.options[1]}</li>
                        <li ref={option3} onClick={(e) => { checkAnswer(e, 2) }}>{question.options[2]}</li>
                        <li ref={option4} onClick={(e) => { checkAnswer(e, 3) }}>{question.options[3]}</li>
                    </ul>
                    <div className='secondContainer'>
                        <button onClick={backButton} className='backButton'>Back</button>
                        <button onClick={nextQuestion} className='button'>Next</button>
                        <button onClick={refreshQuiz} className='refresh'>Refresh Quiz</button>
                    </div>
                    <div className='index'>{index + 1} of {data.length} questions</div>
                </div>
            ) : (
                <ScorePage score={score} totalQuestions={data.length} refreshQuiz={refreshQuiz} />
            )}
        </>
    )
}

export default Quiz