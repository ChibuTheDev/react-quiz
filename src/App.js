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


const initialState={
  questions:[],

  //Loading, error, ready, active, finished
  status:'loading',
  index:0,
  answer:null,
  points:0,
  highscore:0

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
        status:'active'
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

    default:
    throw new Error('Action unknown');
  }
}

export default function App() {

const [{questions, status, index, answer,points,highscore}, dispatch] = useReducer(reducer,initialState)




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

     <NextButton numQuestions={numQuestions} index={index} answer={answer} dispatch={dispatch}/>
     </> 
     )}
     {status === 'finished' && <Finished points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore}/>}
     </Main>
   
    </div>
  );
}

