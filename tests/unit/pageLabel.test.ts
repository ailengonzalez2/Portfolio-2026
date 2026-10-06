import { expect, test } from 'bun:test'
import { pageLabel } from '../../app/webgl/pageLabel'

const ctx = {
  t: (key: string) => ({ 'nav.projects': 'proyectos', 'nav.about': 'about', 'nav.writing': 'writing' } as Record<string, string>)[key] ?? key,
  projectTitle: (id: string) => (id === 'enter' ? 'Enter — Sell Tickets Online' : undefined)
}

test('home (any locale) shows the name', () => {
  expect(pageLabel('/', ctx)).toBe('Ailen Gonzalez')
  expect(pageLabel('/es', ctx)).toBe('Ailen Gonzalez')
  expect(pageLabel('/es/', ctx)).toBe('Ailen Gonzalez')
})

test('sections use the translated, capitalized nav label', () => {
  expect(pageLabel('/es/projects', ctx)).toBe('Proyectos')
  expect(pageLabel('/about', ctx)).toBe('About')
  expect(pageLabel('/writing/some-post', ctx)).toBe('Writing')
})

test('a case study uses the short project title', () => {
  expect(pageLabel('/projects/enter', ctx)).toBe('Enter')
  expect(pageLabel('/es/projects/enter', ctx)).toBe('Enter')
})

test('unknown project or route falls back sensibly', () => {
  expect(pageLabel('/projects/nope', ctx)).toBe('Proyectos')
  expect(pageLabel('/something-else', ctx)).toBe('Ailen Gonzalez')
})
