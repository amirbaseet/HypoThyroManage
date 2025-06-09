/**
 * MongoDB Initialization Script
 * -----------------------------------
 * This script is executed automatically by the MongoDB Docker container
 * on first run via the /docker-entrypoint-initdb.d/ directory.
 * 
 * It:
 * 1. Connects to the target application database
 * 2. Creates a custom role: `readWriteNoDrop`
 * 3. Creates an application-level user with this limited role
 * 
 * Environment Variables Required:
 * - APP_DB_NAME      : Name of the application database
 * - APP_DB_USER      : Username for the application
 * - APP_DB_PASS      : Password for the application
 */

/**
 * MongoDB Initialization Script
 * -----------------------------------
 * This script is executed automatically by the MongoDB Docker container
 * on first run via the /docker-entrypoint-initdb.d/ directory.
 * 
 * It:
 * 1. Connects to the target application database
 * 2. Creates a custom role: `readWriteNoDrop`
 * 3. Creates an application-level user with this limited role
 * 
 * Environment Variables Required:
 * - APP_DB_NAME      : Name of the application database
 * - APP_DB_USER      : Username for the application
 * - APP_DB_PASS      : Password for the application
 * this will run only one time when initalize the container
 */
// Switch context to the application DB
const dbName = process.env.APP_DB_NAME;
const appUser = process.env.APP_DB_USER;
const appPass = process.env.APP_DB_PASS;
db = db.getSiblingDB(dbName);

// Create a custom role that prevents dangerous operations like drop
db.createRole({
  role: "readWriteNoDrop",
  privileges: [
    {
      resource: { db: dbName, collection: "" }, // applies to all collections in the DB
      actions: ["find", "insert", "update", "remove"] // CRUD but no drop
    }
  ],
  roles: [] // no inherited roles
});

// Create the application user with the custom role
db.createUser({
  user: appUser,
  pwd: appPass,
  roles: [{ role: "readWriteNoDrop", db: dbName }]
});

print(`✅ MongoDB user '${appUser}' with role 'readWriteNoDrop' created successfully in database '${dbName}'`);
