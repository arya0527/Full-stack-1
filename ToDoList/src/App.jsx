import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [task, setTask] = useState(" ");
  const [tasks,setTasks]= useState([]);

  const addTask = () => {
    setTasks([...tasks, task]);
    setTask(" ");
  }
  return (
    <div>
      <h1>To Do List</h1>
    <input value={task} onChange={(e)=>setTask(e.target.value)}/>
    <button onClick={addTask}>Add</button>
    </div>
  )
}

export default App
