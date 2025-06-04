import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { User } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event);
    const formData = await readMultipartFormData(event);
    
    if (!formData || !formData[0]) {
      throw createError({
        statusCode: 400,
        message: 'No image file provided'
      });
    }

    const file = formData[0];
    if (!file.type?.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        message: 'File must be an image'
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${user.userId}-${timestamp}-${file.filename}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    await writeFile(filepath, file.data);

    // Update user profile with new image URL
    const userProfile = await User.findByPk(user.userId);
    if (!userProfile) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      });
    }

    const imageUrl = `/uploads/${filename}`;
    await userProfile.update({ profilePicture: imageUrl });

    return {
      url: imageUrl,
      message: 'Profile picture uploaded successfully'
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to upload profile picture'
    });
  }
}); 