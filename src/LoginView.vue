<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // Ensure axios is installed (`npm install axios`)

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/users/login', {
      email: email.value,
      password: password.value,
    });

    // Save the token to localStorage (or Vuex/Pinia)
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('uid', response.data.uid);

    // Redirect to home
  router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Login failed';
    console.error('Login error:', err);
  }
};
</script>

<template>
  <!-- Keep the existing template (same as before) -->
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-80">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Login
        </button>
        <p v-if="error" class="mt-4 text-red-500 text-sm">{{ error }}</p>
        <p class="mt-4 text-gray-600 text-sm">
          Don't have an account?
          <router-link to="/signup" class="text-blue-600 hover:underline">Sign Up</router-link>
        </p>
      </form>
    </div>
  </div>
</template>