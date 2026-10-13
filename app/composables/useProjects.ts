import { projects } from '~/data/projects'
import { projectsEs } from '~/data/projects.es'
import { localizeProject } from '~/data/localize'

/** The projects in the page's language (Spanish text where translated). */
export function useProjects() {
  const { locale } = useI18n()
  return computed(() => locale.value === 'es'
    ? projects.map(p => localizeProject(p, projectsEs[p.id]))
    : projects)
}
