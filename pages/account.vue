<template>
  <div class="p-4">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">Instellingen</h2>
        </div>
      </template>

      <UForm @submit="saveProfile">
        <div class="space-y-6">
          <!-- Profile Picture Section -->
          <div class="flex flex-col items-center space-y-4">
            <div class="relative">
              <img 
                :src="form.profilePicture || '/default-avatar.png'" 
                alt="Profile Picture" 
                class="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
              />
              <div class="absolute bottom-0 right-0">
                <UButton
                  icon="i-heroicons-camera"
                  color="gray"
                  variant="solid"
                  size="xs"
                  @click="triggerFileInput"
                />
                <input
                  type="file"
                  ref="fileInput"
                  class="hidden"
                  accept="image/*"
                  @change="handleFileUpload"
                />
              </div>
            </div>
          </div>

          <!-- Bio Section -->
          <!-- <UFormGroup label="Bio">
            <UTextarea
              v-model="form.bio"
              placeholder="Vertel iets over jezelf..."
              rows="4"
            />
          </UFormGroup> -->

          <!-- <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="resetForm">Annuleren</UButton>
            <UButton type="submit" color="primary">Opslaan</UButton>
          </div> -->
        </div>
      </UForm>
    </UCard>

    <!-- Password Change Card -->
    <UCard class="mt-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">Wachtwoord Wijzigen</h2>
        </div>
      </template>

      <form @submit.prevent="changePassword">
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-700 mb-2">Huidig wachtwoord</h4>
          <UFormGroup label="Huidig Wachtwoord">
            <UInput
              v-model="passwordForm.currentPassword"
              type="password"              
              required
            />
          </UFormGroup>
          <h4 class="text-lg font-semibold text-gray-700 mb-2">Nieuw wachtwoord</h4>
          <UFormGroup label="Nieuw Wachtwoord">
            <UInput
              v-model="passwordForm.newPassword"
              type="password"
              required
              minlength="6"
            />
          </UFormGroup>
          <h4 class="text-lg font-semibold text-gray-700 mb-2">Bevestig nieuw wachtwoord</h4>
          <UFormGroup label="Bevestig Nieuw Wachtwoord">
            <UInput
              v-model="passwordForm.confirmPassword"
              type="password"
              required
              minlength="6"
            />
          </UFormGroup>

          <div class="flex justify-end gap-2">
            <!-- <UButton variant="ghost" @click="resetPasswordForm">Annuleren</UButton> -->
            <UButton type="submit" color="primary" :loading="isChangingPassword">Wachtwoord Wijzigen</UButton>
          </div>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

definePageMeta({
  layout: 'with-navbar',
  middleware: 'auth',
});

const fileInput = ref(null);
const form = reactive({
  profilePicture: '',
  bio: '',
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const isChangingPassword = ref(false);

// Fetch user profile data
const fetchProfile = async () => {
  try {
    const response = await $fetch('/api/user/profile');
    form.profilePicture = response.profilePicture;
    form.bio = response.bio;
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

// Handle file upload
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Create FormData
  const formData = new FormData();
  formData.append('image', file);

  try {
    // Upload image
    const response = await $fetch('/api/user/upload-profile-picture', {
      method: 'POST',
      body: formData,
    });
    
    // Update form with new image URL
    form.profilePicture = response.url;
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

// Trigger file input click
const triggerFileInput = () => {
  fileInput.value.click();
};

// Save profile changes
const saveProfile = async () => {
  try {
    await $fetch('/api/user/profile', {
      method: 'PATCH',
      body: {
        bio: form.bio,
        profilePicture: form.profilePicture,
      },
    });
    
    // Show success message
    useToast().add({
      title: 'Succes',
      description: 'Je profiel is bijgewerkt',
      color: 'green',
    });
  } catch (error) {
    console.error('Error saving profile:', error);
    useToast().add({
      title: 'Fout',
      description: 'Er is een fout opgetreden bij het opslaan van je profiel',
      color: 'red',
    });
  }
};

// Change password
const changePassword = async () => {
  try {
    isChangingPassword.value = true;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      useToast().add({
        title: 'Fout',
        description: 'De nieuwe wachtwoorden komen niet overeen',
        color: 'red',
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      useToast().add({
        title: 'Fout',
        description: 'Het nieuwe wachtwoord moet minimaal 6 tekens lang zijn',
        color: 'red',
      });
      return;
    }

    await $fetch('/api/user/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
    });

    // Show success message
    useToast().add({
      title: 'Succes',
      description: 'Je wachtwoord is gewijzigd',
      color: 'green',
    });

    // Reset password form
    resetPasswordForm();
  } catch (error) {
    console.error('Error changing password:', error);
    useToast().add({
      title: 'Fout',
      description: error.data?.message || 'Er is een fout opgetreden bij het wijzigen van je wachtwoord',
      color: 'red',
    });
  } finally {
    isChangingPassword.value = false;
  }
};

// Reset form to original values
const resetForm = () => {
  fetchProfile();
};

// Reset password form
const resetPasswordForm = () => {
  passwordForm.currentPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
};

// Fetch profile data when component mounts
onMounted(fetchProfile);
</script> 