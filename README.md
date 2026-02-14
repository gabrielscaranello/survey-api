# 🎉 Survey API

This is the backend of the Survey application, responsible for providing event-related services (restAPI).  
Follow the steps below to configure and run the project on your machine.

## 🛠️ Install

> [!TIP]  
> Make sure you have [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/getting-started/install) installed on your machine.

1. Clone the repository:

```bash
git clone git@github.com:gabrielscaranello/survey-api.git
```

2. Open project directory:

```bash
cd survey-api
```

3. Install project dependencies:

```bash
yarn install
```

4. Run project:

```bash
# Copy the example .env file:
cp .env.example .env
```

Starting dev server:

```bash
# Local run, needs to configure mongoDB as define credentials in the .env file
yarn dev

# Run as docker containe, provided by docker-compose
yarn docker:up
```

A node server will be started on [http://localhost:3000](http://localhost:3000).

## 🛠️ Build

The build process will generate a production-ready bundle of your application.

> [!NOTE]  
> Needs to configure environment variables to run

1. Run build:

```bash
yarn build
```

2. Run the built application:

```bash
yarn start
```

### Docker build

> [!WARNING]
> Docker build do not include NGINX, PM2 or any other service, only the node application.

```bash
make build
```

## 🧪 Unit Tests

To run the unit tests, use the following command:

```bash
# Executes all tests (unit and integration)
yarn test

# Executes only unit tests (watch mode)
yarn test:unit

# Executes only integration tests (watch mode)
yarn test:integration

# Executes all tests and generates the code coverage report
yarn test:ci

# Executes all tests and opens the utility in UI (watch mode)
yarn test:ui

# Executes all tests in debug mode
yarn test:debug
```

> [!TIP]  
> Any test script can be run with file filtering, for example:  
> `yarn test src/domain` or `yarn test src/domain/product/product.spec.ts`
