import { User } from '~/server/models';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw createError({ statusCode: 404, message: 'User not found' });
    }

    const { name, email, password, role } = body;
    const updateData = {
      name,
      email,
      role,
    };
    
    if (password && password.trim() !== "") {
      updateData.password = password;
    }
    
    await user.update(updateData);

    return {
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('Update error:', error);
    throw createError({
      statusCode: 400,
      message: 'Failed to update user',
    });
  }
});
