import payload from 'payload';

// This is a simple seed function that will be run by the Payload CLI
export const seed = async () => {
  console.log('Starting database seeding...');
  
  // Create admin user if it doesn't exist
  const { docs: existingUsers } = await payload.find({
    collection: 'users',
    limit: 1,
  });

  if (existingUsers.length === 0) {
    console.log('Creating admin user...');
    
    try {
      await payload.create({
        collection: 'users',
        data: {
          email: 'admin@example.com',
          password: 'password123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
        },
      });
      
      await payload.create({
        collection: 'users',
        data: {
          email: 'user@example.com',
          password: 'password123',
          firstName: 'Regular',
          lastName: 'User',
          role: 'user',
        },
      });
      
      console.log('Admin and regular users created successfully');
    } catch (error) {
      console.error('Error creating users:', error);
    }
  }

  console.log('Seeding complete');
};
