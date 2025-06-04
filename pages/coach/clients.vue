<template>
  <div class="p-4">
    <div class="bg-white shadow-sm overflow-hidden sm:rounded-lg mb-8">
      <div class="px-4 py-5 sm:px-6">
        <h2 class="text-xl font-bold">Coach Call Calendar</h2>
      </div>
      <div class="border-t border-gray-200 p-4">
        <TrainingCalendar :coachId="user?.userId" />
      </div>
    </div>
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">Cliëntenoverzicht</h2>
        </div>
      </template>

      <div v-if="isLoading" class="flex justify-center items-center p-8">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
      </div>

      <div v-else-if="error" class="p-4 text-red-500">
        {{ error }}
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard v-for="client in clients" :key="client.id" class="hover:shadow-lg transition-shadow">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-semibold">{{ client.name }}</h3>
            </div>
          </template>

          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-envelope" class="text-gray-500" />
              <span>{{ client.email }}</span>
            </div>

            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="text-gray-500" />
              <span>{{ client.currentProgram || 'Geen programma' }}</span>
            </div>

            <div v-if="client.goals" class="mt-4">
              <h4 class="font-medium text-sm text-gray-600">Doelen:</h4>
              <p class="text-sm mt-1">{{ client.goals }}</p>
            </div>

            <div v-if="client.notes" class="mt-4">
              <h4 class="font-medium text-sm text-gray-600">Notities:</h4>
              <p class="text-sm mt-1">{{ client.notes }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <div v-if="!isLoading && clients.length === 0" class="text-center py-8">
        <UIcon name="i-heroicons-user-group" class="h-12 w-12 mx-auto text-gray-400" />
        <p class="mt-2 text-gray-500">Geen cliënten gevonden.</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFetch } from 'nuxt/app'
import TrainingCalendar from '@/components/TrainingCalendar.vue'
const { loggedIn, user, fetch: refreshSession } = useUserSession()

definePageMeta({
  layout: 'with-navbar',
  middleware: 'auth',
})

interface Client {
  id: string
  name: string
  email: string
  phone: string
  currentProgram: string
  goals: string
  progress: number
  notes: string
}

const clients = ref<Client[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const fetchClients = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await fetch('/api/coach/clients')
    if (!response.ok) {
      throw new Error('Failed to fetch clients')
    }
    const data = await response.json()
    clients.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred while fetching clients'
    console.error('Error fetching clients:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchClients()
})
</script> 