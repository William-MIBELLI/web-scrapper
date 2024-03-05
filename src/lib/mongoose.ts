import mongoose from "mongoose";

let isConnected = false;

export const connectToDb = async () => {
  mongoose.set('strictQuery', true);

  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) return console.log('NO MONGODB_URI');
  
  if (isConnected) return console.log('Using exisitng db connection');

  try {
    const mg = await mongoose.connect(MONGODB_URI)

    isConnected = true;
    
    console.log('MongoDB connected : ');
  } catch (error) {
    console.log(error);
  }
}