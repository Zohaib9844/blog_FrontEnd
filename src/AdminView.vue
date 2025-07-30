<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Navbar from './components/navbar.vue';

const router = useRouter();
const userBlogs = ref([]);

// Fetch blogs by current user
const fetchUserBlogs = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const uid = localStorage.getItem('uid');
    const response = await axios.get(`http://localhost:3000/blogs/author/${uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    userBlogs.value = response.data;
  } catch (error) {
    console.error('Error fetching user blogs:', error);
  }
};

// Initialize
fetchUserBlogs();

// Delete blog
const deleteBlog = async (id) => {
  try {
    const token = localStorage.getItem('authToken');
    await axios.delete(`http://localhost:3000/blogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    userBlogs.value = userBlogs.value.filter(blog => blog.id !== id);
  } catch (error) {
    console.error('Error deleting blog:', error);
    alert('Failed to delete blog. Please try again.');
  }
};

// Edit blog - redirect to edit page
const editBlog = (id) => {
  router.push(`/edit-blog/${id}`);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Your Blogs</h1>
      <div class="space-y-4">
        <div
          v-for="blog in userBlogs"
          :key="blog.id"
          class="flex justify-between items-center p-4 border-b"
        >
          <div>
            <h3 class="font-medium">{{ blog.title }}</h3>
            <p class="text-sm text-gray-500">{{ blog.date }}</p>
          </div>
          <div class="space-x-2">
            <button 
              @click="editBlog(blog.id)"
              class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              @click="deleteBlog(blog.id)"
              class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>