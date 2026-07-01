import client from "./client.ts"

type AuthParams = {
    login: string,
    senha: string
}

export async function auth({login, senha}: AuthParams) {
    const result = await client({ 
        url: '/auth/login', 
        token: null, 
        method: 'POST', 
        data: {login, senha}
    })

    return result
}