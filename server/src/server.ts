import Fastify from 'fastify'

const app = Fastify()

app.get('/teste', () => {
    return 'Teste ok'
})

app.listen({ port: 3003 }, () => {
    console.log('Server rodando na 3003')
})