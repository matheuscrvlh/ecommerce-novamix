import ibmdb from 'ibm_db'

const URL_DB = process.env.CISS_DATABASE_URL

export async function cissDb() {
    try {
        const result = await ibmdb.open(URL_DB);
        return result
    } catch (error) {
        console.log(error)
        throw new Error('Erro ao conectar no banco CISS')
    }
}