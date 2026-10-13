import { describe, expect, test } from 'bun:test'
import type { Project } from '../../app/data/projects'
import { projects } from '../../app/data/projects'
import { getFeaturedProjects } from '../../app/data/selectors'

const base = (id: string, extra: Partial<Project> = {}): Project => ({
  id, kind: 'client', title: id, description: '', image: `/${id}.jpg`, tags: [], date: '2025', links: {}, ...extra
})

describe('getFeaturedProjects', () => {
  test('only featured, sorted by featuredOrder', () => {
    const list = [base('a', { featuredOrder: 2 }), base('b'), base('c', { featuredOrder: 1 })]
    expect(getFeaturedProjects(list).map(p => p.id)).toEqual(['c', 'a'])
  })
  test('real data has 3–4 featured client projects', () => {
    const featured = getFeaturedProjects(projects)
    expect(featured.length).toBeGreaterThanOrEqual(3)
    expect(featured.length).toBeLessThanOrEqual(4)
    expect(featured.every(p => p.kind === 'client')).toBe(true)
  })
})
