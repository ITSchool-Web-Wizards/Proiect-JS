import React from 'react'
import Quiz from './Components/Quiz/Quiz'
import responsive  from 'responsive'

const App = () => {
  return (
    <>
      <Quiz />
    </>
  )
}

const opts = {
  checkpoints: {
    small: {
      width: [0, 400]
    },
    big: {
      width: [401, null]
    }
  }
}
responsive(opts, data => {
  console.log(data)
})

export default App