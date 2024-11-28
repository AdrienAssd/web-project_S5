<template>
  <div>
    <h1>Dashboard</h1>
    <button @click="logout">Se déconnecter</button>
    <router-link to="/formations">Voir les formations</router-link>
    <br />
    <!-- Ajouter un lien vers la page AddFormation -->
    <router-link to="/add-formation">Ajouter une nouvelle formation</router-link>
  </div>
</template>

<script>
export default {
  name: 'UserDashboard', 
  methods: {
    logout() {
      localStorage.removeItem('token');
      alert('Déconnexion réussie');
      this.$router.push('/');  // Rediriger vers la page de login
    },
  },
};
</script>
