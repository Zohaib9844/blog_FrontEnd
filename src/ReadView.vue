<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Navbar from '@/components/navbar.vue';

const route = useRoute();
const blogId = route.params.id;
const blog = ref(null);
const authorName = ref('');
const isLoading = ref(true);
const error = ref('');

// Fetch blog and author details
const fetchBlog = async () => {
  try {
    // 1. Fetch the blog
    const blogResponse = await axios.get(`http://localhost:3000/blogs/${blogId}`);
    blog.value = {
      ...blogResponse.data,
      isAuthor: blogResponse.data.author === localStorage.getItem('uid')
    };

    // 2. Fetch author details from users collection
    const userResponse = await axios.get(`http://localhost:3000/users/${blog.value.author}`);
    authorName.value = userResponse.data.name;
    
  } catch (err) {
    error.value = 'Failed to load blog. Please try again.';
    console.error('Error fetching blog:', err);
  } finally {
    isLoading.value = false;
  }
};

// Initialize
fetchBlog();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-3xl mx-auto bg-red-50 text-red-600 p-4 rounded-md mt-8">
      {{ error }}
      <button 
        @click="fetchBlog"
        class="mt-2 text-blue-600 hover:underline"
      >
        Retry
      </button>
    </div>

    <!-- Blog Content -->
    <div v-else-if="blog" class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">{{ blog.title }}</h1>
      <div class="prose max-w-none text-gray-600 mb-6" v-html="blog.content"></div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">
          Published on {{ blog.date }} by {{ authorName || 'Unknown Author' }}
        </span>
        <button
          v-if="blog.isAuthor"
          @click="$router.push(`/edit-blog/${blogId}`)"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-12">
      <p>Blog post not found</p>
    </div>
  </div>
</template>