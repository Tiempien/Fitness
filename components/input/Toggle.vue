<template>
  <div class="my-4">
    <div class="font-semibold mb-2">
      {{ label }}
    </div>
    <div
        class="w-20 h-5 flex items-center rounded-sm p-1 cursor-pointer transition-all relative"
        :class="modelValue ? 'bg-cotap-green': 'bg-red-500 '"
        @click="$emit('update:modelValue', !modelValue)"
    >
      <div
          class="w-4 h-4 bg-white rounded-sm shadow-md transform transition-all"
          :class="modelValue ? 'translate-x-14' : 'translate-x-0'"
      />
      <span class="absolute w-full text-center text-white font-bold text-sm">
        {{ modelValue ? 'Wel' : 'Geen' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
  width?: 10,
  label: string,
  modelValue: Boolean, // This allows the parent to control the state
    }>(),
    {
      width: 10 // Default value if not provided
    }
)
defineEmits(['update:modelValue']); // Emits changes back to the parent
</script>
