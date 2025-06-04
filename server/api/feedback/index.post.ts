import { defineEventHandler, readBody } from 'h3';
import { sequelize } from '../../models';

export default defineEventHandler(async (event) => {
  const Feedback = sequelize.models.Feedback;
  const body = await readBody(event);
  // Required: type, content, rating, userId, targetId
  if (!body.type || !body.content || !body.rating || !body.userId || !body.targetId) {
    return { error: 'Missing required fields' };
  }

  // Check if feedback already exists for this user and target
  let feedback = await Feedback.findOne({
    where: {
      userId: body.userId,
      targetId: body.targetId
    }
  });

  if (feedback) {
    // Update existing feedback
    await feedback.update({
      type: body.type,
      content: body.content,
      rating: body.rating
    });
  } else {
    // Create new feedback
    feedback = await Feedback.create({
      type: body.type,
      content: body.content,
      rating: body.rating,
      userId: body.userId,
      targetId: body.targetId
    });
  }
  return feedback;
}); 