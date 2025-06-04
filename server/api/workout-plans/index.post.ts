import { WorkoutPlan } from '~/server/models'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { title, description, userId, coachDescription, startDate, endDate } = body

    const workoutPlan = await WorkoutPlan.create({
      title,
      description,
      userId,
      coachDescription,
      startDate,
      endDate
    })
    
    return workoutPlan
  } catch (error) {
    console.error('Error creating workout plan:', error)
    throw createError({
      statusCode: 500,
      message: 'Error creating workout plan'
    })
  }
}) 