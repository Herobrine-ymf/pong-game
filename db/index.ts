import { MongoClient, ServerApiVersion  } from 'mongodb'

const client = new MongoClient(`${useRuntimeConfig().mongodbUri}/?retryWrites=true&w=0`, { serverApi: ServerApiVersion.v1 });
client.connect()

export const rank = client.db('main').collection('newRank')
