import { ObjectId } from 'mongodb'
import config from '@/composables/config'
import { rank } from '@/db'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  const score = Number(body.score)

  if (body.id) {
    rank.updateOne({ _id: new ObjectId(body.id) }, { $set: { score } })

    return { status: 'ok' }
  }
  else if (score >= config.scoreLowLimit) {
    return (await rank.insertOne({ name: String(body.name), score })).insertedId
  }
})
