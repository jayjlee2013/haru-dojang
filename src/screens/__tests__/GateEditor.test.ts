import { describe, it, expect } from 'vitest'
import { validateGateForm } from '../GateEditor'
import { GATE_EDITOR_ERROR_NAME_REQUIRED, GATE_EDITOR_ERROR_WINDOW_TOO_SHORT } from '../../content/microcopy'

describe('validateGateForm (자유 관문 만들기 유효성 검사)', () => {
  it('이름/횟수/기간이 정상이면 통과한다', () => {
    expect(validateGateForm('10분 책 읽기', 5, 7)).toBeNull()
  })

  it('이름이 비어 있으면 오류를 반환한다', () => {
    expect(validateGateForm('', 5, 7)).toBe(GATE_EDITOR_ERROR_NAME_REQUIRED.ko)
  })

  it('공백만 있는 이름도 오류를 반환한다', () => {
    expect(validateGateForm('   ', 5, 7)).toBe(GATE_EDITOR_ERROR_NAME_REQUIRED.ko)
  })

  it('기간이 횟수보다 짧으면 오류를 반환한다', () => {
    expect(validateGateForm('산책', 5, 4)).toBe(GATE_EDITOR_ERROR_WINDOW_TOO_SHORT.ko)
  })

  it('기간이 횟수와 같으면 통과한다 (하루에 한 번씩이 최대)', () => {
    expect(validateGateForm('산책', 5, 5)).toBeNull()
  })
})
