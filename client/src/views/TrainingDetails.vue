<template>
    <div>
      <h1>{{ formation.title }}</h1>
      <p>{{ formation.description }}</p>
      
      <!-- Affichage du PDF -->
      <PdfjsViewer
        :src="formation.file_path"
        style="width: 100%; height: 800px"
      />
    </div>
  </template>
  
  <script>
  // Importation de axios pour effectuer les requêtes API
  import axios from 'axios';
  import PdfjsViewer from "vue3-pdfjs"; // Importation de PdfjsViewer
  
  export default {
    name: "TrainingDetails",
    components: {
      PdfjsViewer, // Enregistrement du composant PdfjsViewer
    },
    data() {
      return {
        formation: {},  // Stocke les données de la formation
      };
    },
    async created() {
      try {
        const formationId = this.$route.params.id; // Récupère l'ID de la formation depuis l'URL
        const token = localStorage.getItem('token'); // Récupère le token JWT depuis le localStorage
  
        if (!token) {
          alert('Vous devez être connecté.');
          return;
        }
  
        // Envoi de la requête GET pour récupérer la formation par ID
        const response = await axios.get(`http://localhost:3000/api/formations/${formationId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Inclure le token JWT dans les en-têtes
          },
        });
  
        this.formation = response.data; // Stocke les données de la formation
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de la formation:", error);
        alert("Une erreur s'est produite lors de la récupération des détails de la formation.");
      }
    },
  };
  </script>
  
  <style scoped>
  .quiz-link {
    color: blue;
    font-size: 1em;
  }
  </style>
  