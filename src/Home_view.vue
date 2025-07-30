<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Navbar from '@/components/navbar.vue';

const router = useRouter();
const blogs = ref([]);
const authorNames = ref({}); // Store author names by UID
const isLoading = ref(true);
const error = ref('');

// Fetch blogs and author names
const fetchBlogs = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    
    // 1. Fetch all blogs
    const blogsResponse = await axios.get('http://localhost:3000/blogs');
    blogs.value = blogsResponse.data?.map(blog => ({
      ...blog,
      content: blog.content.substring(0, 100) + '...'
    })) || [];

    // 2. Fetch author names for all unique authors
    const uniqueAuthorIds = [...new Set(blogs.value.map(blog => blog.author))];
    await Promise.all(uniqueAuthorIds.map(async (authorId) => {
      try {
        const userResponse = await axios.get(`http://localhost:3000/users/${authorId}`);
        authorNames.value[authorId] = userResponse.data.name;
      } catch (err) {
        console.error(`Error fetching author ${authorId}:`, err);
        authorNames.value[authorId] = 'Unknown Author';
      }
    }));

  } catch (err) {
    error.value = 'Failed to load blogs. Please try again later.';
    console.error('Error fetching blogs:', err);
  } finally {
    isLoading.value = false;
  }
};

// Initialize
fetchBlogs();

const handlePostBlog = () => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  router.push(isAuthenticated ? '/add-blog' : '/login');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <!-- Blog List -->
    <div class="max-w-3xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Latest Blogs</h2>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-md mb-6">
        {{ error }}
        <button 
          @click="fetchBlogs"
          class="mt-2 text-blue-600 hover:underline"
        >
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="blogs.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No blogs yet</h3>
        <p class="mt-1 text-gray-500">Be the first to share your thoughts!</p>
        <button
          @click="handlePostBlog"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Your First Blog
        </button>
      </div>

      <!-- Blog List -->
      <div v-else class="space-y-6">
        <div
          v-for="blog in blogs"
          :key="blog.id"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ blog.title }}</h3>
          <p class="text-gray-600 mb-4">{{ blog.content }}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">
              Posted on {{ blog.date }} by {{ authorNames[blog.author] || 'Loading...' }}
            </span>
            <router-link
              :to="`/blog/${blog.id}`"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              Read More →
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>