<template>
  <nav class="bg-white shadow-md py-4 px-6 flex items-center justify-between">
    <NuxtLink to="/">
      <div class="flex items-center space-x-2">
        <!-- <img src="https://place-hold.it/450x150" class="h-9"> -->
         <h5>BP</h5>
      </div>
    </NuxtLink>
    <div class="relative w-1/3">

    </div>
    <div class="flex items-center space-x-4">
      <AuthState v-slot="{ loggedIn, clear, user }">
        <template v-if="loggedIn">
          <a href="https://wa.me/+31640726413" target="_blank"><UIcon name="i-lucide-message-circle" class="size-7 bg-green-500" /></a>
          <NuxtLink to="/account" class="flex items-center space-x-2">
            <img 
              :src="user.profilePicture || '/default-avatar.png'" 
              alt="Profile" 
              class="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
            />
            <span class="text-sm text-gray-700">{{ user.name }}</span>
          </NuxtLink>
          <a><UIcon name="i-lucide-log-out" class="size-7 bg-red-500" @click="logout" /></a>
          
        </template>
        <template v-else>
          <NuxtLink to="/login" class="mr-4">Inloggen</NuxtLink>
        </template>
      </AuthState>    
    </div>
    
    
  </nav>
</template>

<script lang="ts" setup>
const {clear} = useUserSession()
async function logout() {
  await navigateTo('/login')
  await clear()
}
</script>