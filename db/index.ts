import { MongoClient } from 'mongodb'

const client = new MongoClient(`${useRuntimeConfig().mongodbUri}/?retryWrites=true&w=0`)
client.connect()

export const rank = client.db('main').collection('rank')
