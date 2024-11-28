<template>
  <div>
    <h1>Trainings Available</h1>
    <ul>
      <!-- Affichage des formations disponibles -->
      <li v-for="formation in formations" :key="formation.id">
        <router-link :to="`/formations/${formation.id}`">{{ formation.title }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TrainingFormations',
  data() {
    return {
      formations: [],  // Tableau pour stocker les formations
    };
  },
  async created() {
    try {
      // Récupérer les formations depuis l'API
      const response = await axios.get('http://localhost:3000/api/formations', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Ajouter le token JWT
        }
      });

      // Assigner les formations récupérées à la variable formations
      this.formations = response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des formations : ", error);
      alert("Une erreur s'est produite.");
    }
  },
};
</script>
