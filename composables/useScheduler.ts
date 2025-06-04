import { ref, computed } from 'vue';
// Assume this composable exists and returns { user }
// If not, replace with your actual user session composable
import { useUserSession } from '#imports';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO8601 string
  end: string;   // ISO8601 string
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    status?: 'booked' | 'available' | 'completed';
    clientId?: string;
    coachId?: string;
    feedback?: string;
    isPreferredSlot?: boolean;
    notes?: string;
    rating?: number;
  };
}

// Define preferred times
// Tuesday, Wednesday, Friday evenings (5 PM - 9 PM)
// Saturday morning (8 AM - 12 PM)
const eveningStartHour = 17; // 5 PM
const eveningEndHour = 21;   // 9 PM
const morningStartHour = 8;  // 8 AM
const morningEndHour = 12;   // 12 PM

const preferredSlotsConfig = [
  { dayOfWeek: 2, startHour: eveningStartHour, endHour: eveningEndHour }, // Tuesday
  { dayOfWeek: 3, startHour: eveningStartHour, endHour: eveningEndHour }, // Wednesday
  { dayOfWeek: 5, startHour: eveningStartHour, endHour: eveningEndHour }, // Friday
  { dayOfWeek: 0, startHour: morningStartHour, endHour: morningEndHour }, // Saturday (Note: FullCalendar dayOfWeek: 0 is Sunday, 6 is Saturday. We'll adjust for this or use date manipulation)
  // Let's adjust to FullCalendar's convention: Sunday=0, Monday=1, ..., Saturday=6
];
// Corrected for FullCalendar: Tuesday=2, Wednesday=3, Friday=5, Saturday=6
const correctedPreferredSlotsConfig = [
  { dayOfWeek: 2, startHour: eveningStartHour, endHour: eveningEndHour, slotType: 'evening' }, // Tuesday
  { dayOfWeek: 3, startHour: eveningStartHour, endHour: eveningEndHour, slotType: 'evening' }, // Wednesday
  { dayOfWeek: 5, startHour: eveningStartHour, endHour: eveningEndHour, slotType: 'evening' }, // Friday
  { dayOfWeek: 6, startHour: morningStartHour, endHour: morningEndHour, slotType: 'morning' }, // Saturday
];


export function useScheduler() {
  const { user } = useUserSession();
  const events = ref<CalendarEvent[]>([]);
  const isLoading = ref(false);

  // Fetch coaching calls from API, allow external filter override
  const fetchEvents = async (externalFilter?: any) => {
    isLoading.value = true;
    let filter = {};
    if (externalFilter && (externalFilter.clientId || externalFilter.coachId)) {
      filter = externalFilter;
    } else if (user.value && (user.value as any).role === 'client') {
      filter = { clientId: (user.value as any).id };
    } else if (user.value && (user.value as any).role === 'coach') {
      filter = { coachId: (user.value as any).id };
    }
    const calls = await $fetch('/api/coaching-calls', { params: filter });
    // Map API data to CalendarEvent
    const bookedEvents = calls.map((call: any) => {
      const start = new Date(call.scheduledAt);
      const end = new Date(start.getTime() + (call.duration || 60) * 60000);
      let status: 'booked' | 'completed' = 'booked';
      if (call.status === 'COMPLETED') status = 'completed';
      return {
        id: call.id,
        title: call.client ? `Sessie met ${call.client.name}` : 'Niet meer beschikbaar',
        start: start.toISOString(),
        end: end.toISOString(),
        backgroundColor: call.client ? 'blue' : 'red',
        borderColor: 'darkblue',
        extendedProps: {
          status,
          clientId: call.clientId,
          coachId: call.coachId,
          notes: call.notes,
        }
      };
    });
    // Generate available slots for the current month
    const today = new Date();
    const viewStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const viewEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const availableSlots = generateAvailableSlots(viewStartDate, viewEndDate, bookedEvents);
    events.value = [...bookedEvents, ...availableSlots];
    isLoading.value = false;
  };

  // Generate available slots, excluding already booked
  function generateAvailableSlots(startDate: Date, endDate: Date, bookedEvents: CalendarEvent[]): CalendarEvent[] {
    const slots: CalendarEvent[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      correctedPreferredSlotsConfig.forEach(config => {
        if (config.dayOfWeek === dayOfWeek) {
          for (let hour = config.startHour; hour < config.endHour; hour++) {
            const slotStart = new Date(currentDate);
            slotStart.setHours(hour, 0, 0, 0);
            const slotEnd = new Date(currentDate);
            slotEnd.setHours(hour + 1, 0, 0, 0);
            // Check if this slot is already booked
            const isBooked = bookedEvents.some(event => {
              return new Date(event.start).getTime() === slotStart.getTime();
            });
            if (!isBooked) {
              slots.push({
                id: `available-${currentDate.toISOString().slice(0,10)}-${hour}`,
                title: 'Beschikbaar tijdslot',
                start: slotStart.toISOString(),
                end: slotEnd.toISOString(),
                backgroundColor: 'green',
                borderColor: 'darkgreen',
                extendedProps: {
                  status: 'available',
                  isPreferredSlot: true,
                }
              });
            }
          }
        }
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return slots;
  }

  const addEvent = async (event: CalendarEvent) => {
    if (event.extendedProps?.status === 'available') {
      // For first assign only to coach 2
      const coachId = 2; 
      if (!user.value) return;
      const res = await $fetch('/api/coaching-calls', {
        method: 'POST',
        body: {
          clientId: user.value.userId,
          coachId,
          scheduledAt: event.start,
          duration: 60,
          notes: event.extendedProps?.notes || null
        }
      });
      await fetchEvents();
      return res;
    }
  };

  // Update a coaching call (e.g., mark as completed, add notes)
  const updateEvent = async (eventId: string, update: any) => {
    await $fetch(`/api/coaching-calls/${eventId}`, {
      method: 'PATCH',
      body: update
    });
    await fetchEvents();
  };

  // Submit feedback for a session
  const submitFeedback = async ({ targetId, content, rating, type = 'COACH' }: { targetId: string, content: string, rating: number, type?: string }) => {
    if (!user.value) return;
    // Only allow clients to submit feedback for their own sessions
    if ((user.value as any).role === 'client') {
      // Fetch the coaching call to check clientId
      const call = await $fetch(`/api/coaching-calls`, { params: { id: targetId } });
      // call could be an array or object depending on backend, handle both
      const coachingCall = Array.isArray(call) ? call[0] : call;
      console.log('coachingCall', coachingCall)
      if (!coachingCall || coachingCall.clientId !== user.value.userId) {
        throw new Error('Je kunt alleen feedback geven op je eigen sessies.');
      }
    }
    await $fetch('/api/feedback', {
      method: 'POST',
      body: {
        type,
        content,
        rating,
        userId: user.value.userId,
        targetId
      }
    });
  };

  // Fetch feedback for a session
  const fetchFeedback = async (targetId: string) => {
    return await $fetch('/api/feedback', { params: { targetId } });
  };

  return {
    events,
    isLoading,
    fetchEvents,
    addEvent,
    updateEvent,
    submitFeedback,
    fetchFeedback,
    user,
  };
} 