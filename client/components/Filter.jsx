import axios from 'axios'
import React from 'react'

const Filter = (props) => {
  const all = Infinity
  const day = 1000 * 60 * 60 * 24
  const week = day * 7
  const month = day * 30

  const taskFilter = (timespan) => {
    axios(`/api/v1/tasks/${props.category}/${timespan}`).then((result) =>
      props.setTaskList(result.data)
    )
  }
  return (
    <div>
      <div className="flex justify-center pt-3">
        <button
          type="button"
          className="bg-orange-300 rounded-full w-20"
          onClick={() => taskFilter(all)}
        >
          all
        </button>
        <button
          type="button"
          className="ml-4 bg-orange-300 rounded-full w-20"
          onClick={() => taskFilter(day)}
        >
          day
        </button>
        <button
          type="button"
          className="ml-4 bg-orange-300 rounded-full w-20"
          onClick={() => taskFilter(week)}
        >
          week
        </button>
        <button
          type="button"
          className="ml-4 bg-orange-300 rounded-full w-20"
          onClick={() => taskFilter(month)}
        >
          month
        </button>
      </div>
    </div>
  )
}

export default Filter
