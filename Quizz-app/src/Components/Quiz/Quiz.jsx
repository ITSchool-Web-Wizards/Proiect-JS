import React, { useRef } from 'react'
import { useState } from 'react'
import './Quiz.css'
import { data } from '../../assets/data/data'

const Quiz = () => {

    let [index, setIndex] = useState(0);
    let [question, setQuestion] = useState(data[index]);
    let [lock, setlock] = useState(false);
    let [score, setScore] = useState(0);

    const option1 = useRef(null);
    const option2 = useRef(null);
    const option3 = useRef(null);
    const option4 = useRef(null);

    let optionArray = [option1, option2, option3, option4];

    const checkAnswer = (e, answer) => {
        if (lock === false) {
            e.target.classList.add("lock")
            if (question.answer === answer) {
                e.target.classList.add("correct");
                setlock(true);
                setScore(score + 1);
            } else {
                e.target.classList.add("wrong");
                setlock(true);
                optionArray[question.answer].current.classList.add("correct");
            }
        }

    }

    const refreshQuiz = () => {
        setIndex(0);
        setQuestion(data[0]);
        setlock(false);
        setScore(0);
        optionArray.forEach((option) => {
            option.current.classList.remove("lock");
            option.current.classList.remove("correct");
            option.current.classList.remove("wrong");
        })
    }

    const nextQuestion = () => {
        if (index < data.length - 1) {
            setIndex(index + 1);
            setQuestion(data[index + 1]);
            setlock(false);
            optionArray.forEach((option) => {
                option.current.classList.remove("lock");
                option.current.classList.remove("correct");
                option.current.classList.remove("wrong");
            })
        } else {
            alert("Quiz is over. Your score is " + score + " out of " + data.length);
        }
    }

    return (
        <>
            <div className='container'>
                <h1>Quiz App</h1>
                <hr />
                <h2>{index + 1}. {question.question}</h2>
                <ul>
                    <li ref={option1} onClick={(e) => { checkAnswer(e, 0) }}>{question.options[0]}</li>
                    <li ref={option2} onClick={(e) => { checkAnswer(e, 1) }}>{question.options[1]}</li>
                    <li ref={option3} onClick={(e) => { checkAnswer(e, 2) }}>{question.options[2]}</li>
                    <li ref={option4} onClick={(e) => { checkAnswer(e, 3) }}>{question.options[3]}</li>
                </ul>
                <button onClick={nextQuestion} className='button'>Next</button>
                <div className='index'>{index + 1} of {data.length} questions</div>
                <button onClick={refreshQuiz} className='refresh'>Refresh Quiz</button>
            </div>
        </>
    )
}

export default Quiz