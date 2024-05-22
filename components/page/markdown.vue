<template>
    <div v-html="markdownContent"></div>
</template>
  
<script setup>

    import { ref, onMounted } from 'vue';
  
    const markdownContent = ref('Loading...');
    const loadMarkdown = async () => {
        try {
            const response = await fetch('/api/readme');
            const fetch_data = await response.json();
            markdownContent.value = fetch_data?.readme;
        } catch (error) {
            markdownContent.value = 'Try refresh page to see additional content.'
        }
    }

    onMounted(() => loadMarkdown())
  
</script>