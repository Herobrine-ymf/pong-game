import { Handler } from "@netlify/functions";
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URL + "/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
const collection = client.db("main").collection("rank");
client.connect();

function get() {
  return collection.find({}).toArray();
}
async function insert(name: string, point: number) {
  collection.insertOne({ name: name, point: point });
}

const handler: Handler = async (event, context) => {
  const name = event.queryStringParameters["name"] as string;
  const point = parseInt(event.queryStringParameters["point"] as string);

  if (point >= 20) {
    insert(name, point);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(await get()),
  };
};

export { handler };
