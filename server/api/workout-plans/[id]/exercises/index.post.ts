import { WorkoutExercise, WorkoutPlan } from '~/server/models'

export default defineEventHandler(async (event) => {
  try {
    const planId = event.context.params?.id
    if (!planId) {
      throw createError({
        statusCode: 400,
        message: 'Workout plan ID is required'
      })
    }

    const workoutPlan = await WorkoutPlan.findByPk(planId)
    if (!workoutPlan) {
      throw createError({
        statusCode: 404,
        message: 'Workout plan not found'
      })
    }

    const body = await readBody(event)
    const { exerciseId, sets, reps, restSeconds, notes, order } = body

    const exercise = await WorkoutExercise.create({
      workoutPlanId: planId,
      exerciseId,
      sets,
      reps,
      restSeconds,
      notes,
      order
    })
    
    return exercise
  } catch (error) {
    console.error('Error adding exercise:', error)
    throw createError({
      statusCode: 500,
      message: 'Error adding exercise'
    })
  }
}) 