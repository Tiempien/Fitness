import { jwtDecode } from "jwt-decode";
export default defineOAuthMicrosoftEventHandler({
    config: {
        emailRequired: true,
        scope: ['User.Read','GroupMember.Read.All'],
        clientSecret: null
    },
    async onSuccess(event, { user, tokens }) {
        const decodedHeader = jwtDecode(tokens.access_token);

        const groups = decodedHeader.wids;

        console.log(`User groups: ${groups.join(', ')}`);

        await setUserSession(event, {
            user: {
                microsoftId: user.id,
                displayName: user.surname
            }
        })
        return sendRedirect(event, '/')
    },
    // Optional, will return a json error and 401 status code by default
    onError(event, error) {
        console.error('GitHub OAuth error:', error)
        return sendRedirect(event, '/')
    },
})