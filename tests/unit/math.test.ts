import { describe, expect, test } from 'bun:test'
import {
  clamp01, remap, enterProgress, rectToPlane, isOnScreen, shouldUseWebGL,
  splitWords, wordProgress, findPhrase, heroName, stageAt, hexToRgb01,
  gradientAt, gridSize, crispAmount, swirlAt, swirlAxes, swirlOrbit
} from '../../app/webgl/math'

describe('clamp01 / remap', () => {
  test('clamps', () => {
    expect(clamp01(-1)).toBe(0)
    expect(clamp01(2)).toBe(1)
    expect(clamp01(0.3)).toBe(0.3)
  })
  test('remaps and clamps', () => {
    expect(remap(5, 0, 10)).toBe(0.5)
    expect(remap(-5, 0, 10)).toBe(0)
    expect(remap(15, 0, 10)).toBe(1)
    expect(remap(3, 3, 3)).toBe(1)
  })
})

describe('enterProgress', () => {
  const vh = 1000
  const h = 400
  test('0 when the top touches the viewport bottom', () => {
    expect(enterProgress({ top: 1000, left: 0, width: 10, height: h }, vh)).toBe(0)
  })
  test('1 when centered', () => {
    expect(enterProgress({ top: 300, left: 0, width: 10, height: h }, vh)).toBe(1)
  })
  test('halfway', () => {
    expect(enterProgress({ top: 650, left: 0, width: 10, height: h }, vh)).toBeCloseTo(0.5)
  })
  test('clamped past center and before entering', () => {
    expect(enterProgress({ top: -500, left: 0, width: 10, height: h }, vh)).toBe(1)
    expect(enterProgress({ top: 3000, left: 0, width: 10, height: h }, vh)).toBe(0)
  })
})

describe('rectToPlane', () => {
  test('top-left rect maps to a y-up, centered pixel camera', () => {
    expect(rectToPlane({ top: 0, left: 0, width: 200, height: 100 }, { width: 1000, height: 800 }))
      .toEqual({ x: -400, y: 350, width: 200, height: 100 })
  })
  test('same rect after a viewport resize re-centers correctly', () => {
    expect(rectToPlane({ top: 0, left: 0, width: 200, height: 100 }, { width: 400, height: 900 }))
      .toEqual({ x: -100, y: 400, width: 200, height: 100 })
  })
})

describe('isOnScreen', () => {
  const vp = { width: 1000, height: 800 }
  test('inside', () => expect(isOnScreen({ top: 100, left: 0, width: 100, height: 100 }, vp)).toBe(true))
  test('below', () => expect(isOnScreen({ top: 900, left: 0, width: 100, height: 100 }, vp)).toBe(false))
  test('below but within margin', () => expect(isOnScreen({ top: 850, left: 0, width: 100, height: 100 }, vp, 100)).toBe(true))
  test('above', () => expect(isOnScreen({ top: -200, left: 0, width: 100, height: 100 }, vp)).toBe(false))
})

describe('shouldUseWebGL', () => {
  const ok = { reducedMotion: false, webgl: true }
  test('capable', () => expect(shouldUseWebGL(ok)).toBe(true))
  test('unknown deviceMemory is fine (Safari/Firefox)', () => expect(shouldUseWebGL({ ...ok, deviceMemory: undefined })).toBe(true))
  test('reduced motion', () => expect(shouldUseWebGL({ ...ok, reducedMotion: true })).toBe(false))
  test('no webgl', () => expect(shouldUseWebGL({ ...ok, webgl: false })).toBe(false))
  test('low memory', () => expect(shouldUseWebGL({ ...ok, deviceMemory: 2 })).toBe(false))
  test('4GB is enough', () => expect(shouldUseWebGL({ ...ok, deviceMemory: 4 })).toBe(true))
  test('forced off', () => expect(shouldUseWebGL({ ...ok, forcedOff: true })).toBe(false))
})

describe('splitWords / findPhrase', () => {
  test('collapses whitespace and keeps punctuation tokens', () => {
    expect(splitWords('  Diseño y  construyo — productos ')).toEqual(['Diseño', 'y', 'construyo', '—', 'productos'])
  })
  test('empty', () => expect(splitWords('   ')).toEqual([]))
  test('finds an English phrase ignoring trailing punctuation and case', () => {
    const words = splitWords('from the first noisy idea to the shape people actually use.')
    expect(findPhrase(words, splitWords('The shape people actually use'))).toEqual([6, 11])
  })
  test('finds a Spanish phrase with accents', () => {
    const words = splitWords('Diseño y construyo productos de IA: hasta la forma que la gente realmente usa.')
    expect(findPhrase(words, splitWords('la forma que la gente realmente usa'))).toEqual([7, 14])
  })
  test('null when absent or empty', () => {
    expect(findPhrase(['a', 'b'], ['c'])).toBeNull()
    expect(findPhrase(['a', 'b'], [])).toBeNull()
  })
})

