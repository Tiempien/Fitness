<template>
  <div class="relative w-full h-[250px] bg-gray-300 flex items-center text-white">
    <img src="https://www.cotap.nl/content/files/opmaak/2022/sliders/ambiant%20-%20slider.jpg" class="absolute inset-0 w-full h-full object-cover" />
    <div class="relative z-10 pl-16">
      <h2 class="text-5xl font-bold">
        <AuthState v-slot="{ loggedIn, clear, user }">
          Hallo {{ user.displayName }},
        </AuthState>
      </h2>
      <h3 class="text-4xl font-bold">Welkom terug!</h3>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>