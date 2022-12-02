import { connect } from 'mongoose'
import { config } from 'dotenv'
config()

export const connectDB = async () => {
  try {
    await connect(process.env.DB_URI, { useNewUrlParser: true })
    console.log('Database is connected.');
  } catch(e) {
    console.log('Error connecting to the database')
    console.error(e);
    throw e;
  }
}