describe('wordProgress', () => {
  test('first word starts at 0, last word ends at 1', () => {
    expect(wordProgress(0, 0, 10)).toBe(0)
    expect(wordProgress(1, 9, 10)).toBe(1)
  })
  test('earlier words resolve before later ones', () => {
    expect(wordProgress(0.5, 2, 10)).toBeGreaterThan(wordProgress(0.5, 7, 10))
  })
  test('n = 0 is resolved', () => expect(wordProgress(0, 0, 0)).toBe(1))
})

describe('heroName', () => {
  test('top of page: the name follows the intro', () => {
    expect(heroName(0, 0.5)).toBe(0.5)
    expect(heroName(0.1, 1)).toBe(1)
  })
  test('disperses while the hero is pinned', () => {
    expect(heroName(0.5, 1)).toBeCloseTo(0.5)
  })
  test('fully dispersed by p = 0.85', () => {
    expect(heroName(0.85, 1)).toBeCloseTo(0)
    expect(heroName(1, 1)).toBe(0)
  })
})

describe('gradientAt', () => {
  const close = (a: number[], b: number[]) => a.forEach((v, i) => expect(v).toBeCloseTo(b[i]!))
  test('violet → coral → orange', () => {
    close(gradientAt(0), hexToRgb01('#2B3BFF'))
    close(gradientAt(0.5), hexToRgb01('#7643FF'))
    close(gradientAt(1), hexToRgb01('#C04BFF'))
  })
  test('clamps outside [0, 1]', () => {
    close(gradientAt(-1), hexToRgb01('#2B3BFF'))
    close(gradientAt(2), hexToRgb01('#C04BFF'))
  })
})

describe('gridSize', () => {
  test('rows follow the aspect ratio', () => {
    expect(gridSize(160, 4 / 3)).toEqual({ cols: 160, rows: 120 })
    expect(gridSize(160, 16 / 10)).toEqual({ cols: 160, rows: 100 })
  })
  test('never zero rows', () => expect(gridSize(10, 1000).rows).toBe(1))
})

describe('crispAmount', () => {
  test('0 until nearly assembled, 1 when assembled', () => {
    expect(crispAmount(0.5, 0)).toBe(0)
    expect(crispAmount(0.96, 0)).toBeCloseTo(0.5)
    expect(crispAmount(1, 0)).toBe(1)
  })
  test('latent layer hides the crisp image', () => {
    expect(crispAmount(1, 1)).toBe(0)
    expect(crispAmount(1, 0.25)).toBeCloseTo(0.75)
  })
})

describe('stageAt / hexToRgb01', () => {
  test('stages', () => {
    expect(stageAt(0, 4)).toBe(0)
    expect(stageAt(1, 4)).toBe(3)
    expect(stageAt(0.5, 4)).toBeCloseTo(1.5)
    expect(stageAt(2, 4)).toBe(3)
  })
  test('hex', () => {
    expect(hexToRgb01('#F2EFE9')).toEqual([242 / 255, 239 / 255, 233 / 255])
    expect(hexToRgb01('121212')).toEqual([18 / 255, 18 / 255, 18 / 255])
  })
})

test('swirl orbits stay in range and inner orbits turn faster', () => {
  const [rMin] = swirlOrbit(0, 0)
  const [rMax, aMax] = swirlOrbit(1, 1)
  expect(rMin).toBeCloseTo(0.12)
  expect(rMax).toBeCloseTo(0.9)
  expect(aMax).toBeCloseTo(Math.PI * 2)
  const [x0, y0] = swirlAt(1, 0, 0, 100, 50)
  expect(x0).toBeCloseTo(100)
  expect(y0).toBeCloseTo(0)
  const turn = (r: number) => Math.atan2(swirlAt(r, 0, 0.5, 1, 1)[1], swirlAt(r, 0, 0.5, 1, 1)[0])
  expect(turn(0.4)).toBeGreaterThan(turn(1))
  const [ax, ay] = swirlAxes(200, 100)
  expect(ax).toBeCloseTo(100)
  expect(ay).toBeCloseTo(60)
})
