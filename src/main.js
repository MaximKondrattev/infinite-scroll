// @ts-nocheck
/**
 * Main application entry point
 * @module main
 */

import { createApp } from "vue";
import App from "./App.vue";

/**
 * Create and mount Vue application instance
 * @type {import('vue').App}
 */
const app = createApp(App);
app.mount("#app");
