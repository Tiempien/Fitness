import { WorkoutExercise, WorkoutPlan } from '~/server/models'

export default defineEventHandler(async (event) => {
  try {
    const planId = event.context.params?.id
    const exerciseId = event.context.params?.exerciseId

    if (!planId || !exerciseId) {
      throw createError({
        statusCode: 400,
        message: 'Workout plan ID and exercise ID are required'
      })
    }

    const workoutPlan = await WorkoutPlan.findByPk(planId)
    if (!workoutPlan) {
      throw createError({
        statusCode: 404,
        message: 'Workout plan not found'
      })
    }

    const exercise = await WorkoutExercise.findOne({
      where: {
        id: exerciseId,
        workoutPlanId: planId
      }
    })

    if (!exercise) {
      throw createError({
        statusCode: 404,
        message: 'Exercise not found'
      })
    }

    await exercise.destroy()
    
    return { message: 'Exercise removed successfully' }
  } catch (error) {
    console.error('Error removing exercise:', error)
    throw createError({
      statusCode: 500,
      message: 'Error removing exercise'
    })
  }
}) 