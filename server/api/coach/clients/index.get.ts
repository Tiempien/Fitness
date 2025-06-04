import { User } from '~/server/models';
import { CoachClient } from '~/server/models'; 

interface SessionUser {
  id: number;
  role: string;
}

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event);
    const coachId = user.userId;

    // Haal de coach op via het model User
    const coach = await User.findByPk(coachId);
    if (!coach) {
      throw createError({
        statusCode: 404,
        message: 'Coach not found',
      });
    }

    // Haal alle clients op die aan deze coach gekoppeld zijn
    const coachClients = await CoachClient.findAll({
      where: {
        coachId: coachId
      },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email'],
        }
      ]
    });

    // Geef alleen de client-objecten terug
    const clients = coachClients
      .filter(coachClient => coachClient.client) // voor de zekerheid, als relatie niet bestaat
      .map(coachClient => coachClient.client);

    return clients;

  } catch (error) {
    console.error('Database error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch clients from database',
    });
  }
});