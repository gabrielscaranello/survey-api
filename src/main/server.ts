import express from 'express'

const port = 5050

const app = express()
app.listen(port, () => {
  process.stdout.write(`Server running at http://localhost:${port}\n`)
})
