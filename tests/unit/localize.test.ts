import { expect, test } from 'bun:test'
import { localizeProject } from '../../app/data/localize'
import type { Project } from '../../app/data/projects'

const base: Project = {
  id: 'x',
  kind: 'client',
  title: 'X — Thing',
  description: 'English',
  image: '/x.jpg',
  tags: ['A'],
  date: '2026',
  links: {},
  caseStudy: {
    tagline: 'Tag',
    problem: 'P',
    approach: 'A',
    result: 'R',
    stack: ['Nuxt'],
    highlights: ['one', 'two'],
    metrics: [{ value: '2%', label: 'Fee' }, { value: '5', label: 'Min' }]
  }
}

test('no translation returns the project untouched', () => {
  expect(localizeProject(base)).toBe(base)
})

test('translated fields replace English, missing ones fall back', () => {
  const p = localizeProject(base, { title: 'X — Cosa', caseStudy: { problem: 'Problema' } })
  expect(p.title).toBe('X — Cosa')
  expect(p.description).toBe('English')
  expect(p.caseStudy!.problem).toBe('Problema')
  expect(p.caseStudy!.approach).toBe('A')
  expect(p.caseStudy!.stack).toEqual(['Nuxt'])
})

test('arrays merge by position and keep metric values', () => {
  const p = localizeProject(base, { caseStudy: { highlights: ['uno'], metricLabels: ['Comisión'] } })
  expect(p.caseStudy!.highlights).toEqual(['uno', 'two'])
  expect(p.caseStudy!.metrics).toEqual([{ value: '2%', label: 'Comisión' }, { value: '5', label: 'Min' }])
})
