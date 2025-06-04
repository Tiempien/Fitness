import { User } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event);
    const userProfile = await User.findByPk(user.userId);
    
    if (!userProfile) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      });
    }

    return {
      profilePicture: userProfile.profilePicture,
      bio: userProfile.bio
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch user profile'
    });
  }
}); 