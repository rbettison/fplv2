'server only'
import mongoose from 'mongoose';
const uri = process.env.MONGODB_URI;

export default async function connectToDatabase() {
    console.log('connecting to db');
   try {
    console.log('uri: ' + uri);
    await mongoose
    .connect(uri + '/fpl?retryWrites=true&w=majority');
   } catch(err) {
    console.log('Error connecting to db: ' + err);
   }
  console.log('connected to db');
}