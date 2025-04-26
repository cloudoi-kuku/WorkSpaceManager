import { NextResponse } from 'next/server';
import configPromise from '@payload-config';
import { getPayload } from 'payload';

// Helper function to add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export async function GET() {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    // Since we don't have a tasks collection in the CMS, we'll return mock data
    const mockTasks = {
      docs: [
        {
          id: '1',
          title: 'Example Task 1',
          description: 'This is an example task',
          status: 'todo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Example Task 2',
          description: 'This is another example task',
          status: 'in-progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      totalDocs: 2,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };

    return NextResponse.json(mockTasks, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const body = await request.json();

    // Since we don't have a tasks collection in the CMS, we'll return mock data
    const mockTask = {
      id: Math.floor(Math.random() * 1000).toString(),
      title: body.title,
      description: body.description,
      status: body.status || 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(mockTask, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
