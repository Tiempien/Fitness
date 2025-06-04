<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
    <div class="absolute inset-0 z-0">
      <img src="/images/background.png" alt="Background" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black blur-xs bg-opacity-50"></div>
    </div>
    <div class="w-full max-w-md mx-auto z-10">
      <div v-if="!completed" class="bg-white shadow-sm sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Intake - Boke Coaching
          </h3>
          <div class="mt-2 max-w-xl text-sm text-gray-500">
            <p>Vul je persoonlijke gegevens in zodat je coach een persoonlijk trainingsprogramma voor je kan samenstellen.</p>
          </div>
          <UAlert v-if="errorMessage" color="red" :title="errorMessage" class="mt-4" />
          <form class="mt-5 space-y-6" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <!-- Persoonlijke informatie -->
              <div class="sm:col-span-3">
                <label for="first-name" class="block text-sm font-medium text-gray-700">Voornaam</label>
                <div class="mt-1">
                  <input
                    type="text"
                    v-model="form.firstName"
                    placeholder="Voornaam"
                    id="first-name"
                    class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="last-name" class="block text-sm font-medium text-gray-700">Achternaam</label>
                <div class="mt-1">
                  <input
                    type="text"
                    v-model="form.lastName"
                    id="last-name"
                    class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-6">
                <label for="email" class="block text-sm font-medium text-gray-700">E-mailadres</label>
                <div class="mt-1">
                  <input
                    type="email"
                    v-model="form.email"
                    id="email"
                    class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-6">
                <label for="phone" class="block text-sm font-medium text-gray-700">Telefoonnummer</label>
                <div class="mt-1">
                  <input
                    type="tel"
                    v-model="form.phone"
                    id="phone"
                    placeholder="06 12345678"
                    class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <!-- Fitness informatie -->
              <div class="sm:col-span-6">
                <div class="flex items-center gap-2">
                  <label for="fitness-goals" class="block text-sm font-medium text-gray-700">Fitnessdoelen</label>
                  <button 
                    type="button" 
                    @click="showSmartInfo = !showSmartInfo"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div v-if="showSmartInfo" class="mt-1 mb-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                  <p class="font-medium mb-1">Maak je doelen SMART:</p>
                  <ul class="list-disc list-inside space-y-1">
                    <li><strong>S</strong>pecifiek: Beschrijf precies wat je wilt bereiken</li>
                    <li><strong>M</strong>eetbaar: Hoe ga je je voortgang meten?</li>
                    <li><strong>A</strong>chievable: Is het doel haalbaar?</li>
                    <li><strong>R</strong>ealistisch: Past het bij jouw situatie?</li>
                    <li><strong>T</strong>ijdgebonden: Wanneer wil je het doel bereiken?</li>
                  </ul>
                  <div class="mt-3 pt-3 border-t border-gray-200">
                    <p class="font-medium mb-2">Voorbeelden van SMART doelen:</p>
                    <ul class="space-y-2">
                      <li class="flex items-start">
                        <span class="text-green-600 mr-2">✓</span>
                        <span>"Binnen 3 maanden wil ik 5kg lichter zijn door 3x per week te trainen en mijn voeding aan te passen."</span>
                      </li>
                      <li class="flex items-start">
                        <span class="text-green-600 mr-2">✓</span>
                        <span>"Over 6 maanden wil ik 10 push-ups achter elkaar kunnen doen."</span>
                      </li>
                      <li class="flex items-start">
                        <span class="text-green-600 mr-2">✓</span>
                        <span>"Binnen 2 maanden wil ik 5km kunnen hardlopen zonder te stoppen."</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="mt-1">
                  <textarea
                    v-model="form.fitnessGoals"
                    id="fitness-goals"
                    rows="3"
                    class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Beschrijf je fitnessdoelen volgens het SMART principe..."
                  ></textarea>
                </div>
              </div>

              <div class="sm:col-span-6">
                <label for="commitment" class="block text-sm font-medium text-gray-700">Wat ben je bereid te doen?</label>
                <div class="mt-1">
                  <textarea
                    v-model="form.commitment"
                    id="commitment"
                    rows="3"
                    class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Bijvoorbeeld: 2 avonden per week trainen, voeding aanpassen, meer water drinken..."
                  ></textarea>
                </div>
              </div>
              <!-- Medische informatie -->
              <div class="sm:col-span-6">
                <label for="medical-conditions" class="block text-sm font-medium text-gray-700">Medische aandoeningen</label>
                <div class="mt-1">
                  <textarea
                    v-model="form.medicalConditions"
                    id="medical-conditions"
                    rows="3"
                    class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Geef hier eventuele medische aandoeningen of blessures aan die je training kunnen beïnvloeden"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="w-full mt-4 bg-cotap-green hover:bg-black text-white py-3 px-4 rounded-md font-medium transition-all p-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Verzenden...' : 'Intake verzenden' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div v-else class="bg-white shadow-sm sm:rounded-lg p-6 text-center">
        <div class="mb-4">
          <svg class="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Bedankt voor je aanmelding!
        </h3>
        <p class="text-sm text-gray-500 mb-4">
          Je gegevens zijn succesvol opgeslagen. Je coach zal binnenkort contact met je opnemen.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
definePageMeta({
  layout: 'no-navbar',
})
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  fitnessGoals: '',
  commitment: '',
  medicalConditions: ''
})

const errorMessage = ref('')
const loading = ref(false)
const completed = ref(false)
const showSmartInfo = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    const formData = {
      ...form.value
    }

    const response = await $fetch('/api/onboarding', {
      method: 'POST',
      body: formData
    })

  } catch (error: any) {
    console.error('Error during onboarding:', error)
    errorMessage.value = error.data?.message || 'Er is een fout opgetreden bij het opslaan van je gegevens.'
  } finally {
    loading.value = false
    completed.value = true
  }
}
</script>
