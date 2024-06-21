import fastify from 'fastify'

const app = fastify({
  logger: true,
})

app.get('/', (req, res) => {
  res.send({ hello: 'world' })
})

const start_server = async () => {
  try {
    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start_server()
