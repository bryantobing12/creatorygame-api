import express from 'express'

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello Gamers')
})

app.listen(port, () => {
  console.log(`Creatory game api listening at http://localhost:${port}`)
})
