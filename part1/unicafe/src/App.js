import { useState } from 'react'
const Statistics = ({good, bad, neutral}) => {
  if(good === 0 && bad === 0 && neutral === 0){
    return(
      <div>
        <h1>statistics</h1>
        No feedback given
      </div>
    )
  }
  else{
    return(
      <div>
        <h1>statistics</h1>
        <StatisticLine text='good' value={good} />
        <StatisticLine text='neutral' value={neutral} />
        <StatisticLine text='bad' value={bad} />
        <StatisticLine text='all' value={good + neutral + bad} />
        <StatisticLine text='average' value={(good - bad) / (good + neutral + bad)} />
        <div>positive {good / (good + neutral + bad) * 100}%</div>
      </div>
    )
  }
}
const Button = (props) => {
  return(
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
const StatisticLine = (props) => {
  return(
    <div>{props.text} {props.value}</div>
  )
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() =>setGood(good + 1)} text='good'></Button>
      <Button onClick={() =>setNeutral(neutral + 1)} text='neutral'></Button>
      <Button onClick={() =>setBad(bad + 1)} text='bad'></Button>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>

  )
}

export default App