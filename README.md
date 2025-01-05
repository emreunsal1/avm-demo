# Shopping Mall Rent Management System

This is a web application designed to digitize and automate the rent management of shopping malls.

## Frontend <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="react" width="25" height="25"/>

### Technologies
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="react" width="20" height="20"/> **Framework**: React.js
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/materialui/materialui-original.svg" alt="materialui" width="20" height="20"/> **UI Library**: Material-UI
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="react-context" width="20" height="20"/> **State Management**: React Context API
- <img src="https://axios-http.com/assets/favicon.ico" alt="axios" width="20" height="20"/> **API Communication**: Axios

### Features
- Responsive design
- Single Page Application (SPA)
- JWT-based authentication (cookie-based)

### Pages
- Login
- Mall List (Admin)
- Store List (Admin, Manager)
- Payment List (Admin, Manager, Store Owner)
- Make Payment Page (Store Owner)
- Payment History Page (Store Owner)

### Setup and Running
1. Set Node.js version:
```bash
nvm use
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
yarn install
```

4. Start the application:
```bash
yarn start
```

## Backend <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="nodejs" width="25" height="25"/>

### Technologies
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="nodejs" width="20" height="20"/> **Runtime**: Node.js
- <img src="https://keystonejs.com/favicon.ico" alt="keystone" width="20" height="20"/> **Framework**: Keystone.js v6 (Headless CMS)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg" alt="mysql" width="20" height="20"/> **Database**: MySQL
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/graphql/graphql-plain.svg" alt="graphql" width="20" height="20"/> **API**: GraphQL

### Features
- User authentication and authorization
- Data validation
- Business logic layer
- GraphQL API endpoints

### Setup and Running
1. Set Node.js version:
```bash
nvm use
```

2. Navigate to backend directory:
```bash
cd backend
```

3. Install dependencies:
```bash
yarn install
```

4. Create `.env` file and set required variables

5. Start the server:
```bash
yarn dev
```

6. Initialize data:
```bash
yarn seed
```

7. Set user passwords:
   - Go to `http://localhost:4000`
   - Login with initial credentials
   - Set passwords for created users

## System Requirements
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="nodejs" width="20" height="20"/> Node.js >= 20
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg" alt="mysql" width="20" height="20"/> MySQL >= 8.0
- <img src="https://yarnpkg.com/favicon.ico" alt="yarn" width="20" height="20"/> yarn package manager
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" alt="git" width="20" height="20"/> Git version control system

## Security Features
- HTTPS encryption
- Password hashing
- JWT authentication (cookie-based)
