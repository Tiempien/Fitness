import { z } from 'zod';
import { User } from '~/server/models';
import bcrypt from 'bcryptjs';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse);
  const user = await User.findOne({ where: { email } });
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!user || !isPasswordValid) {
    throw createError({
      statusCode: 401,
      message: 'Bad credentials',
    });
  }

  await setUserSession(event, {
    user: {
      userId: user.id,
      login: user.email,
      displayName: user.name,
      role: user.role,
      profilePicture: user.profilePicture,
      
    },
    loggedInAt: new Date(),
  });

  return { success: true };
});