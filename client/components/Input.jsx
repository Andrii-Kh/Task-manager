import axios from 'axios'
import React, { useState } from 'react'

const Input = (props) => {
  const [value, setValue] = useState('')

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const addTask = async () => {
    await axios(`http://localhost:8090/api/v1/tasks/${props.category}`, {
      method: 'POST',
      'Content-Type': 'application/json',
      data: {
        title: value
      }
    }).then((result) => props.setTaskList(result.data))
  }

  return (
    <div className="flex justify-center items-center w-full p-4">
      <input
        className=" border-2 border-black rounded-md w-1/4"
        type="text"
        onChange={onChange}
        value={value}
      />
      <button
        className="ml-4 bg-green-300 rounded-full w-20"
        type="button"
        onClick={() => {
          addTask()
          setValue('')
        }}
      >
        add task
      </button>
    </div>
  )
}

export default Input
