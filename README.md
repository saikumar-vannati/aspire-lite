# aspire-lite
Assignment for ASPIRE

# System Configuration

Operating System: Ubuntu 22

Node.JS Version: v18.16.0

Mysql Server Version: 8.0.34

# Setup Aspire-Lite App:

Clone the respository

```git clone https://github.com/saikumar-vannati/aspire-lite.git```

Open aspire-lite directory

```cd aspire-lite```

Update .env file with valid database credentials. As of now default credentials are availalble .env file
```
DB_DATABASE=aspire
DB_USER=root
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql
```

Run npm install to install the required dependencies

```npm install```

Start the server. By default server will be running on PORT 8080. To change the port update .env file

```npm start```

Run unit tests with coverage report 

```npm test```

Postman API documentation link for the ASPIRE-LITE API's.

https://documenter.getpostman.com/view/29165981/2s9YBxXvCb