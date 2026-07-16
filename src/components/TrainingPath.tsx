import type { GateDef } from '../domain/types'
import styles from './TrainingPath.module.css'

interface TrainingPathProps {
  orderedGates: GateDef[]
  currentGateId: string
  clearedGateIds: ReadonlySet<string>
}

type PathRowKind = 'cleared' | 'current' | 'nextLocked' | 'hidden' | 'boss'

interface PathRow {
  gate: GateDef
  kind: PathRowKind
}

/**
 * 수련 경로 표시 목록을 계산한다.
 * 클리어/현재 관문은 전부 보여주고, 현재 다음 관문 1개만 잠금으로 노출, 그 뒤는 숨김("···").
 */
function buildPathRows(
  orderedGates: GateDef[],
  currentGateId: string,
  clearedGateIds: ReadonlySet<string>
): PathRow[] {
  const currentIndex = orderedGates.findIndex((g) => g.id === currentGateId)
  const rows: PathRow[] = []

  orderedGates.forEach((gate, index) => {
    if (clearedGateIds.has(gate.id)) {
      rows.push({ gate, kind: 'cleared' })
      return
    }
    if (gate.id === currentGateId) {
      rows.push({ gate, kind: gate.kind === 'boss' ? 'boss' : 'current' })
      return
    }
    if (currentIndex !== -1 && index === currentIndex + 1) {
      rows.push({ gate, kind: 'nextLocked' })
      return
    }
    rows.push({ gate, kind: 'hidden' })
  })

  return rows
}

function GateRow({ row }: { row: PathRow }): JSX.Element | null {
  const { gate, kind } = row

  if (kind === 'hidden') return null

  if (kind === 'cleared') {
    return (
      <li className={styles.row}>
        <span className={styles.stampCircle} />
        <span className={styles.gateName}>{gate.name ?? '나만의 관문'}</span>
        <span className={styles.status}>클리어</span>
      </li>
    )
  }

  if (kind === 'current' || kind === 'boss') {
    return (
      <li className={`${styles.row} ${styles.currentRow}`}>
        <span className={styles.currentMarker} />
        <span className={styles.gateName}>{gate.name ?? '나만의 관문'}</span>
        <span className={styles.status}>{kind === 'boss' ? '승급 심사' : '도전 중'}</span>
      </li>
    )
  }

  return (
    <li className={styles.row}>
      <span className={styles.lockedMarker} />
      <span className={`${styles.gateName} ${styles.lockedName}`}>???</span>
    </li>
  )
}

/** 수련 경로: 세로 리스트. 클리어/현재/다음 1개 잠금까지만 보여주고 그 뒤는 숨긴다. */
export function TrainingPath({
  orderedGates,
  currentGateId,
  clearedGateIds
}: TrainingPathProps): JSX.Element {
  const rows = buildPathRows(orderedGates, currentGateId, clearedGateIds)
  const hasHidden = rows.length < orderedGates.length

  return (
    <section className={styles.path}>
      <h3 className={styles.heading}>수련 경로</h3>
      <ul className={styles.list}>
        {rows.map((row) => (
          <GateRow key={row.gate.id} row={row} />
        ))}
      </ul>
      {hasHidden && <p className={styles.ellipsis}>···</p>}
    </section>
  )
}
