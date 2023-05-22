import { startWith, tap, Subject } from 'rxjs'

const x$ = new Subject<number>()

test('without share', () => {
  let emitted1: number = 0
  let sideEffect1a: number = 0
  let sideEffect1b: number = 0
  // create observable with x$ as its source
  const y$ = x$.pipe(
    tap(() => (sideEffect1a += 1)),
    startWith(1),
    tap(() => (sideEffect1b += 1))
  )
  // before subscription
  expect(emitted1).toBe()
  expect(sideEffect1a).toBe()
  expect(sideEffect1b).toBe()

  // after subscription
  const sub1 = y$.subscribe(v => {
    emitted1 = v
  })
  expect(emitted1).toBe()
  expect(sideEffect1a).toBe()
  expect(sideEffect1b).toBe()

  // create observable with y$ as its source
  let sideEffect2 = 0
  let emitted2 = 0
  const z$ = y$.pipe(tap(() => (sideEffect2 += 1)))

  // before subscription
  expect(sideEffect2).toBe()

  // after subscription
  const sub2 = z$.subscribe(v => {
    emitted2 = v
  })
  expect(emitted1).toBe()
  expect(sideEffect1a).toBe()
  expect(sideEffect1b).toBe()
  expect(sideEffect2).toBe()
  expect(emitted2).toBe()

  // after source x$ emits
  x$.next(9)
  expect(emitted1).toBe()
  expect(sideEffect1a).toBe()
  expect(sideEffect1b).toBe()
  expect(sideEffect2).toBe()
  expect(emitted2).toBe()

  // after unsubscribing from sub2, and x$ emits again
  sub2.unsubscribe()
  x$.next(8)
  expect(emitted1).toBe()
  expect(sideEffect1a).toBe()
  expect(sideEffect1b).toBe()
  expect(sideEffect2).toBe()
  expect(emitted2).toBe()

  sub1.unsubscribe()
})
