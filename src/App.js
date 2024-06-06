import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import Startscreen from "./components/Startscreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import ProgressBar from "./components/ProgressBar";
import Finished from "./components/Finished";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const SECS_PER_QUESTION = 30

const initialState={
  questions:[],

  //Loading, error, ready, active, finished
  status:'loading',
  index:0,
  answer:null,
  points:0,
  highscore:0,
  secondsRemaining: SECS_PER_QUESTION,

}

function reducer(state,action){
  switch(action.type){
    case 'dataReceived':
      return{ 
        ...state,
        questions: action.payload,
        status:'ready'
      };
    case 'dataFailed':
      return{
        ...state,
        status:'error'

      }
    case 'newAnswer'  :
      const question = state.questions.at(state.index)
      return{
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points+question.points : state.points
       
      } 

    case 'start'  :
      return{
        ...state,
        status:'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      }

    case 'nextQuestion':
      return{
        ...state,
        index: state.index+1,
        answer:null
      }

    case 'finish':
      return{
        ...state,
        status: 'finished',
        highscore: state.points > state.highscore ? state.points : state.highscore
      }

      
    case 'restart':
      return{
        ...state,
        status:'ready',
        index:0,
        answer:null,
        points:0,
        highscore:0,
       
      }

    case 'tick':
      return{
        ...state,
       secondsRemaining: state.secondsRemaining - 1,
       status: state.secondsRemaining === 0 ? 'finished' : state.status,

      }
   
    default:
    throw new Error('Action unknown');
  }
}

export default function App() {

const [{questions, status, index, answer,points,highscore,secondsRemaining}, dispatch] = useReducer(reducer,initialState)




  useEffect(function(){
    fetch('http://localhost:3000/questions').then(
      res=>res.json()
    ).then(data=>dispatch({type:'dataReceived', payload:data})).catch(err=>console.error(err))
  },[])


  const numQuestions = questions.length
  const maxPossiblePoints = questions.reduce(
    (prev,curr)=>prev +curr.points,0
  )

  return (
    <div className="App">
    
      <Header/>
     <Main> 
      {status === 'loading' && <Loader/>}
      {status === 'error' && <Error/>}
      {status === 'ready' && <Startscreen dispatch={dispatch} numQuestions={numQuestions}/>}
      {status === 'active' && (
       <>
        <ProgressBar index={index} numQuestions={numQuestions} points={points} 
          maxPossiblePoints={maxPossiblePoints} answer={answer}
        />
        <Question dispatch={dispatch} question={questions[index]} answer={answer} points={points}/>

    
     <Footer><Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />  <NextButton numQuestions={numQuestions} index={index} answer={answer} dispatch={dispatch}/></Footer>
     </> 
     )}
     {status === 'finished' && <Finished dispatch={dispatch} points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore}/>}
     </Main>
   
    </div>
  );
}

