import { Exercise } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    const exercise = await Exercise.findByPk(id)
    if (!exercise) {
      throw createError({
        statusCode: 404,
        message: 'Exercise not found'
      })
    }

    await exercise.destroy()
    return { message: 'Exercise deleted successfully' }
  } catch (error: any) {
    console.error('Error deleting exercise:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error deleting exercise'
    })
  }
}) 