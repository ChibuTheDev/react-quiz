import React from 'react'

export default function Finished({points,maxPossiblePoints}) {
    const percentage = (points /maxPossiblePoints)*100
  
    let emoji;

    if (percentage ===100) emoji = '🌟'
    if (percentage >= 80 && percentage < 100 ) emoji = '♥'
    if  (percentage <80) emoji ='🎉'

    console.log(percentage);
  return (
    <>

    <p className='result'>
      You scored {points} out of {maxPossiblePoints} ({Math.ceil(percentage)}%) {emoji}
    </p>

    <p>Highscore: </p>
  )
    </>
}


