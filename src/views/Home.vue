<template>
  <MainLayout title="Home">
  		<div class="home">
    		<img
				alt="Google Maps logo"
				class="google-map-logo"
				src="../assets/google-map-logo.png" />
    		<HelloWorld msg="Welcome to Your Google Maps App" />
  		</div>
	</MainLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'
import MainLayout from '@/layout/MainLayout.vue'

export default defineComponent({
	name: 'Home',
	components: {
		HelloWorld,
		MainLayout
	},
})
</script>

<style lang="scss" scoped>
.home {
	width: 100%;
	margin-top: 60px;
	.google-map-logo {
		width: 200px;
	}
}
	
</style>
