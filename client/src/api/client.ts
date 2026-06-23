const BASE_URL = import.meta.env.VITE_API_URL

const 

export default async function Client(url, method, data) {
    try {
        const res = await fetch(`BASE_URL${url}`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if(!res.ok) {
            throw new Error('Erro ao conectar com servidor.')
        };

        const data = await res.json();
        return data
    } catch (error) {
        console.log(`Erro ao efetuar o fetch do(a) ${url}.`, error)
    }
}