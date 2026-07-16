import { subHours, format } from 'date-fns'

// 하루 경계 기본값: 새벽 4시. 이 시각 이전은 전날로 취급한다.
export const DEFAULT_BOUNDARY_HOUR = 4

const DAY_KEY_FORMAT = 'yyyy-MM-dd'

/**
 * 특정 시각을 하루 경계 규칙에 따라 dayKey('yyyy-MM-dd') 문자열로 변환한다.
 *
 * 경계 시각(기본 04:00) 이전에 찍은 도장은 전날의 것으로 취급한다.
 * 모든 판정은 이 문자열로만 수행해 타임존/시분초 이슈를 차단한다.
 */
export function dayKey(now: Date, boundaryHour: number = DEFAULT_BOUNDARY_HOUR): string {
  return format(subHours(now, boundaryHour), DAY_KEY_FORMAT)
}
