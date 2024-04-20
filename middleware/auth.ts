export default defineNuxtRouteMiddleware((to, from) => {
    console.log("[AUTH MIDDLEWARE]: ", to, from);
});
