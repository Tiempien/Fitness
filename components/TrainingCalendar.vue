<template>
  <div>
    <FullCalendar v-if="!isLoading" :options="calendarOptions" />
    <div v-else>
      <p>Loading calendar...</p>
    </div>

    <!-- Legend -->
    <div class="flex gap-4 mt-2 items-center text-sm">
      <span class="flex items-center"><span style="display:inline-block;width:16px;height:16px;background:green;border:2px solid darkgreen;margin-right:4px;"></span>Available Slot</span>
      <span class="flex items-center"><span style="display:inline-block;width:16px;height:16px;background:blue;border:2px solid darkblue;margin-right:4px;"></span>Booked/Completed</span>
    </div>

    <!-- Booking Modal -->
    <div v-if="isBookingModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Book Coaching Call</h3>
          <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="isBookingModalOpen = false" />
        </div>
        <div>
          <p>
            Book this slot: <b>{{ selectedSlot?.title }}</b><br>
            On: <b>{{ formatDate(selectedSlot?.start) }}</b>
          </p>
          <div class="mt-2 flex gap-2">
            <UButton @click="confirmBooking" color="primary">Confirm Booking</UButton>
            <UButton @click="isBookingModalOpen = false" color="secondary">Cancel</UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback Modal -->
    <div v-if="isFeedbackModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Session Feedback</h3>
          <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="isFeedbackModalOpen = false" />
        </div>
        <div>
          <p>
            Session: <b>{{ selectedEventForFeedback?.title }}</b><br>
            On: <b>{{ formatDate(selectedEventForFeedback?.start) }}</b>
          </p>
          <!-- Star Rating Radio Group -->
          <div class="flex items-center mt-2 mb-2">
            <span v-for="star in 5" :key="star" class="cursor-pointer text-2xl" @click="feedbackRating = star">
              <input
                type="radio"
                :id="'star-' + star"
                :value="star"
                v-model="feedbackRating"
                class="hidden"
              />
              <label :for="'star-' + star" :class="star <= feedbackRating ? 'text-yellow-400' : 'text-gray-300'">
                ★
              </label>
            </span>
            <span class="ml-2 text-sm">{{ feedbackRating }} / 5</span>
          </div>
          <textarea v-model="feedbackText" rows="4" class="w-full border p-2 mt-2" placeholder="Your feedback..."></textarea>
          <div class="mt-2 flex gap-2">
            <UButton @click="submitFeedbackHandler" color="primary">Submit</UButton>
            <UButton @click="isFeedbackModalOpen = false" color="secondary">Cancel</UButton>
          </div>
          <div v-if="feedbackMessage" class="mt-2 text-green-600">{{ feedbackMessage }}</div>
          <div v-if="feedbackError" class="mt-2 text-red-600">{{ feedbackError }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useScheduler, type CalendarEvent } from '@/composables/useScheduler'
import type { EventClickArg, CalendarOptions } from '@fullcalendar/core'

const { events, isLoading, fetchEvents, addEvent, submitFeedback, fetchFeedback, user } = useScheduler()

const isBookingModalOpen = ref(false)
const isFeedbackModalOpen = ref(false)
const selectedSlot = ref<CalendarEvent | null>(null)
const selectedEventForFeedback = ref<CalendarEvent | null>(null)
const feedbackText = ref('')
const feedbackRating = ref(5)
const feedbackMessage = ref('')
const feedbackError = ref('')

const calendarEvents = computed(() => Array.isArray(events.value) ? events.value : [])

const calendarOptions = reactive<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek'
  },
  events: (fetchInfo, successCallback, failureCallback) => {
    successCallback(calendarEvents.value)
  },
  selectable: false,
  editable: false,
  eventClick: handleEventClick,
  slotDuration: '01:00:00',
  allDaySlot: false,
  hiddenDays: [0, 1, 4],
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  },
  slotLabelFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  },
  slotMinTime: '07:00:00',
  slotMaxTime: '22:00:00',
})

