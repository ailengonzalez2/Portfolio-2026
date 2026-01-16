<script setup lang="ts">
const seo = {
  title: 'Ailen Gonzalez - Product Designer & Frontend Developer',
  description: 'Creating digital experiences. Product designer and frontend developer specializing in user-centered digital products.'
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
    <ScrollPath />
    <LandingHero />
    <LandingRolls />
    <LandingProjects />
    <LandingServices />
    <LandingAboutMe />
    <LandingWeb3Quote />
  </UPage>
</template>
