import { Exercise } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.name || !body.category || !body.difficulty) {
      throw createError({
        statusCode: 400,
        message: 'Name, category, and difficulty are required'
      })
    }

    // Validate category
    const validCategories = ['strength', 'cardio', 'flexibility', 'balance']
    if (!validCategories.includes(body.category)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid category'
      })
    }

    // Validate difficulty
    const validDifficulties = ['beginner', 'intermediate', 'advanced']
    if (!validDifficulties.includes(body.difficulty)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid difficulty level'
      })
    }

    const exercise = await Exercise.findByPk(id)
    if (!exercise) {
      throw createError({
        statusCode: 404,
        message: 'Exercise not found'
      })
    }

    await exercise.update({
      name: body.name,
      description: body.description,
      category: body.category,
      difficulty: body.difficulty,
      instructionalVideoUrl: body.instructionalVideoUrl
    })
    
    return exercise
  } catch (error: any) {
    console.error('Error updating exercise:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error updating exercise'
    })
  }
}) 