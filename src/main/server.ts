import { app, port } from './config'

app.listen(port, () => {
  process.stdout.write(`Server running at http://localhost:${port}\n`)
})
