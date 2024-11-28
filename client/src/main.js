import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import PdfjsViewer from 'vue3-pdfjs'; // Importer le composant PdfjsViewer

const app = createApp(App);

// Enregistrer PdfjsViewer globalement
app.component('PdfjsViewer', PdfjsViewer);

// Utiliser le routeur
app.use(router);

// Monter l'application Vue
app.mount('#app');