function handleEventClick(clickInfo: EventClickArg) {
  const event = clickInfo.event
  const extendedProps = event.extendedProps as CalendarEvent['extendedProps']

  // Only allow booking and feedback for clients
  if (user.value && (user.value as any).role !== 'client') {
    if (extendedProps?.status === 'available') {
      alert('Only clients can book coaching calls.');
      return;
    } else if (extendedProps?.status === 'booked' || extendedProps?.status === 'completed') {
      alert('Only clients can submit feedback.');
      return;
    }
  }

  if (extendedProps?.status === 'available') {
    selectedSlot.value = {
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor,
      extendedProps
    }
    isBookingModalOpen.value = true
  } else if (extendedProps?.status === 'booked' || extendedProps?.status === 'completed') {
    const now = new Date()
    const eventEnd = event.end ? new Date(event.end) : null
    // Prevent feedback modal if session does not belong to this client
    if ((user.value as any)?.role === 'client') {
      const clientId = extendedProps?.clientId;
      // Try both user.value.id and user.value.userId for compatibility
      const userId = (user.value as any)?.id || (user.value as any)?.userId;
      if (clientId && userId && clientId !== userId) {
        return;
      }
    }
    if (eventEnd && eventEnd < now) {
      // Allow feedback for completed sessions
      selectedEventForFeedback.value = events.value.find((e: CalendarEvent) => e.id === event.id) || null
      // Fetch feedback for this session and prefill if exists, and update event's feedback in UI
      prefillFeedbackAndUpdateEvent(selectedEventForFeedback.value?.id, event)
      isFeedbackModalOpen.value = true
    }
  }
}

async function prefillFeedbackAndUpdateEvent(targetId?: string, eventObj?: any) {
  feedbackMessage.value = ''
  feedbackError.value = ''
  if (!targetId) return
  const feedbacks = await fetchFeedback(targetId);
  console.log('feedbacks', feedbacks)
  // Find feedback for this user
  const myFeedback = Array.isArray(feedbacks)
    ? feedbacks.find((f: any) => f.userId === user.value.userId)
    : null;
  console.log('myFeedback', myFeedback);
  if (myFeedback) {
    feedbackText.value = (myFeedback as any).content || ''
    feedbackRating.value = (myFeedback as any).rating || 5
    // Update the event's feedback in the UI
    if (eventObj && eventObj.setExtendedProp) {
      eventObj.setExtendedProp('feedback', (myFeedback as any).content)
      eventObj.setExtendedProp('rating', (myFeedback as any).rating)
    }
  } else {
    feedbackText.value = ''
    feedbackRating.value = 5
    if (eventObj && eventObj.setExtendedProp) {
      eventObj.setExtendedProp('feedback', '')
      eventObj.setExtendedProp('rating', 5)
    }
  }
}

async function confirmBooking() {
  if (!selectedSlot.value) return
  await addEvent(selectedSlot.value)
  isBookingModalOpen.value = false
  selectedSlot.value = null
  await fetchEvents()
}

async function submitFeedbackHandler() {
  if (selectedEventForFeedback.value && selectedEventForFeedback.value.id) {
    feedbackMessage.value = ''
    feedbackError.value = ''
    try {
      await submitFeedback({
        targetId: selectedEventForFeedback.value.id,
        content: feedbackText.value,
        rating: feedbackRating.value,
        type: 'COACH',
      })
      feedbackMessage.value = 'Feedback saved successfully.'
      // Update the event's feedback in the UI
      const eventObj = calendarEvents.value.find(e => e.id === selectedEventForFeedback.value?.id)
      if (eventObj && eventObj.extendedProps) {
        eventObj.extendedProps.feedback = feedbackText.value
        eventObj.extendedProps.rating = feedbackRating.value
      }
      isFeedbackModalOpen.value = false
      selectedEventForFeedback.value = null
      feedbackText.value = ''
      feedbackRating.value = 5
      await fetchEvents()
    } catch (e) {
      console.log('error', e)
      feedbackError.value = 'Failed to save feedback. Please try again.'
    }
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString()
}

onMounted(async () => {
  await fetchEvents()
})
</script>