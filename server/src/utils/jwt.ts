import jwt from 'jsonwebtoken';

export type HubPayload = {
    sub: number
    role: 'user' | 'admin'
    permissions: { module: string, access: string }[]
    branchs: { id: number, name: string }[]
}

export function verifyToken(token: string): HubPayload {
    return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }) as unknown as HubPayload
}
