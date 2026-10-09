import type { Project, ProjectTranslation } from './projects'

/**
 * A project with its translated text applied. Missing fields keep the
 * English; arrays are replaced item by item, so a shorter translation never
 * drops English entries. Metric labels map onto metrics by position.
 */
export function localizeProject(p: Project, t?: ProjectTranslation): Project {
  if (!t) return p
  const byIndex = (en: string[] | undefined, es: string[] | undefined) =>
    en?.map((item, i) => es?.[i] ?? item)
  const cs = p.caseStudy
  return {
    ...p,
    title: t.title ?? p.title,
    description: t.description ?? p.description,
    labTag: t.labTag ?? p.labTag,
    caseStudy: cs && {
      ...cs,
      tagline: t.caseStudy?.tagline ?? cs.tagline,
      role: t.caseStudy?.role ?? cs.role,
      problem: t.caseStudy?.problem ?? cs.problem,
      approach: t.caseStudy?.approach ?? cs.approach,
      result: t.caseStudy?.result ?? cs.result,
      highlights: byIndex(cs.highlights, t.caseStudy?.highlights),
      outcomes: byIndex(cs.outcomes, t.caseStudy?.outcomes),
      metrics: cs.metrics?.map((m, i) => ({ ...m, label: t.caseStudy?.metricLabels?.[i] ?? m.label }))
    }
  }
}
