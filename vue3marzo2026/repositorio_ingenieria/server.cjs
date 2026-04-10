const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// ==========================
// POST /login
// ==========================
server.post('/login', (req, res) => {
  const { email, password } = req.body
  const users = router.db.get('users').value()
  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    return res.status(400).json({ error: 'Credenciales incorrectas' })
  }

  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
  res.json({
    accessToken: token,
    user: { id: user.id, name: user.name, email: user.email }
  })
})

// ==========================
// POST /register
// ==========================
server.post('/register', (req, res) => {
  const { name, email, password } = req.body
  const users = router.db.get('users').value()
  const existe = users.find(u => u.email === email)

  if (existe) {
    return res.status(400).json({ error: 'El usuario ya existe' })
  }

  const lastId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0
  const newUser = { id: lastId + 1, name, email, password }

  router.db.get('users').push(newUser).write()

  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
  res.status(201).json({
    accessToken: token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email }
  })
})

server.use(router)

server.listen(3000, () => {
  console.log('JSON Server corriendo en http://localhost:3000')
})
