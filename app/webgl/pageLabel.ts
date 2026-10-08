export interface PageLabelContext {
  /** i18n translate */
  t: (key: string) => string
  /** full project title by id, if it exists */
  projectTitle: (id: string) => string | undefined
}

const NAME = 'Ailen Gonzalez'
const SECTIONS = ['projects', 'about', 'writing'] as const

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** The word the page-transition particles assemble for a destination path. */
export function pageLabel(path: string, ctx: PageLabelContext): string {
  const clean = path.replace(/^\/es(?=\/|$)/, '').replace(/\/+$/, '') || '/'
  const [, section, id] = clean.split('/')
  if (section === 'projects' && id) {
    const title = ctx.projectTitle(id)
    if (title) return title.split(' — ')[0] ?? title
  }
  if (section && (SECTIONS as readonly string[]).includes(section)) return capitalize(ctx.t(`nav.${section}`))
  if (clean === '/') return ctx.t('hero.title')
  return NAME
}
