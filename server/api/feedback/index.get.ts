import { defineEventHandler, getQuery } from 'h3';
import { sequelize } from '../../models';

export default defineEventHandler(async (event) => {
  const { targetId } = getQuery(event);
  const Feedback = sequelize.models.Feedback;
  const User = sequelize.models.User;
  const where: any = {};
  // Assume user is attached to event.context.user (adjust if needed)
  const user = event.context?.user;
  if (targetId) where['targetId'] = targetId;
  if (user && user.role === 'client') {
    where['userId'] = user.id || user.userId;
  }
  const feedbacks = await Feedback.findAll({
    where,
    include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
    order: [['createdAt', 'DESC']]
  });
  // Map user info into top-level fields for frontend convenience
  return feedbacks.map(fb => {
    const plain = fb.toJSON();
    return {
      ...plain,
      userName: plain.user?.name || 'Unknown',
      userEmail: plain.user?.email || '',
    };
  });
}); 