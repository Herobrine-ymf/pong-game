import { ObjectId } from 'mongodb'
import { rank } from '@/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = String(body.name)
  const score = Number(body.score)

  if (body.id)
    rank.updateOne({ _id: new ObjectId(body.id) }, { $set: { score } })
  else
    return (await rank.insertOne({ name, score })).insertedId
})
