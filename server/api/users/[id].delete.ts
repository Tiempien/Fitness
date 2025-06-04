import { User } from '~/server/models';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw createError({ statusCode: 404, message: 'User not found' });
    }

    await user.destroy();

    return {
      message: 'User deleted successfully',
    };
  } catch (error) {
    console.error('Delete error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to delete user',
    });
  }
});