// src/lib/db.ts
import { Client } from 'pg'

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'nexus',
  password: 'nader@2000',
  port: 5432,
})

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Connection error', err.stack))
  

export default client
