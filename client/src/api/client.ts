import { HUB_URL } from '../lib/hub'

const BASE_URL = import.meta.env.VITE_API_URL

type ClientParams = {
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    data?: unknown
}

export default async function client({ url, method, data }: ClientParams) {
    const res = await fetch(`${BASE_URL}${url}`, {
        method,
        credentials: 'include',
        headers: {
            ...(data !== undefined ? { 'Content-Type': 'application/json' } : {})
        },
        body: data !== undefined ? JSON.stringify(data) : undefined
    });

    const body = res.status === 204 ? null : await res.json().catch(() => null)

    if (!res.ok) {
        if (res.status === 401) {
            window.location.href = HUB_URL
        }

        throw new Error(body?.error ?? `Erro ao efetuar o fetch do(a) ${url}.`)
    }

    return body
}
