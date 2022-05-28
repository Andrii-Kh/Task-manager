import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const TaskCategoryList = () => {
  const [category, setCategory] = useState([])

  useEffect(() => {
    axios(`api/v1/categories`).then((result) => setCategory(result.data))
  }, [])
  return (
    <div>
      <div className="flex justify-center text-xl pb-5 ">
        Or choose one of the existing categories:
      </div>
      {category.map((it, index) => {
        return (
          <div key={index} className="flex justify-center text-blue-700">
            <div>
              <Link to={`/${it}`}>{it}</Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TaskCategoryList
