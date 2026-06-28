const ERROR_MAP = {
  'Invalid login credentials': '아이디 또는 비밀번호가 올바르지 않습니다.',
  'Email not confirmed': '이메일 인증이 필요합니다. 메일함을 확인해 주세요.',
  'User already registered': '이미 가입된 이메일입니다.',
  'Password should be at least 6 characters': '비밀번호는 6자 이상이어야 합니다.',
  'Signup requires a valid password': '비밀번호를 입력해 주세요.',
  'Unable to validate email address: invalid format': '올바른 이메일 형식이 아닙니다.',
  'Email address not authorized': '사용할 수 없는 이메일입니다.',
  'over_email_send_rate_limit': '이메일 발송 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.',
  'Email signups are disabled': '이메일 회원가입이 비활성화되어 있습니다.',
}

export function toKoreanError(message) {
  if (!message) return '오류가 발생했습니다. 다시 시도해 주세요.'
  for (const [key, value] of Object.entries(ERROR_MAP)) {
    if (message.includes(key)) return value
  }
  console.error('[auth] unmapped error:', message)
  return '오류가 발생했습니다. 다시 시도해 주세요.'
}
