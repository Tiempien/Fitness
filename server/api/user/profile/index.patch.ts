import { User } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event);
    const body = await readBody(event);
    
    const userProfile = await User.findByPk(user.userId);
    if (!userProfile) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      });
    }

    // Update only allowed fields
    await userProfile.update({
      profilePicture: body.profilePicture,
      bio: body.bio
    });

    return {
      message: 'Profile updated successfully',
      profilePicture: userProfile.profilePicture,
      bio: userProfile.bio
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to update user profile'
    });
  }
}); 