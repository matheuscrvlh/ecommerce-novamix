import 'dotenv/config'
import jwt from 'jsonwebtoken'

// node scripts/dev-token.ts [sub] [admin|operador]
const sub = Number(process.argv[2] ?? 999)
const isAdmin = (process.argv[3] ?? 'admin') === 'admin'

const token = jwt.sign(
    {
        sub,
        role: isAdmin ? 'admin' : 'user',
        permissions: [{ module: 'ecommerce', access: isAdmin ? 'admin' : 'read' }],
        branchs: []
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
)

console.log(token)
