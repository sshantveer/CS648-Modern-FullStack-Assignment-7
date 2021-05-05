/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo cs648_assignment_7 mongo_test_scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://admin:admin@fullstack-mongo-cluster-j0wnh.mongodb.net/cs648_assignment_7 mongo_test_scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/cs648_assignment_7 mongo_test_scripts/init.mongo.js
 */

/* eslint linebreak-style: ["error", "windows"] */
let db;
db.products.remove({});
db.deleted_products.remove({});

const productsDB = [
    {
        id: 1,
        productName: 'BLUE Shirt',
        price: 30,
        category: 'Shirts',
        imageUrl: 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1566927496-button-down-4-1566927485.jpg',
    }
];

db.products.insertMany(productsDB);
const count = db.products.count();

db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });

db.products.createIndex({ id: 1 }, { unique: true });
db.products.createIndex({ status: 1 });
db.products.createIndex({ owner: 1 });
db.products.createIndex({ created: 1 });

db.deleted_products.createIndex({ id: 1 }, { unique: true });
