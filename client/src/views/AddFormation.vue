<template>
    <div>
      <h1>Ajouter une formation</h1>
      <form @submit.prevent="addFormation">
        <input v-model="title" type="text" placeholder="Titre" required />
        <textarea v-model="description" placeholder="Description" required></textarea>
        <input v-model="file_path" type="text" placeholder="Chemin du fichier" required />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'AddFormation',
    data() {
      return {
        title: '',
        description: '',
        file_path: '',
      };
    },
    methods: {
      async addFormation() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            alert('Vous devez être connecté pour ajouter une formation.');
            return;
          }
  
          // Envoi des données de la formation au backend
          await axios.post(
            'http://localhost:3000/api/formations',
            {
              title: this.title,
              description: this.description,
              file_path: this.file_path, // Chemin du fichier PDF
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Ajouter le token JWT dans l'en-tête
              },
            }
          );
  
          alert('Formation ajoutée avec succès.');
          this.title = '';
          this.description = '';
          this.file_path = ''; // Réinitialisation des champs du formulaire
        } catch (error) {
          console.error('Erreur lors de l\'ajout de la formation:', error);
          alert('Une erreur s\'est produite.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
  }
  input, textarea {
    margin: 10px 0;
  }
  button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #45a049;
  }
  </style>
  