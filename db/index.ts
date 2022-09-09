import { MongoClient } from 'mongodb'

const client = new MongoClient(`${import.meta.env.MONGODB_URI}/?retryWrites=true&w=0`)
client.connect()

export const rank = client.db('main').collection('rank')
