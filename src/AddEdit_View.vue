<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import Navbar from '@/components/navbar.vue';

const router = useRouter();
const route = useRoute();
const title = ref('');
const content = ref('');
const isEditMode = ref(false);
const blogId = ref('');
const isLoading = ref(false);
const error = ref('');

// Initialize based on route
onMounted(() => {
  if (route.params.id) {
    isEditMode.value = true;
    blogId.value = route.params.id;
    fetchBlog();
  }
});

const fetchBlog = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`http://localhost:3000/blogs/${blogId.value}`);
    title.value = response.data.title;
    content.value = response.data.content;
  } catch (err) {
    error.value = 'Failed to load blog. Please try again.';
    console.error('Error fetching blog:', err);
  } finally {
    isLoading.value = false;
  }
};

const submitBlog = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    const token = localStorage.getItem('authToken');
    const blogData = {
      title: title.value,
      content: content.value,
      author: localStorage.getItem('uid')
    };

    if (isEditMode.value) {
      await axios.put(`http://localhost:3000/blogs/${blogId.value}`, blogData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await axios.post('http://localhost:3000/blogs', blogData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    router.push('/admin');
  } catch (err) {
    error.value = isEditMode.value 
      ? 'Failed to update blog. Please try again.'
      : 'Failed to create blog. Please try again.';
    console.error('Error saving blog:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">
        {{ isEditMode ? 'Edit Blog Post' : 'Create New Blog Post' }}
      </h1>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-md mb-6">
        {{ error }}
      </div>

      <form @submit.prevent="submitBlog">
        <div class="mb-6">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Enter blog title"
          />
        </div>

        <div class="mb-6">
          <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
            Content <span class="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            v-model="content"
            rows="10"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Write your blog content here..."
          ></textarea>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="router.push('/admin')"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>
              {{ isEditMode ? 'Update' : 'Publish' }} Blog
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>