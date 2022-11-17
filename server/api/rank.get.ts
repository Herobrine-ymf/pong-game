import config from '@/composables/config'
import { rank } from '@/db'

export default defineEventHandler(async () => {
  return (await rank.aggregate([
    {
      $sort: {
        score: -1,
      },
    }, {
      $limit: config.rankLimit,
    }, {
      $project: {
        _id: 0,
      },
    },
  ]).toArray())
})
