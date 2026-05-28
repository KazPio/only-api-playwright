# Playwright REST API Test Framework

This repository contains a Playwright-based test framework for REST API validation. It is designed to test API endpoints using Playwright's `APIRequestContext` and includes custom utilities for request handling, logging, assertion enhancement, and JSON schema validation.

## Key Features

- Playwright API testing with `@playwright/test`
- Custom `RequestHandler` for fluent API calls and request setup
- Enhanced logging for requests and responses
- Custom `expect` matcher extensions with API-aware failure messages
- Schema validation using `ajv` and reusable JSON response schemas
- Environment-aware configuration via `.env`

## Project Structure

- `api-test.config.ts` - environment-aware configuration and credentials loader
- `playwright.config.ts` - Playwright test configuration
- `tests/api-tests/` - API test suites
- `utils/request-handler.ts` - custom request wrapper with logging and status validation
- `utils/custom-expect.ts` - extended test assertions with schema validation and detailed API logs
- `utils/schema-validator.ts` - load/validate JSON response schemas and optionally generate them
- `utils/logger.ts` - capture recent API request/response activity for debugging
- `utils/fixtures.ts` - test fixtures to initialize request handler, logger, and auth token
- `response-schemas/` - stored API response schemas used by schema validation
- `request-objects/` - sample request payloads for POST/PUT scenarios

## Prerequisites

- Node.js 18+ (recommended)
- npm

## Install Dependencies

```bash
npm install
```

## Configuration

The framework loads environment variables from `.env` via `api-test.config.ts`.

Required variables for QA mode:

- `QA_USERNAME`
- `QA_PASSWORD`
- `TEST_ENV` (optional, defaults to `dev`)

Example `.env`:

```env
QA_USERNAME=your-qa-username
QA_PASSWORD=your-qa-password
TEST_ENV=qa
```

## Run Tests

Run all API tests with Playwright:

```bash
npx playwright test
```

Run a specific test file:

```bash
npx playwright test tests/api-tests/user.spec.ts
```

Open the generated HTML report after tests:

```bash
npx playwright show-report playwright-report
```

## Custom Request Handler

The custom `RequestHandler` provides a fluent API for REST operations:

- `url(url: string)` - override base URL for one request
- `path(path: string)` - set endpoint path
- `params(params: object)` - attach query parameters
- `headers(headers: Record<string, string>)` - attach additional headers
- `body(body: object)` - attach request body
- `clearAuth()` - disable default auth header for the request
- `getRequest(statusCode: number)`
- `postRequest(statusCode: number)`
- `putRequest(statusCode: number)`
- `deleteRequest(statusCode: number)`

The handler logs each request and response, validates expected HTTP status codes, and fails with recent API activity when mismatches occur.

## Custom Expect Helpers

The extended `expect` helpers include:

- `shouldEqual(expected)` - runs deep equality and adds request/response logs on failure
- `shouldBeLessThanOrEqual(expected)` - numeric comparison with API activity logs on failure
- `shouldMatchSchema(dirName, fileName, createSchemaFlag?)` - validates the response body against a stored schema

Example:

```ts
const response = await api.path("/users").getRequest(200);

await expect(response).shouldMatchSchema("user", "GET_all_users");
expect(response.users.length).shouldBeLessThanOrEqual(30);
```

## Schema Validation

Schema validation is handled by `utils/schema-validator.ts` using `ajv`.

- Schema files live under `response-schemas/{dirName}/{fileName}_schema.json`
- `shouldMatchSchema` can validate responses against existing schemas
- `createSchemaFlag` can generate a new schema from the response payload when needed

## Example Test Flow

The fixture setup in `utils/fixtures.ts` creates:

- an auth token using `helpers/getToken.ts`
- an `APILogger` instance
- a `RequestHandler` instance with logger and auth token

This allows tests to write expressive API calls and assertions.

## Notes

- `playwright.config.ts` uses `baseURL: 'https://dummyjson.com/'`
- `reporter` output includes HTML and JUnit reports
- `tests/api-tests/user.spec.ts` demonstrates GET, POST, PUT, and schema assertions