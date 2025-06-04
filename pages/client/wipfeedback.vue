<template>
  <div class="min-h-screen bg-gray-100">

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Feedback History -->
        <div class="bg-white shadow-sm overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Feedback History
            </h3>
          </div>
          <div class="border-t border-gray-200">
            <ul class="divide-y divide-gray-200">
              <li v-for="feedback in feedbackHistory" :key="feedback.id" class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <p class="text-sm font-medium text-indigo-600 truncate">
                      {{ feedback.sessionName }}
                    </p>
                    <p class="ml-2 text-sm text-gray-500">
                      {{ formatDate(feedback.date) }}
                    </p>
                  </div>
                  <div class="ml-2 shrink-0 flex">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Rating: {{ feedback.rating }}/5
                    </span>
                  </div>
                </div>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ feedback.comments }}
                  </p>
                </div>
                <div v-if="feedback.coachResponse" class="mt-2 bg-gray-50 p-3 rounded-md">
                  <p class="text-sm font-medium text-gray-900">Coach's Response:</p>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ feedback.coachResponse }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Submit New Feedback -->
        <div class="mt-6 bg-white shadow-sm overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Submit New Feedback
            </h3>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
            <form @submit.prevent="handleSubmitFeedback">
              <div class="space-y-4">
                <div>
                  <label for="session" class="block text-sm font-medium text-gray-700">Training Session</label>
                  <select
                    v-model="newFeedback.sessionId"
                    id="session"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-xs py-2 px-3 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option v-for="session in upcomingSessions" :key="session.id" :value="session.id">
                      {{ session.name }} - {{ formatDate(session.date) }}
                    </option>
                  </select>
                </div>

                <div>
                  <label for="rating" class="block text-sm font-medium text-gray-700">Rating</label>
                  <select
                    v-model="newFeedback.rating"
                    id="rating"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-xs py-2 px-3 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div>
                  <label for="comments" class="block text-sm font-medium text-gray-700">Comments</label>
                  <textarea
                    v-model="newFeedback.comments"
                    id="comments"
                    rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-xs py-2 px-3 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Share your thoughts about the training session..."
                  ></textarea>
                </div>
              </div>

              <div class="mt-5">
                <button
                  type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-xs text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
definePageMeta({
  layout: 'with-navbar',
  middleware: 'auth',
})
interface Feedback {
  id: string
  sessionId: string
  sessionName: string
  date: string
  rating: number
  comments: string
  coachResponse?: string
}

interface TrainingSession {
  id: string
  name: string
  date: string
}

// Mock data for demonstration
const feedbackHistory: Feedback[] = [
  {
    id: '1',
    sessionId: '1',
    sessionName: 'Upper Body Strength Training',
    date: '2024-03-04',
    rating: 4,
    comments: 'Great session! The exercises were challenging but manageable.',
    coachResponse: 'Thanks for the feedback! i willll adjust the weights for next time.'
  },
  {
    id: '2',
    sessionId: '2',
    sessionName: 'Lower Body Strength Training',
    date: '2024-03-06',
    rating: 5,
    comments: 'Perfect workout! Really felt the burn in my legs.',
    coachResponse: 'Glad you enjoyed it! Your form is improving well.'
  }
]

const upcomingSessions: TrainingSession[] = [
  {
    id: '3',
    name: 'Full Body Workout',
    date: '2024-03-08'
  },
  {
    id: '4',
    name: 'Upper Body Strength Training',
    date: '2024-03-11'
  }
]

const newFeedback = ref({
  sessionId: '',
  rating: 3,
  comments: ''
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const handleSubmitFeedback = async () => {
  try {
    // TODO: Replace with actual API call
    console.log('Submitting feedback:', newFeedback.value)
    
    // Reset form
    newFeedback.value = {
      sessionId: '',
      rating: 3,
      comments: ''
    }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    // TODO: Show error message to user
  }
}
</script> 