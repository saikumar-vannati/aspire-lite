# aspire-lite
ASPIRE-LITE API

### System Configuration

Operating System: Ubuntu 22

Node.JS Version: v18.16.0

Mysql Server Version: 8.0.34

### Setup Aspire-Lite App:

Clone the respository

```
git clone https://github.com/saikumar-vannati/aspire-lite.git
```

Open aspire-lite directory

```
cd aspire-lite
```

Update .env file with valid database credentials. As of now default credentials are availalble .env file. Make sure database is created in Mysql Server(database name is aspire in the following case)
```
DB_DATABASE=aspire
DB_USER=root
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql
```

Run npm install to install the required dependencies

```
npm install
```

Start the server. By default server will be running on PORT 8080. To change the port update .env file

```
npm start
```

### Tests

Run unit tests with coverage report. Added tests for Services and helper modules.

```
npm test
```

Following is the coverage report of tests ran.

```
  🌈 SUMMARY RESULTS 🌈

​
Suites:   ​4 passed​, ​4 of 4 completed​
Asserts:  ​​​18 passed​, ​of 18

------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------|---------|----------|---------|---------|-------------------
All files         |      96 |     86.2 |   93.75 |   96.52 |
 constants        |     100 |      100 |     100 |     100 |
  index.js        |     100 |      100 |     100 |     100 |
 lib              |   94.73 |    66.66 |    92.3 |   97.22 |
  logger.js       |    87.5 |       50 |      75 |    87.5 | 27
  utilities.js    |   96.66 |    71.42 |     100 |     100 | 25-43
 middlewares      |     100 |      100 |     100 |     100 |
  authenticate.js |     100 |      100 |     100 |     100 |
 models           |   93.75 |    83.33 |    87.5 |   93.75 |
  index.js        |      90 |    83.33 |      80 |      90 | 26,42
  loan.js         |     100 |      100 |     100 |     100 |
  repayment.js    |     100 |      100 |     100 |     100 |
  user.js         |     100 |      100 |     100 |     100 |
 services         |   96.87 |      100 |     100 |   96.77 |
  loan.js         |    93.1 |      100 |     100 |    93.1 | 55-56
  repayment.js    |     100 |      100 |     100 |     100 |
  user.js         |     100 |      100 |     100 |     100 |
------------------|---------|----------|---------|---------|-------------------
```

### API DOCS

Postman API documentation link for the ASPIRE-LITE API's.

https://documenter.getpostman.com/view/29165981/2s9YBxXvCb