import React from 'react'
import axios from 'axios'
import './EditProfile.css'

const EditProfile = (props) => {
  const onChange = (e) => {
    props.setTaskTitle(e.target.value)
  }

  const onClick = () => {
    axios(`http://localhost:8090/api/v1/tasks/${props.category}`, {
      method: 'PATCH',
      'Content-Type': 'application/json',
      data: {
        id: props.idForEdit,
        title: props.taskTitle
      }
    }).then((result) => props.setTaskList(result.data))
  }

  return (
    <div className={props.edit ? 'edit active' : 'edit'}>
      <div className={props.edit ? 'editcontent active' : 'editcontent'}>
        <input
          className=" border-2 border-black rounded-md w-1/2"
          onChange={onChange}
          value={props.taskTitle}
        />
        <button type="button" onClick={onClick}>
          save
        </button>
        <button type="button" onClick={() => props.setEdit(false)}>
          back
        </button>
      </div>
    </div>
  )
}

export default EditProfile
