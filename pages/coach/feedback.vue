<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Feedback Overview</h1>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <div class="flex gap-2">
        <button
          v-for="t in feedbackTypes"
          :key="t"
          @click="selectedType = t"
          :class="['px-4 py-2 rounded-full', selectedType === t ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700']"
        >
          {{ t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase() }}
        </button>
      </div>
      <input
        v-model="search"
        type="text"
        placeholder="Search by client or content..."
        class="border rounded px-3 py-2 w-full md:w-64"
      />
    </div>
    <div class="grid gap-4">
      <div
        v-for="fb in filteredFeedbacks"
        :key="fb.id"
        class="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <span class="inline-block px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700 font-semibold mb-2">{{ fb.type }}</span>
          <div class="flex items-center gap-2 mb-1">
            <span v-for="star in 5" :key="star" class="text-yellow-400" v-if="star <= fb.rating">★</span>
            <span v-for="star in 5" :key="star" class="text-gray-300" v-if="star > fb.rating">★</span>
            <span class="ml-2 text-sm text-gray-500">{{ fb.rating }}/5</span>
          </div>
          <p class="text-gray-800 mb-1">{{ fb.content }}</p>
          <p class="text-xs text-gray-500">By {{ fb.userName || 'Unknown' }} on {{ formatDate(fb.createdAt) }}</p>
        </div>
        <!-- Optionally, link to session/program -->
      </div>
      <div v-if="filteredFeedbacks.length === 0" class="text-center text-gray-400 py-8">
        No feedback found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
definePageMeta({
  layout: 'with-navbar',
  middleware: 'auth',
})

interface Feedback {
  id: string
  type: 'PROGRAM' | 'COACH' | 'CONVERSATION'
  content: string
  rating: number
  userId: string
  userName?: string
  createdAt: string
}

const feedbackTypes = ['ALL', 'PROGRAM', 'COACH', 'CONVERSATION']
const selectedType = ref('ALL')
const search = ref('')

const feedbacks = ref<Feedback[]>([])

const filteredFeedbacks = computed(() => {
  return feedbacks.value.filter(fb =>
    (selectedType.value === 'ALL' || fb.type === selectedType.value) &&
    (
      fb.content.toLowerCase().includes(search.value.toLowerCase()) ||
      (fb.userName && fb.userName.toLowerCase().includes(search.value.toLowerCase()))
    )
  )
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

onMounted(async () => {
  try {
    // Fetch feedbacks for the coach
    const res = await fetch('/api/feedback')
    if (!res.ok) throw new Error('Failed to fetch feedbacks')
    let data = await res.json()
    // If userName is not present, fallback to 'Unknown'
    feedbacks.value = data.map((fb: any) => ({
      ...fb,
      userName: fb.userName || 'Unknown',
    }))
  } catch (e) {
    // Optionally handle error
    feedbacks.value = []
  }
})
</script>
