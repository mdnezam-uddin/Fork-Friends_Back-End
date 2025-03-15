

// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect("mongodb://192.168.230.49:27017/yelp", {
//       connectTimeoutMS: 60000,
//       socketTimeoutMS: 60000,
//       serverSelectionTimeoutMS: 60000,
//       maxPoolSize: 50,
//       wtimeoutMS: 300000,
//       family: 4,
//       directConnection: true
//     });
    
//     console.log(`MongoDB Connected: ${conn.connection.host}, ${mongoose.connection.db.databaseName}`);
//     return conn.connection.db; // Return the database instance
//   } catch (error) {
//     console.error(error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://192.168.0.154:27017/yelp", {
      connectTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      serverSelectionTimeoutMS: 60000,
      maxPoolSize: 50,
      wtimeoutMS: 300000,
      family: 4,
      directConnection: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}, ${mongoose.connection.db.databaseName}`);
    return conn.connection.db; // Return the database instance
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;