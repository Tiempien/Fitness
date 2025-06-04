import { User } from '~/server/models';
import { compare, hash } from 'bcrypt';

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event);
    const { currentPassword, newPassword } = await readBody<ChangePasswordBody>(event);
    
    const userProfile = await User.findByPk(user.userId);
    if (!userProfile) {
      throw createError({
        statusCode: 404,
        message: 'Gebruiker niet gevonden'
      });
    }

    // Verify current password
    const isValidPassword = await compare(currentPassword, userProfile.getDataValue('password'));
    if (!isValidPassword) {
      throw createError({
        statusCode: 400,
        message: 'Het huidige wachtwoord is incorrect'
      });
    }

    // Hash new password  
    const hashedPassword = await hash(newPassword, 10);

    // Update password
    await userProfile.update({
      password: hashedPassword
    });

    return {
      message: 'Wachtwoord succesvol gewijzigd'
    };
  } catch (error: any) {
    console.error('Error changing password:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Fout bij het wijzigen van het wachtwoord'
    });
  }
}); 