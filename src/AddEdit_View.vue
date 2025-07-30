<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import Navbar from '@/components/navbar.vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

const router = useRouter();
const route = useRoute();
const title = ref('');
const isEditMode = ref(false);
const blogId = ref('');
const isLoading = ref(false);
const error = ref('');

// Initialize Tiptap without code-block-lowlight
const editor = useEditor({
  extensions: [
    StarterKit, // Includes basic extensions like paragraphs, headings, lists, etc.
  ],
  content: '',
});

// Load blog data for editing
onMounted(() => {
  console.log('Editor instance:', editor.value); // Check the actual editor instance
  if (route.params.id) {
    isEditMode.value = true;
    blogId.value = route.params.id;
    fetchBlog();
  }
});

const fetchBlog = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_LINK}/blogs/${blogId.value}`);
    title.value = response.data.title;
    editor.value.commands.setContent(response.data.content); // Use editor.value
  } catch (err) {
    error.value = 'Failed to load blog.';
  } finally {
    isLoading.value = false;
  }
};

const submitBlog = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('authToken');
    
    // Ensure editor is initialized (check editor.value)
    if (!editor.value) {
      throw new Error('Editor not initialized');
    }

    const blogData = {
      title: title.value,
      content: editor.value.getHTML(), // Use editor.value
      author: localStorage.getItem('uid'),
    };

    if (isEditMode.value) {
      await axios.put(`${import.meta.env.VITE_BACKEND_LINK}/blogs/${blogId.value}`, blogData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(`${import.meta.env.VITE_BACKEND_LINK}/blogs`, blogData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    router.push('/admin');
  } catch (err) {
    console.error('Error submitting blog:', err.response?.data || err.message);
    error.value = isEditMode.value ? 'Failed to update blog.' : 'Failed to create blog.';
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
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Content <span class="text-red-500">*</span>
          </label>
          
          <!-- Enhanced Toolbar -->
          <div class="flex flex-wrap gap-2 mb-2 border-b pb-2">
            <!-- Text Formatting -->
            <button
              type="button"
              @click="editor.chain().focus().toggleBold().run()"
              :class="{ 'bg-gray-200': editor?.isActive('bold') }"
              class="p-2 rounded hover:bg-gray-100"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              @click="editor.chain().focus().toggleItalic().run()"
              :class="{ 'bg-gray-200': editor?.isActive('italic') }"
              class="p-2 rounded hover:bg-gray-100"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              @click="editor.chain().focus().toggleUnderline().run()"
              :class="{ 'bg-gray-200': editor?.isActive('underline') }"
              class="p-2 rounded hover:bg-gray-100"
            >
              <u>U</u>
            </button>

            <!-- Headings -->
            <button
              type="button"
              @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
              :class="{ 'bg-gray-200': editor?.isActive('heading', { level: 1 }) }"
              class="p-2 rounded hover:bg-gray-100"
            >
              H1
            </button>
            <button
              type="button"
              @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
              :class="{ 'bg-gray-200': editor?.isActive('heading', { level: 2 }) }"
              class="p-2 rounded hover:bg-gray-100"
            >
              H2
            </button>
            <button
              type="button"
              @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
              :class="{ 'bg-gray-200': editor?.isActive('heading', { level: 3 }) }"
              class="p-2 rounded hover:bg-gray-100"
            >
              H3
            </button>

            <!-- Lists -->
            <button
              type="button"
              @click="editor.chain().focus().toggleBulletList().run()"
              :class="{ 'bg-gray-200': editor?.isActive('bulletList') }"
              class="p-2 rounded hover:bg-gray-100"
            >
              <ul class="list-disc"><li></li></ul>
            </button>
            <button
              type="button"
              @click="editor.chain().focus().toggleOrderedList().run()"
              :class="{ 'bg-gray-200': editor?.isActive('orderedList') }"
              class="p-2 rounded hover:bg-gray-100"
            >
              <ol class="list-decimal"><li></li></ol>
            </button>

            <!-- Code Block -->
            <button
              type="button"
              @click="editor.chain().focus().toggleCodeBlock().run()"
              :class="{ 'bg-gray-200': editor?.isActive('codeBlock') }"
              class="p-2 rounded hover:bg-gray-100"
            >
              <code>{ }</code>
            </button>
          </div>

          <!-- Editor Content -->
          <EditorContent
            :editor="editor"
            class="min-h-[200px] border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Buttons remain unchanged -->
        <div class="flex justify-end gap-4 mt-6">
          <button
            type="button"
            @click="router.push('/admin')"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            :disabled="isLoading"
          >
            {{ isEditMode ? 'Update' : 'Publish' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>