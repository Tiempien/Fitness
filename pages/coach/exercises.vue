<template>
  <div class="p-4 max-w-7xl mx-auto">
    <UCard class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Oefeningenbeheer</h2>
            <p class="text-sm text-gray-500 mt-1">Hier staan alle oefeningen die gebruikt kunnen worden in de programma's.</p>
          </div>
          <UButton
            icon="i-heroicons-plus"
            color="primary"
            @click="openNewExercise"
          >
            Nieuwe Oefening
          </UButton>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Filters -->
        <div class="flex gap-4 flex-wrap">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Zoek oefeningen..."
            class="max-w-xs"
          />
          <USelect
            v-model="categoryFilter"
            :items="[{ label: 'Alle categorieën', value: null }, ...categories]"
            class="w-48"
          />
          <USelect
            v-model="difficultyFilter"
            :items="[{ label: 'Alle niveaus', value: null }, ...difficultyLevels]"
            class="w-48"
          />
        </div>

        <!-- Table -->
        <UTable
          v-model:expanded="expanded"
          :data="filteredExercises"
          :columns="columns"
          :loading="loading"
          :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
          class="flex-1"
        >
          <template #expanded="{ row }">
            <div class="p-4 bg-gray-50">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-semibold text-sm text-gray-500">Beschrijving:</h4>
                  <p class="mt-1">{{ row.original.description }}</p>
                </div>
                <div v-if="row.original.instructionalVideoUrl">
                  <h4 class="font-semibold text-sm text-gray-500">Instructie Video:</h4>
                  <a :href="row.original.instructionalVideoUrl" target="_blank" class="text-blue-500 hover:underline mt-1 flex items-center">
                    <span class="i-heroicons-video-camera mr-1"></span>
                    Bekijk instructievideo
                  </a>
                </div>
              </div>
              <div class="flex justify-end mt-4">
                <UButton
                  size="sm"
                  color="gray"
                  variant="soft"
                  class="mr-2"
                  @click="editExercise(row.original)"
                >
                  Bewerken
                </UButton>
                <UButton
                  size="sm"
                  color="red"
                  variant="soft"
                  @click="confirmDelete(row.original)"
                >
                  Verwijderen
                </UButton>
              </div>
            </div>
          </template>
        </UTable>
      </div>
    </UCard>

    <!-- Exercise Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">
            {{ form.id ? 'Bewerk oefening' : 'Nieuwe oefening' }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="isModalOpen = false"
          />
        </div>

        <UForm
          :state="form"
          @submit="saveExercise"
          class="space-y-2"
        >
          <UFormField label="Naam" required>
            <UInput
              v-model="form.name"
              placeholder="Voer de naam van de oefening in"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Beschrijving" required>
            <UTextarea
              v-model="form.description"
              placeholder="Beschrijf de oefening in detail"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Categorie" required>
            <USelect
              v-model="form.category"
              :items="categories"
              placeholder="Selecteer een categorie"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Moeilijkheidsgraad" required>
            <USelect
              v-model="form.difficulty"
              :items="difficultyLevels"
              placeholder="Selecteer moeilijkheidsgraad"
              required
              class="w-full"
            />
          </UFormField>
          
          <UFormField label="Instructie video URL">
            <UInput
              v-model="form.instructionalVideoUrl"
              placeholder="https://youtube.com/..."
              type="url"
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end gap-2 pt-4">
            <UButton
              variant="ghost"
              @click="isModalOpen = false"
            >
              Annuleren
            </UButton>
            <UButton
              type="submit"
              :loading="saving"
              color="primary"
            >
              {{ form.id ? 'Bijwerken' : 'Aanmaken' }}
            </UButton>
          </div>
        </UForm>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Oefening verwijderen</h3>

        <p class="text-gray-600 mb-6">
          Weet je zeker dat je de oefening "{{ exerciseToDelete?.name }}" wilt verwijderen?
          Deze actie kan niet ongedaan worden gemaakt.
        </p>

        <div class="flex justify-end gap-2">
          <UButton
            variant="ghost"
            @click="isDeleteModalOpen = false"
          >
            Annuleren
          </UButton>
          <UButton
            color="red"
            :loading="deleting"
            @click="deleteExercise"
          >
            Verwijderen
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h, ref, reactive, computed, onMounted, resolveComponent } from 'vue';

definePageMeta({
  layout: 'with-navbar',
  middleware: 'auth',
})

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const exercises = ref([]);
const searchQuery = ref('');
const categoryFilter = ref(null);
const difficultyFilter = ref(null);
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const exerciseToDelete = ref(null);
const expanded = ref({});

const columns = [
  {
    id: 'expand',
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: 'i-lucide-chevron-down',
        square: true,
        'aria-label': 'Expand',
        ui: {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-200 rotate-180' : ''
          ]
        },
        onClick: () => row.toggleExpanded()
      })
  },
  {
    accessorKey: 'name',
    header: 'Naam'
  },
  {
    accessorKey: 'category',
    header: 'Categorie',
    cell: ({ row }) => {
      const category = row.getValue('category');
      const label = getCategoryLabel(category);
      const colorClass = getCategoryColor(category);

      return h(UBadge, { class: `${colorClass} text-white`, variant: 'subtle' }, () => label);
    }
  },
  {
    accessorKey: 'difficulty',
    header: 'Moeilijkheidsgraad',
    cell: ({ row }) => {
      const difficulty = row.getValue('difficulty');
      const label = getDifficultyLabel(difficulty);
      const colorClass = getDifficultyColor(difficulty);
      
      return h(UBadge, { class: `${colorClass} text-white`, variant: 'subtle' }, () => label);
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      return h('div', { class: 'flex justify-end gap-2' }, [
        h(UButton, {
          size: 'xs',
          icon: 'i-heroicons-pencil-square',
          color: 'gray',
          variant: 'soft',
          onClick: () => editExercise(row.original)
        }),
        h(UButton, {
          size: 'xs',
          icon: 'i-heroicons-trash',
          color: 'red',
          variant: 'soft',
          onClick: () => confirmDelete(row.original)
        })
      ]);
    }
  }
];

