import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  const [category, setCategory] = useState('')
  const onChange = (e) => {
    setCategory(e.target.value)
  }

  return (
    <div>
      <input
        className="border solid border-2 border-black rounded"
        type="text"
        onChange={onChange}
        value={category}
      />
      {/* <Link
        to={`/${category}`}
        className="border solid border-2 border-blue-700 rounded bg-blue-200"
      >
        Go to
      </Link> */}

      <Link to='/work'>Work</Link>
    </div>
  )
}
export default Start
