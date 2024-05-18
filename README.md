# back-end-web-development-final-project-part1-web-service
back end web development final project part1 (web service)

#### Overview
This project is a RESTful API for a restaurant website, which utilizes Node.js and Express.js for server-side logic and MongoDB for database management. The API provides endpoints for user authentication, menu management, and order handling.

#### Database Schema
The API interacts with a MongoDB database, which includes the following collections:

1. Users:
   - Stores user information such as name, email, and hashed passwords.

2. Items:
   - Contains details of menu items including label, description, price, and image path.

3. Orders:
   - Stores order information including user ID, item ID, order date, and order status.

#### Database Tables
The database schema can be represented as follows:

Users Table:

| _id | name | email | password |


Items Table:

| _id | label | description | price | image |


Orders Table:

| _id | userId | itemId | date | status |


#### Endpoints
- *Authentication Endpoints:*
  - `/auth/register`: Register a new user. (POST)
  - `/auth/login`: Log in an existing user. (POST)

- *Menu Item Endpoints:*
  - `/items`: Get all menu items. (GET)
  - `/items`: Add a new menu item (Admin Only). (POST)
  - CRUD (Create, Read, Update & Delete)

- *Order Endpoints:*
  - `/orders`: Get all orders (Admin Only). (GET)
  - `/orders`: Place a new order. (POST)
  - CRUD (Create, Read, Update & Delete)

#### Authentication
User authentication is implemented using JWT (JSON Web Tokens). Upon successful login, a token is generated and sent back to the client, which is then used for subsequent authenticated requests.

#### Error Handling
The API handles errors gracefully and returns appropriate HTTP status codes along with informative error messages in case of failures.

#### Security
Passwords are securely hashed using bcrypt before storing them in the database to ensure data security. Additionally, access to certain endpoints is restricted based on user roles to prevent unauthorized access.

#### Scalability
The API is designed to be scalable, allowing for easy addition of new features and endpoints as the requirements of the restaurant website evolve over time.