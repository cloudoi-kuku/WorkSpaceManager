# Workspace Manager Starter Template

A modern web application starter template built with React, TypeScript, Tailwind CSS, shadcn-UI, and Payload CMS with PostgreSQL backend. This template provides a solid foundation for building robust workspace management applications.

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS, and shadcn-UI components
- **Backend & API**: Payload CMS (built on Express)
- **Database**: PostgreSQL
- **State Management**: React Context API with custom hooks
- **Styling**: Tailwind CSS with shadcn-UI components
- **Build Tool**: Vite

## Features

This starter template includes:

- **Modern UI Components**: Built with shadcn-UI and Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application
- **Database Integration**: PostgreSQL support via Payload CMS
- **User Authentication**: Built-in authentication system
- **API Endpoints**: REST and GraphQL APIs via Payload CMS
- **Responsive Design**: Mobile-friendly UI components

## Planned Extensions

We plan to extend this starter template with:

- **Session Management**: Maintain work across browser sessions with automatic state saving
- **Work Item Management**: Create, update, and manage work items with status tracking
- **Workflow Management**: Define and enforce feature development stages
- **GitHub Integration**: Import and sync GitHub repositories
- **Offline-First Functionality**: Work without constant connectivity
- **AI-Powered Features**: Generate and analyze code with AI

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables:
   ```
   # Create a .env file with the following variables
   PAYLOAD_SECRET=your-secret-key-change-me
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
   PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001
   ```

4. Start all development servers with a single command:
   ```bash
   # Start both servers (frontend and Payload CMS)
   npm run dev:all
   ```

   Alternatively, you can start each server individually:
   ```bash
   # Start the frontend
   npm run dev

   # In a separate terminal, start Payload CMS (which serves as both CMS and API)
   cd cms-backend && npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:5174 (or http://localhost:5173 if port 5174 is already in use)
   - Payload CMS Admin: http://localhost:3000/admin
   - Payload API: http://localhost:3000/api

## Development

### Project Structure

```
manager/
├── src/
│   ├── components/     # UI components
│   ├── lib/            # Utility functions
│   ├── payload/        # Payload CMS configuration
│   │   ├── collections/  # Collection definitions
│   │   └── payload.config.ts  # Payload configuration
│   ├── server/         # Express server setup
│   └── App.tsx         # Main application component
├── public/           # Static assets
├── .env              # Environment variables
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json     # TypeScript configuration
└── vite.config.ts    # Vite configuration
```

### Available Scripts

- `npm run dev:all` - Start all development servers (frontend and Payload CMS)
- `npm run dev:stop` - Stop all running Node.js processes (useful for stopping all servers)
- `npm run dev` - Start the frontend development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the production build locally
- `npm run payload:migrate` - Run database migrations
- `npm run payload:generate-types` - Generate TypeScript types from Payload collections

#### Payload CMS Scripts (in cms-backend directory)

- `npm run dev` - Start the Payload CMS development server
- `npm run build` - Build the Payload CMS application
- `npm run generate:types` - Generate TypeScript types for Payload collections
- `npm run payload` - Run Payload CLI commands

## Database Structure

The application uses PostgreSQL with the following collections:

- **Users**: User accounts with authentication
- **Tasks**: Task management with status tracking

Additional collections to be added:
- Workspaces
- Projects
- Media
- Sessions (for work tracking)

## API Endpoints

Payload CMS provides standard REST and GraphQL APIs for all collections at `http://localhost:3000/api`:

- `GET /api/<collection>` - List all documents in a collection
- `POST /api/<collection>` - Create a new document
- `GET /api/<collection>/:id` - Get a specific document by ID
- `PUT /api/<collection>/:id` - Update a document
- `DELETE /api/<collection>/:id` - Delete a document

GraphQL API is available at `http://localhost:3000/api/graphql`.

### Connecting Frontend to Payload API

To connect your React frontend to the Payload API, use the base URL `http://localhost:3000/api` for all API requests. For example:

```typescript
// Example of fetching data from Payload API
const fetchTasks = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/tasks');
    const data = await response.json();
    return data.docs; // Payload returns documents in a 'docs' array
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};
```

## Admin Interface

The Payload CMS admin interface is available at:
- http://localhost:3000/admin

This provides a user-friendly interface to:
- Manage users and authentication
- Create, read, update, and delete content
- Configure collections and fields
- Manage media and uploads
- Monitor system status

### Starting All Services

For convenience, you can start all services (frontend, backend, and Payload CMS) with a single command:

```bash
npm run dev:all
```

This will start both servers concurrently and display their logs with different colors for easy identification:
- FRONTEND (green): The React application
- PAYLOAD (yellow): The Payload CMS server (which also serves as the API)

To stop all running servers, you can use:

```bash
npm run dev:stop
```

This will terminate all Node.js processes, effectively stopping all development servers.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