const categories = [
  { label: 'Kracht', value: 'strength' },
  { label: 'Cardio', value: 'cardio' },
  { label: 'Flexibiliteit', value: 'flexibility' },
  { label: 'Balans', value: 'balance' },
];

const difficultyLevels = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Gemiddeld', value: 'intermediate' },
  { label: 'Gevorderd', value: 'advanced' },
];

const form = reactive({
  id: null,
  name: '',
  description: '',
  category: '',
  difficulty: '',
  instructionalVideoUrl: ''
});

const filteredExercises = computed(() => {
  if (!Array.isArray(exercises.value)) {
    return [];
  }

  return exercises.value.filter(exercise => {
    const matchesSearch = exercise.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         exercise.description?.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = categoryFilter.value === null || exercise.category === categoryFilter.value;
    const matchesDifficulty = difficultyFilter.value === null || exercise.difficulty === difficultyFilter.value;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
});

const getCategoryLabel = (category) => {
  return categories.find(c => c.value === category)?.label || category;
};

const getDifficultyLabel = (difficulty) => {
  return difficultyLevels.find(d => d.value === difficulty)?.label || difficulty;
};

const getCategoryColor = (category) => {
  const colors = {
    strength: 'bg-blue-500',
    cardio: 'bg-red-500',
    flexibility: 'bg-green-500',
    balance: 'bg-purple-500'
  };
  return colors[category] || 'bg-gray-500';
};

const getDifficultyColor = (difficulty) => {
  const colors = {
    beginner: 'bg-primary',
    intermediate: 'bg-yellow-500',
    advanced: 'bg-red-500'
  };
  return colors[difficulty] || 'bg-gray-500';
};

const fetchExercises = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/exercises');
    const data = await response.json();
    
    if (Array.isArray(data)) {
      exercises.value = data.map(exercise => ({
        id: exercise.id,
        name: exercise.name || '',
        description: exercise.description || '',
        category: exercise.category || '',
        difficulty: exercise.difficulty || '',
        instructionalVideoUrl: exercise.instructionalVideoUrl || ''
      }));
    } else {
      console.error('Invalid data format received:', data);
      exercises.value = [];
    }
  } catch (error) {
    console.error('Error fetching exercises:', error);
    useToast().add({
      title: 'Fout',
      description: 'Er is een fout opgetreden bij het ophalen van de oefeningen.',
      color: 'red'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchExercises);

function openNewExercise() {
  Object.assign(form, {
    id: null,
    name: '',
    description: '',
    category: '',
    difficulty: '',
    instructionalVideoUrl: ''
  });
  isModalOpen.value = true;
}

function editExercise(exercise) {
  Object.assign(form, exercise);
  isModalOpen.value = true;
}

function confirmDelete(exercise) {
  exerciseToDelete.value = exercise;
  isDeleteModalOpen.value = true;
}

async function saveExercise() {
  saving.value = true;
  try {
    if (form.id) {
      await $fetch(`/api/exercises/${form.id}`, {
        method: 'PATCH',
        body: form
      });
      const index = exercises.value.findIndex(e => e.id === form.id);
      if (index !== -1) {
        exercises.value[index] = { ...form };
      }
      useToast().add({
        title: 'Succes',
        description: 'Oefening is bijgewerkt.',
        color: 'green'
      });
    } else {
      const { data } = await $fetch('/api/exercises', {
        method: 'POST',
        body: form
      });
      exercises.value.push(data);
      useToast().add({
        title: 'Succes',
        description: 'Nieuwe oefening is aangemaakt.',
        color: 'green'
      });
    }
    isModalOpen.value = false;
  } catch (error) {
    console.error('Error saving exercise:', error);
    useToast().add({
      title: 'Fout',
      description: 'Er is een fout opgetreden bij het opslaan van de oefening.',
      color: 'red'
    });
  } finally {
    saving.value = false;
  }
}

async function deleteExercise() {
  if (!exerciseToDelete.value) return;
  
  deleting.value = true;
  try {
    await $fetch(`/api/exercises/${exerciseToDelete.value.id}`, {
      method: 'DELETE'
    });
    exercises.value = exercises.value.filter(e => e.id !== exerciseToDelete.value.id);
    useToast().add({
      title: 'Succes',
      description: 'Oefening is verwijderd.',
      color: 'green'
    });
    isDeleteModalOpen.value = false;
  } catch (error) {
    console.error('Error deleting exercise:', error);
    useToast().add({
      title: 'Fout',
      description: 'Er is een fout opgetreden bij het verwijderen van de oefening.',
      color: 'red'
    });
  } finally {
    deleting.value = false;
  }
}
</script>