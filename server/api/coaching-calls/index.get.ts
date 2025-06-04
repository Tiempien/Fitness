import { defineEventHandler, getQuery } from 'h3';
import { sequelize } from '../../models';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) return { error: 'Unauthorized' };

  const { clientId, coachId } = getQuery(event);
  const where: any = {};

  if (clientId) where['clientId'] = clientId;
  if (coachId) where['coachId'] = coachId;

  const CoachingCall = sequelize.models.CoachingCall;
  const User = sequelize.models.User;

  const calls = await CoachingCall.findAll({
    where,
    include: [
      { model: User, as: 'client', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'coach', attributes: ['id', 'name', 'email'] }
    ],
    order: [['scheduledAt', 'ASC']]
  });

  const sanitizedCalls = calls.map((call: any) => {
    const callJson = call.toJSON();

    if (callJson.clientId !== user.userId && user.role === 'client') {
      callJson.client = null; // of eventueel: { id: callJson.client.id }
    }

    return callJson;
  });

  return sanitizedCalls;
});
