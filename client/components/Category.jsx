import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Input from './Input'
import EditProfile from './EditProfile'
import Filter from './Filter'

const Category = () => {
  const { category } = useParams()

  const [taskList, setTaskList] = useState([])

  const [edit, setEdit] = useState(false)

  const [idForEdit, setIdForEdit] = useState('')

  const [taskTitle, setTaskTitle] = useState('')

  const url = `http://localhost:8090/api/v1/tasks/${category}`

  useEffect(() => {
    axios(url).then((list) => {
      setTaskList(list.data)
    })
  }, [])

  const inProgress = 'in progress'
  const blocked = 'blocked'
  const done = 'done'

  const editStatus = (taskId, taskStatus) => {
    axios(`http://localhost:8090/api/v1/tasks/${category}`, {
      method: 'PATCH',
      'Content-Type': 'application/json',
      data: {
        id: taskId,
        status: taskStatus
      }
    }).then((res) => {
      setTaskList(res.data)
    })
  }

  return (
    <div className="bg-yellow-200">
      <EditProfile
        edit={edit}
        setEdit={setEdit}
        idForEdit={idForEdit}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        category={category}
        setTaskList={setTaskList}
      />
      <div className="flex justify-center items-center">
        <div className="text-xl">The chosen category:</div>
        <div className="ml-4">{category}</div>
      </div>
      <div className="text-center text-green-700">
        <Link to="/">Go back</Link>
      </div>
      <div>
        <Filter category={category} setTaskList={setTaskList} />
      </div>
      <div>
        <Input category={category} setTaskList={setTaskList} />
      </div>

      {taskList.map((task, index) => {
        return (
          <div key={index} className="my-4 border-b p-2.5 w-full bg-green-300">
            <div className="flex justify-between bg-blue-300">
              <div className="ml-4 text-lg bg-red-300">
                {index + 1}. {task.title}
              </div>
              <div className="flex">
                {' '}
                {/* зачем здесь flex ? */}
                {task.status === 'new' /* здесь применяю логическое И */ && (
                  <div>
                    <button
                      type="button"
                      onClick={() => editStatus(task.taskId, inProgress)}
                      className="mx-4 border bg-blue-300 rounded-full w-28" /* 28 ??? */
                    >
                      in progress
                    </button>
                  </div>
                )}
                {task.status ===
                'in progress' /* здесь специально применяю тернарный оператор как просто другой способ */ ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => editStatus(task.taskId, blocked)}
                      className="mx-0 border bg-red-400 rounded-full w-20"
                    >
                      blocked
                    </button>
                    <button
                      type="button"
                      onClick={() => editStatus(task.taskId, done)}
                      className="mx-4 border bg-green-400 rounded-full w-16"
                    >
                      done
                    </button>
                  </div>
                ) : null}
                {task.status === 'blocked' ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => editStatus(task.taskId, inProgress)}
                      className="mx-4 border bg-red-400 rounded-full w-28"
                    >
                      blocked
                    </button>
                  </div>
                ) : null}
                {task.status === 'done' ? <div className="mr-2.5">done</div> : null}
                <div>
                  <button
                    type="button"
                    className="mx-0 border bg-orange-300 rounded-full w-12"
                    /* onClick={() => editTask(task.title)} */

                    onClick={() => {
                      setEdit(!edit)
                      setIdForEdit(task.taskId)
                      setTaskTitle(task.title)
                    }}
                  >
                    edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Category
