import { useState } from 'react'

import './App.css'

function App() {
  const [task, setTask] = useState(" ")
  const [tasks, setTasks] = useState([])

  const addTask = () => {
    if (task.trim() === "") return   // prevent empty task
    setTasks([...tasks, task])
    setTask("")
  }

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  return (
    <div className="container">
      <h1>To Do List</h1>

      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task"
      />

      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((t, index) => (
          <li key={index}>
            {t}
            <button onClick={() => deleteTask(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
