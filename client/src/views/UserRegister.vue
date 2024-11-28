<template>
  <div>
    <h1>Sign Up</h1>
    <form @submit.prevent="register">
      <input v-model="name" type="text" placeholder="Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserRegister', // Component name
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async register() {
      // Basic validation (you can enhance it more)
      if (!this.name || !this.email || !this.password) {
        alert('All fields are required!');
        return;
      }

      try {
        // Send POST request to register the user
        const response = await axios.post('http://localhost:3000/api/register', {
          name: this.name,
          email: this.email,
          password: this.password,
        });

        // Check if registration is successful
        if (response.status === 201) {
          alert('Registration successful');
          this.$router.push('/'); // Redirect to the login page
        }
      } catch (error) {
        // Handling errors
        console.error('Error details:', error);  // Log the error for debugging
        if (error.response) {
          // If a response was received, but there was an error (e.g., 400 or 500 status)
          alert('Registration error: ' + error.response.data.message);
        } else if (error.request) {
          // If no response was received (server is unreachable)
          alert('Connection issue with the server. Please try again.');
        } else {
          // For other types of errors
          alert('An error occurred: ' + error.message);
        }
      }
    },
  },
};
</script>
