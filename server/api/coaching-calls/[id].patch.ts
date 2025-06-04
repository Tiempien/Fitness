import { defineEventHandler, readBody, getRouterParam } from 'h3';
import { sequelize } from '../../models';

export default defineEventHandler(async (event) => {
  const CoachingCall = sequelize.models.CoachingCall;
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const call = await CoachingCall.findByPk(id);
  if (!call) return { error: 'Not found' };
  await call.update(body);
  return call;
}); 