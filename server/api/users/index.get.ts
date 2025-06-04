import { User } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Verberg wachtwoord
    });

    return users;
  } catch (error) {
    console.error('Database error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch users from database',
    });
  }
});
