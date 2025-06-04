<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
    <!-- Background image -->
    <div class="absolute inset-0 z-0">
      <img src="/images/background.png" alt="Background" class="w-full h-full object-cover" />
      
    </div>

    <!-- Login container -->
    <div class="w-full max-w-md mx-auto z-10">
      <!-- Login card -->
      <UCard class="bg-white dark:bg-gray-800 shadow-xl rounded-md p-6">
        <!-- Logo inside the white box -->
        <div class="flex flex-col items-center justify-center mb-8">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Boke portaal</h1>
        </div>

        <form @submit.prevent="login" class="space-y-4">
          <UAlert v-if="errorMessage" color="error" :title="errorMessage" class="mb-4" />

          <!-- Email input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <div class="relative">
              <UInput
                  id="email"
                  v-model="credentials.email"
                  type="text"
                  class="w-full"
                  :disabled="loading"
              />
            </div>
          </div>

          <!-- Password input -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            </div>
            <div class="relative">
              <UInput
                  id="password"
                  v-model="credentials.password"
                  type='password'
                  class="w-full"
                  :disabled="loading"
              />
            </div>
          </div>


          <!-- Sign in button -->
          <button
              type="submit"
              :disabled="loading"
              class="w-full mt-4 bg-cotap-green hover:bg-black text-white py-3 px-4 rounded-md font-medium transition-all p-4"
          >
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const { fetch: refreshSession } = useUserSession()

definePageMeta({
  layout: 'no-navbar',
})

const credentials = reactive({
  email: '',
  password: '',
})
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const showLoginForm = ref(false)

function toggleLoginForm() {
  showLoginForm.value = !showLoginForm.value
}

async function login() {
  loading.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: credentials
    })

    await refreshSession()
    await navigateTo('/')
  } catch (error) {
    errorMessage.value = 'Invalid login credentials, please try again.'
  } finally {
    loading.value = false
  }
}
</script>