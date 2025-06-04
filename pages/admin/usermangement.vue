<template>
  <div class="p-4 max-w-7xl mx-auto">
    <UCard class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Gebruikersbeheer</h2>
            <p class="text-sm text-gray-500 mt-1">Beheer alle gebruikers van het platform.</p>
          </div>
          <UButton
            icon="i-heroicons-plus"
            color="primary"
            @click="openNewUser"
          >
            Nieuwe Gebruiker
          </UButton>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Filters -->
        <div class="flex gap-4 flex-wrap">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Zoek gebruikers..."
            class="max-w-xs"
          />
          <USelect
            v-model="roleFilter"
            :items="[{ label: 'Alle rollen', value: null }, ...roles]"
            class="w-48"
          />
          <USelect
            v-model="statusFilter"
            :items="[{ label: 'Alle statussen', value: null }, ...statuses]"
            class="w-48"
          />
        </div>

        <!-- Table -->
        <UTable
          v-model:expanded="expanded"
          :data="filteredUsers"
          :columns="columns"
          :loading="loading"
          :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
          class="flex-1"
        >
          <template #expanded="{ row }">
            <div class="p-4 bg-gray-50">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-semibold text-sm text-gray-500">E-mail:</h4>
                  <p class="mt-1">{{ row.original.email }}</p>
                </div>
                <div>
                  <h4 class="font-semibold text-sm text-gray-500">Status:</h4>
                  <p class="mt-1">{{ row.original.status }}</p>
                </div>
              </div>
              <div class="flex justify-end mt-4">
                <UButton
                  size="sm"
                  color="gray"
                  variant="soft"
                  class="mr-2"
                  @click="editUser(row.original)"
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

    <!-- User Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">
            {{ form.id ? 'Bewerk gebruiker' : 'Nieuwe gebruiker' }}
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
          @submit="saveUser"
          class="space-y-2"
        >
          <UFormField label="Naam" required>
            <UInput
              v-model="form.name"
              placeholder="Voer de naam van de gebruiker in"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="E-mail" required>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="Voer het e-mailadres in"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Rol" required>
            <USelect
              v-model="form.role"
              :items="roles"
              placeholder="Selecteer een rol"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Status" required>
            <USelect
              v-model="form.status"
              :items="statuses"
              placeholder="Selecteer een status"
              required
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
        <h3 class="text-lg font-semibold mb-4">Gebruiker verwijderen</h3>

        <p class="text-gray-600 mb-6">
          Weet je zeker dat je de gebruiker "{{ userToDelete?.name }}" wilt verwijderen?
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
            @click="deleteUser"
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
const users = ref([]);
const searchQuery = ref('');
const roleFilter = ref(null);
const statusFilter = ref(null);
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const userToDelete = ref(null);
const expanded = ref({});

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Coach', value: 'coach' },
  { label: 'Gebruiker', value: 'client' },
];

const statuses = [
  { label: 'Actief', value: 'Actief' },
  { label: 'Inactief', value: 'Inactief' },
];

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
    accessorKey: 'role',
    header: 'Rol',
    cell: ({ row }) => {
      const role = row.getValue('role');
      const label = getRoleLabel(role);
      const colorClass = getRoleColor(role);

      return h(UBadge, { class: `${colorClass} text-white`, variant: 'subtle' }, () => label);
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      const colorClass = status === 'Actief' ? 'bg-green-500' : 'bg-gray-500';
      
      return h(UBadge, { class: `${colorClass} text-white`, variant: 'subtle' }, () => status);
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
          onClick: () => editUser(row.original)
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

const form = reactive({
  id: null,
  name: '',
  email: '',
  role: '',
  status: 'Actief'
});

const filteredUsers = computed(() => {
  if (!Array.isArray(users.value)) {
    return [];
  }

  return users.value.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesRole = roleFilter.value === null || user.role === roleFilter.value;
    const matchesStatus = statusFilter.value === null || user.status === statusFilter.value;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
});

const getRoleLabel = (role) => {
  return roles.find(r => r.value === role)?.label || role;
};

const getRoleColor = (role) => {
  const colors = {
    admin: 'bg-red-500',
    coach: 'bg-orange-500',
    user: 'bg-green-500'
  };
  return colors[role] || 'bg-gray-500';
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    
    if (Array.isArray(data)) {
      users.value = data.map(user => ({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        status: user.status || 'Actief'
      }));
    } else {
      console.error('Invalid data format received:', data);
      users.value = [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    useToast().add({
      title: 'Fout',
      description: 'Er is een fout opgetreden bij het ophalen van de gebruikers.',
      color: 'red'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);

function openNewUser() {
  Object.assign(form, {
    id: null,
    name: '',
    email: '',
    role: '',
    status: 'Actief'
  });
  isModalOpen.value = true;
}

function editUser(user) {
  Object.assign(form, user);
  isModalOpen.value = true;
}

function confirmDelete(user) {
  userToDelete.value = user;
  isDeleteModalOpen.value = true;
}

async function saveUser() {
  saving.value = true;
  try {
    if (form.id) {
      await $fetch(`/api/users/${form.id}`, {
        method: 'PATCH',
        body: form
      });
      const index = users.value.findIndex(u => u.id === form.id);
      if (index !== -1) {
        users.value[index] = { ...form };
      }
      useToast().add({
        title: 'Succes',
        description: 'Gebruiker is bijgewerkt.',
        color: 'green'
      });
    } else {
      const { data } = await $fetch('/api/users', {
        method: 'POST',
        body: form
      });
      users.value.push(data);
      useToast().add({
        title: 'Succes',
        description: 'Nieuwe gebruiker is aangemaakt.',
        color: 'green'
      });
    }
    isModalOpen.value = false;
  } catch (error) {
    console.error('Error saving user:', error);
    useToast().add({
      title: 'Fout',
      description: 'Er is een fout opgetreden bij het opslaan van de gebruiker.',
      color: 'red'
    });
  } finally {
    saving.value = false;
  }
}

async function deleteUser() {
  if (!userToDelete.value) return;
  
  deleting.value = true;
  try {
    await $fetch(`/api/users/${userToDelete.value.id}`, {
      method: 'DELETE'
    });
    users.value = users.value.filter(u => u.id !== userToDelete.value.id);
    useToast().add({
      title: 'Succes',
      description: 'Gebruiker is verwijderd.',
      color: 'green'
    });
    isDeleteModalOpen.value = false;
  } catch (error) {
    console.error('Error deleting user:', error);
    useToast().add({
      title: 'Fout',
      description: 'Er is een fout opgetreden bij het verwijderen van de gebruiker.',
      color: 'red'
    });
  } finally {
    deleting.value = false;
  }
}
</script>
