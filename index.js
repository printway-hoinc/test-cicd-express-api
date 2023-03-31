
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import xss from 'xss-clean';

import connectDatabase from './configs/database.config.js';
import routes from './routes/index.js';

dotenv.config({ path: '.env' });

// Handling uncaught exception
process.on('uncaughtException', (err) => {
  console.log(`ERROR ${err.message}`);
  console.log('Shutting down due to uncaught exception');
  process.exit(1);
});

connectDatabase();

const app = express();
app.set('trust proxy', true);

app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '2mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

if (app.get('env') === 'dev') {
  app.use(morgan('dev'));
  // corsOrigin.origin = 'http://localhost:3000';
}
app.use(cors('*'));

const limiter = rateLimit({
  windowMs: 3000, // 3s
  max: 30, // Limit each IP to 10 requests per `window` (here, per 3s)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

routes(app);

app.all('*', (req, res, next) => {
  // next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
  return res.status(404).json({
    success: false,
    message: 'Route not found'
  })
});

// app.use(errorMiddleWare);

const server = app.listen(process.env.PORT, () => {
  console.log(`App is running at port ${process.env.PORT}`);
});

// Handle unhandled exception
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err}`);
  console.log('Shutting down unhandled promise rejection');
  server.close(() => process.exit(1));
});