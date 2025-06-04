import { User } from '~/server/models';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password, role } = body;

  try {
    if (!name || !email || !password || !role) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields',
      });
    }

    const newUser = await User.create({ name, email, password, role });

    return {
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error) {
    console.error('Create error:', error);
    throw createError({
      statusCode: 400,
      message: 'Failed to create user',
    });
  }
});
