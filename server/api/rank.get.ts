import { ObjectId } from 'mongodb'
import { rank } from '@/db'

const sortAndAppendIndex = [
  {
    $sort: {
      score: -1,
    },
  }, {
    $group: {
      _id: null,
      table: {
        $push: '$$ROOT',
      },
    },
  }, {
    $unwind: {
      path: '$table',
      includeArrayIndex: 'index',
    },
  }, {
    $project: {
      _id: '$table._id',
      score: '$table.score',
      index: {
        $add: ['$index', 1],
      },
    },
  }, {
    $lookup: {
      from: 'rank',
      localField: 'score',
      foreignField: 'score',
      as: 'userScore',
    },
  }, {
    $unwind: '$userScore',
  }, {
    $project: {
      index: 1,
      name: '$userScore.name',
      score: '$userScore.score',
    },
  },
]

export default defineEventHandler(async (event) => {
  const query = useQuery(event)

  if (query.id) {
    const id = new ObjectId(String(query.id))
    return (await rank.aggregate([
      ...sortAndAppendIndex,
      {
        $facet: {
          data: [{
            $limit: 10,
          }, {
            $match: {
              _id: { $ne: id },
            },
          }, {
            $project: {
              _id: 0,
            },
          }],
          me: [{
            $match: {
              _id: id,
            },
          }, {
            $project: {
              _id: 0,
            },
          }],
        },
      },
      {
        $unwind: '$me',
      },
    ]).toArray())[0]
  }
  else {
    return (await rank.aggregate([
      ...sortAndAppendIndex,
      {
        $project: {
          _id: 0,
        },
      }, {
        $facet: {
          data: [{
            $limit: 10,
          }],
        },
      },
    ]).toArray())[0]
  }
})
