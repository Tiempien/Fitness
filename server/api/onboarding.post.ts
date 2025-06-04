import { Onboarding, User, CoachClient } from '~/server/models';
import { z } from 'zod';

const onboardingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  fitnessGoals: z.string(),
  height: z.number().positive(),
  weight: z.number().positive(),
  medicalConditions: z.string(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, onboardingSchema.parse);
    
    // Create a new user first
    const user = await User.create({
      name: `${body.firstName} ${body.lastName}`,
      email: body.email,
      password: '', // This should be changed by the user later
      role: 'client',
      isActive: false,
    });

    // Create the onboarding record
    const onboarding = await Onboarding.create({
      ...body,
      userId: user.id,
    });

    // Auto assign a coach to the user
    const coach = await CoachClient.create({
      coachId: 2,
      clientId: user.id,
    });
    

    return {
      message: 'Onboarding completed successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      onboarding: {
        id: onboarding.id,
        ...body,
      },
    };
  } catch (error) {
    console.error('Onboarding error:', error);
    throw createError({
      statusCode: 400,
      message: 'Failed to complete onboarding',
    });
  }
}); 