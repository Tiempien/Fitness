<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-cotapDarkGreen">Mijn Programma</h1>
    <div v-if="loading" class="text-center py-8 text-gray-500">
      Programma wordt geladen...
    </div>
    <div v-else-if="myPlans.length === 0" class="text-center py-8 text-gray-500">
      Je hebt nog geen programma. Neem contact op met je coach!
    </div>
    <div v-else>
      <div v-for="plan in sortedPlans" :key="plan.id" class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex justify-between items-start mb-2">
          <h2 class="text-2xl font-semibold text-cotapDarkGreen">{{ plan.title }}</h2>
          <div class="flex items-center space-x-2">
            <div class="text-sm text-gray-600">
              Startdatum: {{ formatDate(plan.startDate) }}
            </div>
            <div v-if="isPlanCompleted(plan)" class="flex items-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="ml-1">Voltooid</span>
            </div>
          </div>
        </div>
        <p class="text-gray-700 mb-2">{{ plan.description }}</p>
        
        <div class="mt-4">
          <div class="flex items-center justify-between cursor-pointer" @click="togglePlan(plan.id)">
            <h3 class="text-lg font-medium text-gray-800">Oefeningen</h3>
            <div class="flex items-center">
              <span class="text-sm text-gray-600 mr-2">
                {{ plan.WorkoutExercises.length }} oefeningen
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 transform transition-transform duration-200"
                :class="{ 'rotate-180': expandedPlans[plan.id] }"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div 
            v-if="plan.WorkoutExercises.length === 0" 
            class="text-gray-400 mt-2"
          >
            Geen oefeningen toegevoegd.
          </div>
          
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div 
              v-if="!isPlanCompleted(plan) || expandedPlans[plan.id]" 
              class="space-y-3 mt-3"
            >
              <div 
                v-for="exercise in plan.WorkoutExercises" 
                :key="exercise.id" 
                class="bg-gray-50 p-4 rounded-md flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div class="font-semibold text-cotapDarkGreen">{{ exercise.Exercise.name }}</div>
                  <div class="text-sm text-gray-600">{{ exercise.Exercise.description }}</div>
                  <div class="text-xs text-gray-400 mt-1">Categorie: {{ exercise.Exercise.category }} | Niveau: {{ exercise.Exercise.difficulty }}</div>
                  <div v-if="exercise.Exercise.instructionalVideoUrl" class="mt-1">
                    <a :href="exercise.Exercise.instructionalVideoUrl" target="_blank" class="text-blue-500 underline text-xs">Bekijk instructievideo</a>
                  </div>
                </div>
                <div class="mt-2 md:mt-0 md:text-right">
                  <div class="text-sm font-medium">Sets: <span class="text-cotapDarkGreen">{{ exercise.sets }}</span> × Reps: <span class="text-cotapDarkGreen">{{ exercise.reps }}</span></div>
                  <div class="text-xs text-gray-500">Rust: {{ exercise.restSeconds || 0 }}s</div>
                  <div v-if="exercise.notes" class="text-xs text-gray-400 mt-1">Notities: {{ exercise.notes }}</div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'with-navbar',
  middleware: 'auth',
})
import { ref, computed, onMounted } from 'vue'
import { useUserSession } from '#imports'

const { user } = useUserSession()
const workoutPlans = ref<any[]>([])
const loading = ref(true)
const expandedPlans = ref<Record<string, boolean>>({})

const fetchWorkoutPlans = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/workout-plans')
    workoutPlans.value = data
  } catch (e) {
    workoutPlans.value = []
  } finally {
    loading.value = false
  }
}

const myPlans = computed(() => {
  if (!user.value) return []
  // Try both id and userId for compatibility
  const userId = (user.value as any)?.id || (user.value as any)?.userId
  return workoutPlans.value.filter((plan: any) => plan.userId === userId)
})

const sortedPlans = computed(() => {
  return [...myPlans.value].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime()
    const dateB = new Date(b.startDate).getTime()
    return dateA - dateB
  })
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const isPlanCompleted = (plan: any) => {
  const endDate = new Date(plan.endDate)
  const today = new Date()
  return endDate < today
}

const togglePlan = (planId: string) => {
  expandedPlans.value[planId] = !expandedPlans.value[planId]
}

onMounted(() => {
  fetchWorkoutPlans()
})
</script>

<style scoped>
.text-cotapDarkGreen {
  color: #1b5e20;
}
</style>
