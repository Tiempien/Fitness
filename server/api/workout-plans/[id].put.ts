import { WorkoutPlan } from '~/server/models'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Workout plan ID is required'
      })
    }

    const body = await readBody(event)
    const { title, description, userId, coachDescription, startDate, endDate } = body

    const workoutPlan = await WorkoutPlan.findByPk(id)
    if (!workoutPlan) {
      throw createError({
        statusCode: 404,
        message: 'Workout plan not found'
      })
    }

    await workoutPlan.update({
      title,
      description,
      userId,
      coachDescription,
      startDate,
      endDate
    })
    
    return workoutPlan
  } catch (error) {
    console.error('Error updating workout plan:', error)
    throw createError({
      statusCode: 500,
      message: 'Error updating workout plan'
    })
  }
}) 