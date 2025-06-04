export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn } = useUserSession()

    // If not logged in, redirect to login page
    if (!loggedIn.value) {
        return navigateTo('/login')
    }
})
