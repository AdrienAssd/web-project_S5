<template>
  <div>
    <h1>Connection</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Log in</button>
    </form>
    <router-link to="/register">Pas encore inscrit ? Crée un compte</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password,
        });

        // Vérifier si le token est bien reçu
        if (response.data.token) {
          console.log("Token reçu : ", response.data.token);  // Ajout du log pour vérifier le token

          // Stocker le token dans le stockage local (localStorage)
          localStorage.setItem('token', response.data.token);
          alert('Connection réussie');
          this.$router.push('/dashboard');
        } else {
          alert('Erreur de connexion : Pas de token reçu');
        }
      } catch (error) {
        alert('Erreur de connexion : ' + error.response.data.message);
      }
    },
  },
};
</script>
