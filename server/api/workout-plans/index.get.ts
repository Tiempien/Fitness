import { WorkoutPlan, WorkoutExercise, Exercise, User } from '~/server/models'

export default defineEventHandler(async (event) => {
  try {
    const workoutPlans = await WorkoutPlan.findAll({
      include: [
        {
          model: WorkoutExercise,
          include: [{
            model: Exercise
          }]
        },
        {
          model: User,
          attributes: ['id', 'name']
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        [{ model: WorkoutExercise, as: 'WorkoutExercises' }, 'order', 'ASC']
      ]
    })
    
    return workoutPlans
  } catch (error) {
    console.error('Error fetching workout plans:', error)
    throw createError({
      statusCode: 500,
      message: 'Error fetching workout plans'
    })
  }
}) 