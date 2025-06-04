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

    const workoutPlan = await WorkoutPlan.findByPk(id)
    if (!workoutPlan) {
      throw createError({
        statusCode: 404,
        message: 'Workout plan not found'
      })
    }

    await workoutPlan.destroy()
    
    return { message: 'Workout plan deleted successfully' }
  } catch (error) {
    console.error('Error deleting workout plan:', error)
    throw createError({
      statusCode: 500,
      message: 'Error deleting workout plan'
    })
  }
}) 