import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"

const dbClient = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY as string
  },
})

const docClient = DynamoDBDocumentClient.from(dbClient)

export async function addSubscriber(email: string) {
  const command = new PutCommand({
     TableName: 'email_subscriptions',
     Item: {
        email: email
     },
  })
  try {
     const response = await docClient.send(command)
     return response
  } catch (error) {
   throw error
  }
}
