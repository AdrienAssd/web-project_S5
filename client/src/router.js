import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from './views/UserLogin.vue';
import UserRegister from './views/UserRegister.vue';
import UserDashboard from './views/UserDashboard.vue';
import TrainingFormations from './views/TrainingFormations.vue';
import TrainingQuiz from './views/TrainingQuiz.vue';
import TrainingDetails from './views/TrainingDetails.vue';
import AddFormation from './views/AddFormation.vue';  // Importer le composant AddFormation

const routes = [
  { path: '/', component: UserLogin },
  { path: '/register', component: UserRegister },
  { path: '/dashboard', component: UserDashboard },
  { path: '/formations', component: TrainingFormations },
  { path: '/formations/:id', component: TrainingDetails },
  { path: '/quiz/:formationId', component: TrainingQuiz },
  { path: '/add-formation', component: AddFormation },  // Ajouter la route pour AddFormation
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
