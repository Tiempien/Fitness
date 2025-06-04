<template>
  <div>
    <!-- List of checkboxes -->
    <ul class="text-sm font-medium text-secondary-500 bg-white ">
      <li
          v-for="item in items"
          :key="item.value ?? item"
          class="w-full border-gray-200 rounded-t-lg dark:border-gray-600"
      >
        <div class="flex items-center">
          <input
              v-model="selectedChannels"
              :value="item.value ?? item"
              type="checkbox"
              class="w-4 h-4 border-gray-300 rounded-xs"
              :id="'label-' + item.value ?? item"
          />
          <label :for="'label'+ item.value ?? item " class="w-full py-2 ms-2 text-sm text-black font-medium">
            {{ item.label ?? item }}
          </label>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    // Prop for the selected channels
    modelValue: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [
        'a', 'b'
      ],
    }
  },
  data() {
    return {
      newValue: '',
      newLabel: '',
      // List of channels with values and labels
      selectedChannels: this.modelValue, // Bind the selected channels to modelValue
    };
  },
  watch: {
    // Watch for changes in selected channels and update the parent component
    selectedChannels(newValue) {
      this.$emit('update:modelValue', newValue);
    },
  },
  methods: {
    // Method to add a new channel to the list
    addNewChannel() {
      if (this.newValue && this.newLabel) {
        this.channels.push({
          value: this.newValue,
          label: this.newLabel ?? this.newValue,
        });
        this.newValue = '';
        this.newLabel = '';
      }
    },
  },
};
</script>
