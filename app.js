const sdk = require('node-appwrite')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

// Config

const client = new sdk.Client()
client.setEndpoint('http://localhost/v1') // Replace with your endpoint
client.setKey('YOUR API KEY') // Replace with your API Key
client.setProject('YOUR PROJECT ID') // Replace with your project ID
let collectionId
let userId

// API Calls
//  api.createCollection()
//  api.listCollection()
//  api.addDoc()
//  api.listDoc()
//  api.uploadFile()
//  api.createUser(new Date().getTime() + '@example.com', 'user@123','Some User')
//  api.listUser()

// List of API Definitions

const createCollection = async () => {
  const database = new sdk.Database(client)
  console.log(chalk.greenBright('Running Create Collection API'))
  const response = await database.createCollection(
    'Movies', // Collection Name
    ['*'], // Read permissions
    ['*'], // Write permissions
    [
      { label: 'Name', key: 'name', type: 'text', default: 'Empty Name', required: true, array: false },
      { label: 'release_year', key: 'release_year', type: 'numeric', default: 1970, required: true, array: false }
    ]
  )
  collectionId = response.$id
  console.log(response)
}

const listCollection = async () => {
  const database = new sdk.Database(client)
  console.log(chalk.greenBright('Running List Collection API'))
  const response = await database.listCollections()
  const collection = response.collections[0]
  console.log(collection)
}

const addDoc = async () => {
  const database = new sdk.Database(client)
  console.log(chalk.greenBright('Running Add Document API'))
  const response = await database.createDocument(collectionId,
    {
      name: 'Spider Man',
      release_year: 1920
    },
    ['*'], ['*']
  )
  console.log(response)
}

const listDoc = async () => {
  const database = new sdk.Database(client)
  console.log(chalk.greenBright('Running List Document API'))
  const response = await database.listDocuments(collectionId)
  console.log(response)
}

const uploadFile = async () => {
  const storage = new sdk.Storage(client)
  console.log(chalk.greenBright('Running Upload File API'))
  const response = await storage.createFile(fs.createReadStream(path.join(__dirname, '/nature.jpg')), [], [])
  console.log(response)
}

const createUser = async (email, password, name) => {
  const users = new sdk.Users(client)
  console.log(chalk.greenBright('Running Create User API'))
  const response = await users.create(email, password, name)
  userId = response.$id
  console.log(response)
}

const listUser = async () => {
  const users = new sdk.Users(client)
  console.log(chalk.greenBright('Running List User API'))
  const response = await users.list()
  console.log(response)
}

const runAllTasks = async () => {
  await createCollection()
  await listCollection()
  await addDoc()
  await listDoc()
  await uploadFile()
  await createUser(new Date().getTime() + '@example.com', 'user@123', 'Some User')
  await listUser()
}

runAllTasks()
  .then(() => {
    console.log(chalk.green.bold('Successfully Ran playground!'))
  })
  .catch(err => {
    console.error(err)
  })
