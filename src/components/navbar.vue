<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const isAuthenticated = ref(false);
const userName = ref('');

// Check auth state and fetch user data
onMounted(async () => {
  isAuthenticated.value = !!localStorage.getItem('authToken');
  if (isAuthenticated.value) {
    try {
      const uid = localStorage.getItem('uid');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_LINK}/users/${uid}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        }
      );
      userName.value = response.data.name || 'User';
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  }
});

const handlePostBlog = () => {
  router.push(isAuthenticated.value ? '/add-blog' : '/login');
};

const handleLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('uid');
  router.push('/login');
};
</script>

<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
      <router-link to="/" class="text-xl font-bold text-blue-600 hover:text-blue-800">
        BlogHub
      </router-link>
      
      <div class="flex items-center space-x-4">
        <!-- Display user name when logged in -->
        <span v-if="isAuthenticated" class="text-gray-700 font-medium">
          {{ userName }}
        </span>

        <button
          @click="handlePostBlog"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Post Blog
        </button>
        <button
          v-if="!isAuthenticated"
          @click="router.push('/login')"
          class="px-4 py-2 text-gray-600 hover:text-blue-600 transition"
        >
          Login
        </button>
        <button
          v-else
          @click="handleLogout"
          class="px-4 py-2 text-gray-600 hover:text-red-600 transition"
        >
          Logout
        </button>

        <router-link
          v-if="isAuthenticated"
          to="/admin"
          class="px-4 py-2 text-gray-600 hover:text-blue-600 transition"
        >
          Admin Panel
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>
