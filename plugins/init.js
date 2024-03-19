export default defineNuxtPlugin((nuxtApp) => {
    let host = "";

    if (import.meta.env.SSR) {
        host = nuxtApp?.ssrContext?.event?.req?.headers?.host || "";
    } else {
        host = window.location.host;
    }

    const origin = new URL(`https://${host}`);
    nuxtApp.provide("app_origin", origin.origin);
    nuxtApp.provide("app_hostname", origin.hostname);
});
