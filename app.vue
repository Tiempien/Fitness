<template>
  <div class="bg-[#F5F4ED] min-h-screen">
    <NuxtLayout>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession()
</script>

<style>
.btn-cotapDarkGreen {
  color: #1E4730;
  background-color: #EDE8DB;
}
/* COTAP Gradient Button Styles */
.cotap-gradient-btn {
  background: linear-gradient(200deg, #26a843, #476450);
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

}

.cotap-gradient-btn:hover {
  background: linear-gradient(to right, #218838, #1ba87d);
}

.cotap-gradient-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* COTAP Gradient Outline Button */
.cotap-gradient-outline-btn {
  background: white;
  color: #26a843;
  position: relative;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: all 0.5s ease;

}

.cotap-gradient-outline-btn::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  margin: -2px;
  border-radius: inherit;
  background: linear-gradient(200deg, #26a843, #476450);
}

.cotap-gradient-outline-btn:hover {
  color: white;
  background: linear-gradient(200deg, #26a843, #476450);
}

/* Dark theme adjustments */
.dark .cotap-gradient-outline-btn {
  background: #1f2937;
  color: #4ade80;
}

.dark .cotap-gradient-outline-btn:hover {
  color: white;
}
/* Gradient Text Style */
.cotap-gradient-text {
  background: linear-gradient(200deg, #26a843, #476450);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
  font-weight: 700;
}

/* Dark theme adjustments */
.dark .cotap-gradient-text {
  background: linear-gradient(to right, #3dd467, #34d8b5);
  -webkit-background-clip: text;
  background-clip: text;
}
</style>