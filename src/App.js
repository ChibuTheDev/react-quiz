import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from './components/Main'


const initialState={
  questions:[],

  //Loading, error, ready, active, finished
  status:'loading'
}

function reducer(state,action){
  switch(action.type){
    case 'dataReceived':
      return{ 
        ...state,
        questions: action.payload,
        status:'ready'
      };
    default:
    throw new Error('Action unknown');
  }
}

export default function App() {

const [state, dispatch] = useReducer(reducer,initialState)


  useEffect(function(){
    fetch('http://localhost:3000/questions').then(
      res=>res.json()
    ).then(data=>dispatch({type:'dataReceived', payload:data})).catch(err=>console.error(err))
  },[])




  return (
    <div className="App">

      <Header/>
     <Main> 
       <p>1/15</p>
       <p>Question</p>
     </Main>
    </div>
  );
}
