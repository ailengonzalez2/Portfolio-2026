import type { Project } from './projects'

export function getFeaturedProjects(list: Project[]) {
  return list
    .filter(p => p.featuredOrder !== undefined)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
}

export function getProcessShowcase(list: Project[]) {
  return list.find(p => p.processShowcase && p.processSnippet)
}
