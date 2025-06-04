<template>
  <div class="min-h-screen bg-gray-100">
    <main class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="px-4 sm:px-0">
        <!-- Training Calendar -->
        <div class="bg-white shadow-sm overflow-hidden sm:rounded-lg mt-8">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Coaching gesprek
            </h3>
          </div>
          <div class="border-t border-gray-200 p-4">
            <TrainingCalendar />
          </div>
        </div>
      </div>
    </main>

    <!-- Feedback Modal -->
    <div v-if="showFeedbackModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Add Session Feedback
            </h3>
            <form @submit.prevent="handleSubmitFeedback">
              <div class="space-y-4">
                <div>
                  <label for="feedback-rating" class="block text-sm font-medium text-gray-700">Rating</label>
                  <select
                    v-model="feedback.rating"
                    id="feedback-rating"
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
                  <label for="feedback-comments" class="block text-sm font-medium text-gray-700">Comments</label>
                  <textarea
                    v-model="feedback.comments"
                    id="feedback-comments"
                    rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-xs py-2 px-3 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>

              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-xs px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Submit
                </button>
                <button
                  type="button"
                  @click="showFeedbackModal = false"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-xs px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TrainingCalendar from '@/components/TrainingCalendar.vue'
const { loggedIn, user, fetch: refreshSession } = useUserSession()

definePageMeta({
  layout: 'with-navbar',
  middleware: 'auth',
})

interface TrainingDay {
  id: string
  name: string
  time: string
  description: string
}

interface Program {
  id: string
  name: string
  description: string
  duration: number
  startDate: string
}

interface Feedback {
  rating: number
  comments: string
  sessionId: string
}

// Mock data for demonstration
const currentProgram: Program = {
  id: '1',
  name: 'Beginner Strength Program',
  description: 'A 12-week program focused on building foundational strength',
  duration: 12,
  startDate: '2024-03-01'
}

const showFeedbackModal = ref(false)
const selectedSession = ref<TrainingDay | null>(null)
const feedback = ref<Feedback>({
  rating: 3,
  comments: '',
  sessionId: ''
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const openFeedbackModal = (session: TrainingDay) => {
  selectedSession.value = session
  feedback.value.sessionId = session.id
  showFeedbackModal.value = true
}

const handleSubmitFeedback = async () => {
  try {
    console.log('Submitting feedback:', feedback.value)
    showFeedbackModal.value = false
    feedback.value = {
      rating: 3,
      comments: '',
      sessionId: ''
    }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    // TODO: Show error message to user
  }
}
</script> 