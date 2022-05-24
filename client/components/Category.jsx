import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Category = () => {
  const { category } = useParams()
  const [taskList, setTaskList] = useState([])

  const url = `/api/v1/tasks/${category}`
  useEffect(() => {
    axios(url).then((list) => {
      setTaskList(list.data)
    })
  }, [])

  const inProgress = 'in progress'
  const blocked = 'blocked'
  const done = 'done'

  const editTask = (taskId, taskStatus) => {
    axios(`http://localhost:8090/api/v1/tasks/${category}`, {
      method: 'PATCH',
      data: {
        id: taskId,
        status: taskStatus
      }
    }).then((res) => {
      setTaskList(res.data)
    })
  }

  return (
    <div>
      {taskList.map((task, index) => {
        return (
          <div key={index} className="m-4 border-b p-2.5 w-full">
            <div className="flex justify-between">
              <div className="ml-4 text-lg">
                {index + 1}. {task.title}
              </div>
              <div className="flex">
                {task.status === 'new' /* здесь применяю логическое И */ && (
                  <div>
                    <button
                      type="button"
                      onClick={() => editTask(task.taskId, inProgress)}
                      className="mx-4 border bg-blue-300 rounded-full w-28"
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
                      onClick={() => editTask(task.taskId, blocked)}
                      className="mx-4 border bg-red-400 rounded-full w-20"
                    >
                      blocked
                    </button>
                    <button
                      type="button"
                      onClick={() => editTask(task.taskId, done)}
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
                      onClick={() => editTask(task.taskId, inProgress)}
                      className="mx-4 border bg-red-400 rounded-full w-28"
                    >
                      blocked
                    </button>
                  </div>
                ) : null}
                {task.status === 'done' ? <div className="mr-2.5">done</div> : null}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Category
