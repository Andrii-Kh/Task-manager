                                                /* СТАРЫЙ ВАРИАНТ */
/* import axios from 'axios'
import React from 'react'

const Button = (props) => {



  const onClick = async () => {

    await axios(`/api/v1/tasks/${props.category}/${props.id}`, {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        status: props.status,
        id: props.id
      }
    })
    .then((result) => {
      console.log(result.data)
      return props.setTaskList(result.data)})
  }

  return (
    <div>
      <button
        className="border solid border-2 border-blue-700 rounded bg-blue-200"
        type="button"
        onClick={onClick}
      >
        {props.status}
      </button>
    </div>
  )
}

export default Button
 */