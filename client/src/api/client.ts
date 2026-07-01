const BASE_URL = import.meta.env.VITE_API_URL

type ClientParams = {
    url: string,
    token: string | null,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data: unknown
}

export default async function client({ url, token, method, data }: ClientParams) {
    try {
        const res = await fetch(`${BASE_URL}${url}`, {
            method: method,
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        });

        if(!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`)
        };

        return res.json()
    } catch (error) {
        console.error('Fetch error', error);
        throw new Error(`Erro ao efetuar o fetch do(a) ${url}.`)
    }
}