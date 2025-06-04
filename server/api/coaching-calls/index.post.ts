import { defineEventHandler, readBody } from 'h3';
import { sequelize } from '../../models';

export default defineEventHandler(async (event) => {
  const CoachingCall = sequelize.models.CoachingCall;
  const body = await readBody(event);
  // Required: clientId, coachId, scheduledAt, duration
  if (!body.clientId || !body.coachId || !body.scheduledAt || !body.duration) {
    return { error: 'Missing required fields' };
  }
  const call = await CoachingCall.create({
    clientId: body.clientId,
    coachId: body.coachId,
    scheduledAt: body.scheduledAt,
    duration: body.duration,
    status: 'CONFIRMED',
    notes: body.notes || null
  });
  return call;
}); 