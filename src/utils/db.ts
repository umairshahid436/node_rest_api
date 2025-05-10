import mongodb from 'mongodb';

const mongodbClient = mongodb.MongoClient;
const DB_NAME = 'demo';

let _db: mongodb.Db | undefined;

export const DB_URI = '';

export const mongoConnect = async (callback: () => void) => {
  try {
    const client = await mongodbClient.connect(DB_URI);
    console.log('Db connection successful');
    _db = client.db();
    callback();
  } catch (err) {
    console.error('Failed to connect to DB');
    throw err;
  }
};

export const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error('No database found');
};
