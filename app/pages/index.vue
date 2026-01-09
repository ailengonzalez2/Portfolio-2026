<script setup lang="ts">
const seo = {
  title: 'Ailen Gonzalez - Product Designer & Frontend Developer',
  description: 'Building modern, accessible digital products. Product designer and frontend developer specializing in creating user-centered digital experiences.'
}

useSeoMeta({
  title: seo.title,
  ogTitle: seo.title,
  description: seo.description,
  ogDescription: seo.description
})
</script>

<template>
  <UPage>
    <LandingHero />
    <LandingRolls />
    <LandingProjects />
    <LandingServices />
    <LandingAboutMe />
    <LandingWeb3Quote />
  </UPage>
</template>
