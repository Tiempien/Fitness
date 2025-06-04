<template>
  <div class="bg-white p-6 rounded-md shadow-md w-1/4">
    <div class="flex items-center space-x-4">
      <span class="bg-gray-300 text-gray-800 px-4 py-2 rounded-full">HB</span>
      <div>
        <h3 class="text-lg font-semibold">
          <AuthState v-slot="{ loggedIn, clear, user }">
            {{ user.displayName }}
          </AuthState>
        </h3>
      </div>
    </div>
    <ul class="mt-4 space-y-2">
      <li>
        <NuxtLink to="/pages/vueeze-admin" class="flex justify-between text-link font-semibold px-4 py-2 bg-gray-100 rounded-md">
          Materialo Admin <span class="bg-green-500 text-white px-2 py-1 rounded-full">2</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
</script>