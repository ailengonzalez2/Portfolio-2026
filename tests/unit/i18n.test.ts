import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dir, '../..')
const en = JSON.parse(readFileSync(join(root, 'i18n/locales/en.json'), 'utf8'))
const es = JSON.parse(readFileSync(join(root, 'i18n/locales/es.json'), 'utf8'))

const flatten = (obj: Record<string, unknown>, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? flatten(v as Record<string, unknown>, `${prefix}${k}.`) : [`${prefix}${k}`])

const files = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
  const p = join(dir, name)
  return statSync(p).isDirectory() ? files(p) : /\.(vue|ts)$/.test(name) ? [p] : []
})

describe('i18n', () => {
  const enKeys = new Set(flatten(en))
  const esKeys = new Set(flatten(es))

  test('en and es have the same keys', () => {
    expect([...enKeys].filter(k => !esKeys.has(k))).toEqual([])
    expect([...esKeys].filter(k => !enKeys.has(k))).toEqual([])
  })

  test('every literal t()/$t() key used in app/ exists', () => {
    const used = new Set<string>()
    for (const f of files(join(root, 'app'))) {
      for (const m of readFileSync(f, 'utf8').matchAll(/(?<![\w.$])\$?t\(\s*'([a-zA-Z]\w*\.[\w.]+)'/g)) used.add(m[1]!)
    }
    // A key may point at a whole object (e.g. arrays read with tm); accept prefixes.
    const missing = [...used].filter(k => !enKeys.has(k) && ![...enKeys].some(e => e.startsWith(`${k}.`)))
    expect(missing).toEqual([])
  })
})
