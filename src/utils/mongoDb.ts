import mongoose from "mongoose";

//connection func to DB
const connectToMongoDb = async ():Promise<void>  => {
try {
    //if not connected to DB
    if(mongoose.connection.readyState === 0) {
        console.log('Connecting to MongoDB');
        //send connection request to mongo
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Successfully Connected to MongoDB');
    } else{
        //if already connected
        console.log('MongoDB already connected');
    }
} catch (e) {
    console.error(e);
}
}
export default connectToMongoDb;