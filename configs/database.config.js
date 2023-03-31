import mongoose from 'mongoose';

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      // useCreateIndex: true
    })
    .then((conn) => {
      console.log(`MongoDB running at host ${conn.connection.host}`);
    });
};

export default connectDatabase;
