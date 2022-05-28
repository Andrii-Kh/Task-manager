import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  const [category, setCategory] = useState('')
  const onChange = (e) => {
    setCategory(e.target.value)
  }

  return (
    <div className="flex justify-center p-10">
      <input
        className="border solid border-2 border-black rounded"
        type="text"
        onChange={onChange}
        value={category}
      />
      <div className="border border-blue-700 bg-blue-200 w-19 rounded-full mx-4">
        <Link className="mx-4" to={`/${category}`}>
          Go to
        </Link>
      </div>

      {/* <Link to='/work'>Work</Link> */}
    </div>
  )
}
export default Start
