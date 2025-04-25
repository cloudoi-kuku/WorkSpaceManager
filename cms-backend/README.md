# CMS Backend Template

This is a reusable Payload CMS backend template configured with PostgreSQL for building modern web applications.

## Features

- **Payload CMS**: A powerful headless CMS with a beautiful admin interface
- **PostgreSQL**: Robust and scalable database support
- **Next.js**: Server-side rendering and API routes
- **TypeScript**: Full type safety throughout the application
- **Authentication**: Built-in user authentication and authorization
- **API**: RESTful and GraphQL APIs for all collections

## Quick Start

To use this template as part of the full-stack application:

1. Make sure PostgreSQL is installed and running
2. Configure the `.env` file with your PostgreSQL connection string
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server
5. Access the admin interface at `http://localhost:3000/admin`

## Standalone Usage

If you want to use this CMS backend as a standalone application:

1. Clone or copy this directory
2. Configure the `.env` file with your PostgreSQL connection string
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server
5. Access the admin interface at `http://localhost:3000/admin`

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

You can use [Docker](https://www.docker.com) to run this template with PostgreSQL. To do so:

1. Make sure Docker and Docker Compose are installed
2. Configure the `.env` file with your PostgreSQL connection string
3. Run `docker-compose up` to start both the CMS and PostgreSQL
4. Access the admin interface at `http://localhost:3000/admin`

## API Endpoints

Payload CMS provides standard REST and GraphQL APIs for all collections:

- `GET /api/<collection>` - List all documents in a collection
- `POST /api/<collection>` - Create a new document
- `GET /api/<collection>/:id` - Get a specific document by ID
- `PUT /api/<collection>/:id` - Update a document
- `DELETE /api/<collection>/:id` - Delete a document

GraphQL API is available at `/api/graphql`.

## Integration with Frontend

This CMS backend is designed to work seamlessly with the React frontend in the parent directory. The frontend connects to the CMS API endpoints to fetch and manipulate data.

## Questions

If you have any issues or questions about Payload CMS, refer to the [official documentation](https://payloadcms.com/docs) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
