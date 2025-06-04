<template>
  <!-- Hero Section -->
  <HomePageHero />
  <AuthState v-slot="{ loggedIn, clear, user }">
  <div class="p-6">
    <div class="flex">
      <div class="flex-1">
        <div class="flex flex-wrap gap-4">

          <!-- ADMIN / BEHEER -->
          <template v-if="user.role === 'admin'">
            <UCard class="p-4 w-full md:w-[30%]">
              <div class="flex items-center mb-2">
                <h2 class="text-xl font-semibold text-gray-800">Beheer</h2>
              </div>
              <p class="text-gray-600 mb-4">Beheer gebruikers</p>
              <UButton to="/admin/usermangement" variant="solid" class="btn-cotapDarkGreen text-white">
                Beheer gebruikers
              </UButton>
            </UCard>
          </template>

          <!-- CLIENT -->
          <template v-if="user.role === 'client'">
            <UCard class="p-4 w-full md:w-[30%]">
              <h2 class="text-xl font-semibold text-gray-800">Agenda</h2>
              <UButton to="/client/schedule" class="btn-cotapDarkGreen mt-2">Plan je afspraak</UButton>
            </UCard>
            <UCard class="p-4 w-full md:w-[30%]">
              <h2 class="text-xl font-semibold text-gray-800">Programma</h2>
              <p class="text-gray-600 mb-4">Bekijk hier je programma</p>
              <UButton to="/client/program" class="btn-cotapDarkGreen">Naar programma</UButton>
            </UCard>


          </template>

          <!-- COACH -->
          <template v-if="user.role === 'coach'">
            <UCard class="p-4 w-full md:w-[30%]">
              <h2 class="text-xl font-semibold text-gray-800">Cliënten</h2>
              <p class="text-gray-600 mb-4">Bekijk en beheer je cliënten.</p>
              <UButton to="/coach/clients" class="btn-cotapDarkGreen">Bekijk cliënten</UButton>
            </UCard>

            <UCard class="p-4 w-full md:w-[30%]">
              <h2 class="text-xl font-semibold text-gray-800">Programma's</h2>
              <p class="text-gray-600 mb-4">Beheer trainingsprogramma's.</p>
              <UButton to="/coach/workout-plans" class="btn-cotapDarkGreen">Bekijk programma's</UButton>
            </UCard>

            <UCard class="p-4 w-full md:w-[30%]">
              <h2 class="text-xl font-semibold text-gray-800">Oefeningen</h2>
              <p class="text-gray-600 mb-4">Dit zijn oefeningen die in de programma's gebruikt kunnen worden.</p>
              <UButton to="/coach/exercises" class="btn-cotapDarkGreen">Bekijk programma's</UButton>
            </UCard>

            <UCard class="p-4 w-full md:w-[30%]">
              <h2 class="text-xl font-semibold text-gray-800">Feedback</h2>
              <p class="text-gray-600 mb-4">Bekijk en beheer feedback.</p>
              <UButton to="/coach/feedback" class="btn-cotapDarkGreen">Bekijk feedback</UButton>
            </UCard>
          </template>

        </div>
      </div>
    </div>
  </div>
</AuthState>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'with-navbar',
  middleware: 'auth',
})

</script>
