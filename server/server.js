import express from 'express'
import path from 'path'
import cors from 'cors'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import shortid from 'shortid'
/* import { fs } from 'fs' */
import { readFile, writeFile } from 'fs/promises'
import config from './config'
import Html from '../client/html'

require('colors')

let Root
try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/ssr/root.bundle').default
} catch {
  console.log('SSR not found. Please run "yarn run build:ssr"'.red)
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  express.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

server.post('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const listOfCategory = await readFile(`${__dirname}/${category}.json`, { encoding: 'utf8' })
    .then((oldList) => JSON.parse(oldList))
    .catch(async () => {
      await writeFile(
        `${__dirname}/${category}.json`,
        JSON.stringify([
          {
            taskId: shortid.generate(),
            title: req.body.title,
            status: 'new',
            _isDeleted: false,
            _createdAt: +new Date(),
            _deletedAt: null
          }
        ]),
        { encoding: 'utf8' }
      )
      /* console.log(listOfCategory) */
      res.json({ status: `File ${category}.json was created` })
    })
  const newTask = {
    taskId: shortid.generate(),
    title: req.body.title,
    status: 'new',
    _isDeleted: false,
    _createdAt: +new Date() - 604800000,
    _deletedAt: null
  }
  await writeFile(`${__dirname}/${category}.json`, JSON.stringify([...listOfCategory, newTask]), {
    encoding: 'utf8'
  })
  res.json({ status: `File ${category}.json was updated` })
})

server.get('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const listOfCategory = await readFile(`${__dirname}/${category}.json`, { encoding: 'utf8' })
    .then((text) => JSON.parse(text))
    .catch(() => {
      res.json({ error: 'File was not found' })
    })
  const listOfCategoryWithoutIsDeletedTrue = listOfCategory.reduce((acc, rec) => {
    if (!rec._isDeleted) {
      // eslint-disable-next-line
      delete rec._isDeleted
      // eslint-disable-next-line
      delete rec._createdAt
      // eslint-disable-next-line
      delete rec._deletedAt
      return [...acc, rec]
    }
    return acc
  }, [])
  res.json(listOfCategoryWithoutIsDeletedTrue)
})
/* 1 day = 86400000
1 week = 604800000
1 month = 2592000000 */

server.get('/api/v1/tasks/:category/:timespan', async (req, res) => {
  const data = +new Date()
  const { category, timespan } = req.params
  const listOfCategory = await readFile(`${__dirname}/${category}.json`, { encoding: 'utf8' })
    .then((text) => JSON.parse(text))
    .catch(() => {
      res.json({ error: 'File was not found' })
    })
  const listOfCategoryFiltered = listOfCategory.reduce((acc, rec) => {
    if (!rec._isDeleted && +rec._createdAt + +timespan > +data) {
      return [
        ...acc,
        {
          taskId: rec.taskId,
          title: rec.title,
          status: rec.status
        }
      ]
    }
    return acc
  }, [])
  res.json(listOfCategoryFiltered)
})

server.patch('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const listOfCategory = await readFile(`${__dirname}/${category}.json`, { encoding: 'utf8' })
    .then((text) => JSON.parse(text))
    .catch(() => {
      /* res.json({ error: 'File was not found' }) */
        return []
    })
  const arrayWithoutId = listOfCategory.filter((obj) => obj.taskId !== req.body.id)
  const chanchesTask = listOfCategory.find((obj) => obj.taskId === req.body.id)
  const statuses = ['done', 'new', 'in progress', 'blocked']
  if (statuses.some((status) => req.body.status === status)) {
    const chanchesTaskUpdate = { ...chanchesTask, status: req.body.status }
    const listOfCategoryUpdated = [...arrayWithoutId, chanchesTaskUpdate]
    await writeFile(`${__dirname}/${category}.json`, JSON.stringify(listOfCategoryUpdated), {
      encoding: 'utf8'
    })
    /* console.log(chanchesTaskUpdate) */
    return res.json(listOfCategoryUpdated)
  }
  return res.status(501).json({ message: 'incorrect status' })
})

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const listOfCategory = await readFile(`${__dirname}/${category}.json`, { encoding: 'utf8' })
    .then((text) => JSON.parse(text))
    .catch(() => {
      res.json({ error: 'File was not found' })
    })
  const arrayWithoutId = listOfCategory.filter((obj) => obj.taskId !== id)
  const chanchesTask = listOfCategory.find((obj) => obj.taskId === id)
  const chanchesTaskUpdate = { ...chanchesTask, _isDeleted: true }
  const listOfCategoryUpdated = [...arrayWithoutId, chanchesTaskUpdate]
  await writeFile(`${__dirname}/${category}.json`, JSON.stringify(listOfCategoryUpdated), {
    encoding: 'utf8'
  })
  res.json(listOfCategoryUpdated)
})

/* server.get('/api/v1/categories', async (req, res) => {
  const file = await fs.readdirSync(`${__dirname}`)
  console.log(file)
  res.json(file)
}) */

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
