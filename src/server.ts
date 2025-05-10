import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';
import mongodbSession from 'connect-mongodb-session';
import csrf from 'csurf';
import helmet from 'helmet';
import morgan from 'morgan';

import { rootDir } from './utils/path';
import { DB_URI } from './utils/db';
import { errorMiddleware } from './middleware/error';

const app = express();

import { productRoutes } from './routes/product';
import { pageNotFound } from './controllers/error';
import { homeRoutes } from './routes/home';
import { userRoutes } from './routes/user';
import { isAuthenticated } from './middleware/auth';

const csrfProtection = csrf();
const MongoDbSessionStore = mongodbSession(session);

// const sessionStore = new MongoDbSessionStore({
//   uri: DB_URI,
//   collection: 'sessions',
// });

app.use(helmet());
app.use(morgan('dev'));
app.use(express.static(path.join(rootDir, '..', 'public')));
// It will register a middleware and it will parse body in request
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
// app.use(
//   session({
//     secret: 'my secret',
//     resave: false,
//     saveUninitialized: false,
//     store: sessionStore,
//   })
// );
// app.use(csrfProtection);

app.use('/auth', userRoutes);
app.use('/api/products', isAuthenticated, productRoutes);
app.use('/', homeRoutes);
app.use(pageNotFound);

// Error handling middleware should be last
app.use(errorMiddleware);

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Db connection successful');
    app.listen(process.env.PORT ?? 3000, (error) => {
      if (error) {
        console.error('Failed to start server');
      } else {
        console.log('server running successful');
      }
    });
  })
  .catch(() => {
    console.log('Failed to establish DB connection');
  });
