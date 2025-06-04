import { Exercise } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const exercises = await Exercise.findAll({
      order: [['name', 'ASC']]
    })
    
    return exercises;
  } catch (error) {
    console.error('Error fetching exercises:', error)
    throw createError({
      statusCode: 500,
      message: 'Error fetching exercises'
    })
  }
});