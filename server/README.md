## Get Started

1. First of all create a .env file in the root directory.

Set the environment variables to something like this (MONGO_URI must be unique):

```
MONGO_URI="mongodb://localhost:27017/ecom-store"
PORT="9000"
PASS_SEC="yourPasswordSecretKEY"
JWT_SEC="JSONWEBTOKENSECRETKEY"
```

you can either use [MongoDB Atlas](https://www.mongodb.com/de-de/atlas/database) or install [MongoDB Compass](https://www.mongodb.com/try/download/compass) locally to connect to a MongoDB Databse. (pass connection string into "MONGO_URI" in .env)

2. Install dependencies

   ```
   npm install
   ```

3. Run Server
   ```
   npm run dev
   ```
4. Send Requests to Server

You can use something like [Postman](https://www.postman.com/) to send requests to the paths you can find in ./index.js and ./routes/ and communicate with the Server and Database
