# WorkSpaceManager CMS Backend

This is the backend for the WorkSpaceManager application, built with [Payload CMS](https://payloadcms.com/) and PostgreSQL.

## Features

- **User Management**: Authentication and user roles
- **Workspaces, Projects, Features, and Tasks**: Collections for organizing work
- **Session Tracking**: Complete session persistence and recovery
- **Workflow Definitions**: Custom workflow stages and transitions
- **AI Integration**: Conversations with LLMs for code and project assistance
- **Dependencies**: Track relationships between items
- **Recovery Points**: Never lose work with automatic and manual recovery points

## Getting Started

### Prerequisites

- Node.js (v18.20.2 or v20.9.0+)
- PostgreSQL database

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up your environment variables:
   ```
   # Create a .env file based on .env.example
   cp .env.example .env
   ```

3. Update your `.env` file with your database connection details:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/workspace_manager
   PAYLOAD_SECRET=your-secure-secret-key
   ```

4. Start the development server:
   ```bash
   pnpm run dev
   ```

5. Initialize the database with sample data:
   ```bash
   pnpm run seed
   ```

### Default Credentials

After running the seed script, you can log in with the following credentials:

- Admin User:
  - Email: admin@example.com
  - Password: password123

- Regular User:
  - Email: user@example.com
  - Password: password123

## API Endpoints

The CMS provides standard REST and GraphQL APIs for all collections, plus custom endpoints for session management:

### Session Management

- `POST /api/sessions/start` - Start a new work session
- `POST /api/sessions/:id/resume` - Resume a paused session
- `POST /api/sessions/:id/pause` - Pause an active session
- `POST /api/sessions/:id/complete` - Complete a session
- `POST /api/sessions/:id/context` - Save the current work context
- `POST /api/session-tracking/save-state` - Low-level API to save the current work state

### Payload CMS APIs

Standard REST and GraphQL APIs are available for all collections:

- `GET /api/<collection>` - List all documents in a collection
- `POST /api/<collection>` - Create a new document
- `GET /api/<collection>/:id` - Get a specific document by ID
- `PUT /api/<collection>/:id` - Update a document
- `DELETE /api/<collection>/:id` - Delete a document

GraphQL API is available at `/api/graphql`.

## Collections

The backend includes the following collections:

- **Users**: User accounts with different roles
- **Workspaces**: Top-level organization for work
- **Projects**: Projects within workspaces
- **Features**: Features within projects
- **WorkItems**: Actionable tasks for implementing features
- **Tasks**: Simple tasks associated with projects
- **Sessions**: Work sessions for tracking time and state
- **RecoveryPoints**: Saved states for recovery
- **Dependencies**: Relationships between items
- **WorkflowDefinitions**: Custom workflow stages and rules
- **AIConversations**: Conversations with LLMs for code assistance
- **Media**: Files and images

## Development

### Available Scripts

- `pnpm run dev` - Start the development server
- `pnpm run build` - Build the application for production
- `pnpm run start` - Start the production server
- `pnpm run seed` - Seed the database with sample data
- `pnpm run generate:types` - Generate TypeScript types from collections

## Database Structure

The application uses PostgreSQL with a dedicated schema (`workspace_manager`) to isolate the tables. The database is accessed through Payload's PostgreSQL adapter, which handles all schema migrations and data operations.

## Technical Details

- **Payload CMS**: Provides the backend framework, admin UI, and APIs
- **PostgreSQL**: Primary database for persistent storage
- **TypeScript**: Ensures type safety and better developer experience
- **Express/Next.js**: Powers the server and API endpoints
- **Authentication**: JWT-based authentication through Payload CMS

## Deployment

For production deployment, follow these steps:

1. Build the application:
   ```bash
   pnpm run build
   ```

2. Start the production server:
   ```bash
   pnpm run start
   ```

For cloud deployment, ensure your environment variables are properly configured in your hosting environment.

## License

This project is licensed under the MIT License.
