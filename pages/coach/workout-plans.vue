<template>
    <div class="p-4">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">Programma's</h2>
          <UButton icon="i-heroicons-plus" @click="showCreateModal = true">Nieuw programma</UButton>
        </div>
      </template>
    </UCard>
  </div>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-gray-800"></h1>
      
      <!-- Workout Plan List -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">

        <div v-if="workoutPlans.length === 0" class="text-center py-8 text-gray-500">
          No workout plans found. Create your first plan!
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="plan in workoutPlans" 
            :key="plan.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-800">{{ plan.title }}</h3>
                <p class="text-red-800 mt-1">{{ plan.coachDescription }}</p>
                <hr>
                <p class="text-gray-400 mt-1">{{ plan.description }}</p>

                <p class="text-sm text-gray-500 mt-1">Client: {{ plan.User?.name }}</p>
                <p class="text-sm text-gray-500 mt-1">Start Date: {{ new Date(plan.startDate).toLocaleDateString() }}</p>
                <p class="text-sm text-gray-500 mt-1">End Date: {{ plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'No end date' }}</p>
              </div>
              <div class="flex space-x-2">
                <UButton size="xs" icon="i-heroicons-pencil-square" @click="editPlan(plan)" class="m-1"></UButton>
                <UButton size="xs" icon="i-heroicons-trash" @click="deletePlan(plan.id)" color="red"></UButton>
              </div>
            </div>
            
            <!-- Exercises List -->
            <div class="mt-4">
              <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-700">Exercises</h4>
                <UButton size="xs" icon="i-heroicons-plus" @click="showAddExerciseModal(plan)" class="m-1"></UButton>
              </div>
              <div class="space-y-2">
                <div 
                  v-for="exercise in plan.WorkoutExercises" 
                  :key="exercise.id"
                  class="bg-gray-50 p-3 rounded-md"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="font-medium">{{ exercise.Exercise.name }}</p>
                      <p class="text-sm text-gray-600">
                        {{ exercise.sets }} sets × {{ exercise.reps }} reps
                        <span v-if="exercise.restSeconds"> • {{ exercise.restSeconds }}s rest</span>
                      </p>
                      <p v-if="exercise.notes" class="text-sm text-gray-500 mt-1">{{ exercise.notes }}</p>
                    </div>
                    <UButton size="xs" icon="i-heroicons-trash" @click="removeExercise(plan.id, exercise.id)" color="red"></UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Plan Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">
          {{ editingPlan ? 'Edit Workout Plan' : 'Create Workout Plan' }}
        </h2>
        
        <form @submit.prevent="savePlan" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input 
              v-model="planForm.title"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              v-model="planForm.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Client</label>
            <select 
              v-model="planForm.userId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a client</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Coach Notes</label>
            <textarea 
              v-model="planForm.coachDescription"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Start Date</label>
            <input 
              v-model="planForm.startDate"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">End Date</label>
            <input 
              v-model="planForm.endDate"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <UButton icon="i-heroicons-plus" type="submit">{{ editingPlan ? 'Save Changes' : 'Create Plan' }}</UButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Exercise Modal -->
    <div v-if="showExerciseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Add Exercise</h2>
        
        <form @submit.prevent="saveExercise" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Exercise</label>
            <select 
              v-model="exerciseForm.exerciseId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select an exercise</option>
              <option v-for="exercise in availableExercises" :key="exercise.id" :value="exercise.id">
                {{ exercise.name }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Sets</label>
              <input 
                v-model.number="exerciseForm.sets"
                type="number"
                min="1"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
                required
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Reps</label>
              <input 
                v-model.number="exerciseForm.reps"
                type="number"
                min="1"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
                required
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Rest Time (seconds)</label>
            <input 
              v-model.number="exerciseForm.restSeconds"
              type="number"
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Notes</label>
            <textarea 
              v-model="exerciseForm.notes"
              rows="2"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Order</label>
            <input 
              v-model.number="exerciseForm.order"
              type="number"
              min="1"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
              required
            >
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              type="button"
              @click="showExerciseModal = false"
              class="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
definePageMeta({
  layout: 'with-navbar',
  middleware: 'auth',
})
const workoutPlans = ref([])
const clients = ref([])
const availableExercises = ref([])
const showCreateModal = ref(false)
const showExerciseModal = ref(false)
const editingPlan = ref(null)
const selectedPlan = ref(null)

const planForm = ref({
  title: '',
  description: '',
  userId: '',
  coachDescription: '',
  startDate: new Date().toISOString().split('T')[0], // Default to today
  endDate: '' // Optional end date
})

const exerciseForm = ref({
  exerciseId: '',
  sets: 3,
  reps: 10,
  restSeconds: 60,
  notes: '',
  order: 1
})

// Fetch workout plans
const fetchWorkoutPlans = async () => {
  try {
    const response = await fetch('/api/workout-plans')
    const data = await response.json()
    workoutPlans.value = data
  } catch (error) {
    console.error('Error fetching workout plans:', error)
  }
}

// Fetch clients
const fetchClients = async () => {
  try {
    const response = await fetch('/api/coach/clients')
    const data = await response.json()
    clients.value = data
  } catch (error) {
    console.error('Error fetching clients:', error)
  }
}

// Fetch available exercises
const fetchExercises = async () => {
  try {
    const response = await fetch('/api/exercises')
    const data = await response.json()
    availableExercises.value = data
  } catch (error) {
    console.error('Error fetching exercises:', error)
  }
}

// Save workout plan
const savePlan = async () => {
  try {
    const url = editingPlan.value 
      ? `/api/workout-plans/${editingPlan.value.id}`
      : '/api/workout-plans'
    
    const method = editingPlan.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(planForm.value)
    })

    if (response.ok) {
      await fetchWorkoutPlans()
      showCreateModal.value = false
      resetPlanForm()
    }
  } catch (error) {
    console.error('Error saving workout plan:', error)
  }
}

