import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import TaskCategoryList from './TaskCategoryList'

const StartV2 = () => {
  const [category, setCategory] = useState('')

  const onChange = (e) => {
    setCategory(e.target.value)
  }

  const createCategory = () => {
    axios(`http://localhost:8090/api/v2/tasks`, {
      method: 'POST',
      'Content-Type': 'application/json',
      data: {
        category
      }
    }).then((result) => setCategory(result))
  }

  return (
    <div>
      <div className="flex justify-center p-10">
        <input
          className="solid border-2 border-black rounded"
          type="text"
          onChange={onChange}
          value={category}
        />
        <div className="border-blue-700 bg-blue-200 w-19 rounded-full mx-4">
          <Link to={`/${category}`}>
            <button type="button" className="mx-4" onClick={createCategory}>
              Create task category
            </button>
          </Link>
        </div>

      </div>
      <div>
          <TaskCategoryList />
        </div>
    </div>
  )
}

export default StartV2