// Edit workout plan
const editPlan = (plan) => {
  editingPlan.value = plan
  planForm.value = {
    title: plan.title,
    description: plan.description,
    userId: plan.userId,
    coachDescription: plan.coachDescription,
    startDate: plan.startDate,
    endDate: plan.endDate
  }
  showCreateModal.value = true
}

// Delete workout plan
const deletePlan = async (planId) => {
  if (!confirm('Are you sure you want to delete this workout plan?')) return

  try {
    const response = await fetch(`/api/workout-plans/${planId}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await fetchWorkoutPlans()
    }
  } catch (error) {
    console.error('Error deleting workout plan:', error)
  }
}

// Show add exercise modal
const showAddExerciseModal = (plan) => {
  selectedPlan.value = plan
  exerciseForm.value = {
    exerciseId: '',
    sets: 3,
    reps: 10,
    restSeconds: 60,
    notes: '',
    order: plan.WorkoutExercises.length + 1
  }
  showExerciseModal.value = true
}

// Save exercise
const saveExercise = async () => {
  if (!selectedPlan.value) return

  try {
    const response = await fetch(`/api/workout-plans/${selectedPlan.value.id}/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(exerciseForm.value)
    })

    if (response.ok) {
      await fetchWorkoutPlans()
      showExerciseModal.value = false
      resetExerciseForm()
    }
  } catch (error) {
    console.error('Error adding exercise:', error)
  }
}

// Remove exercise from plan
const removeExercise = async (planId, exerciseId) => {
  try {
    const response = await fetch(`/api/workout-plans/${planId}/exercises/${exerciseId}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await fetchWorkoutPlans()
    }
  } catch (error) {
    console.error('Error removing exercise:', error)
  }
}

// Reset plan form
const resetPlanForm = () => {
  planForm.value = {
    title: '',
    description: '',
    userId: '',
    coachDescription: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  }
  editingPlan.value = null
}

// Reset exercise form
const resetExerciseForm = () => {
  exerciseForm.value = {
    exerciseId: '',
    sets: 3,
    reps: 10,
    restSeconds: 60,
    notes: '',
    order: 1
  }
  selectedPlan.value = null
}

onMounted(() => {
  fetchWorkoutPlans()
  fetchClients()
  fetchExercises()
})
</script> 