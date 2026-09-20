Теперь видно точно, где проблема. Frontend работает правильно. Проблема в значении, которое приходит от backend.

Смотри:

Current UTC time:
2026-09-19T14:05:51.678Z

А backend/sessionStorage говорит:

nextResendAt:
2026-09-19T19:06:51.243Z

Разница:

19:06:51
-
14:05:51
=
5:01:00

То есть backend фактически говорит frontend:

следующий resend разрешён через 5 часов 1 минуту.

И frontend совершенно правильно считает:

18059.558 seconds
≈ 5 hours 0 minutes 59 seconds
Главная проблема

Вот это:

{
  "expiresAt": "2026-09-19T19:15:51.243Z",
  "nextResendAt": "2026-09-19T19:06:51.243Z"
}

не соответствует текущему UTC времени:

2026-09-19T14:05:51.678Z

Если resend cooldown должен быть 60 секунд, backend должен вернуть примерно:

{
  "nextResendAt": "2026-09-19T14:06:51.243Z"
}

А не:

{
  "nextResendAt": "2026-09-19T19:06:51.243Z"
}
Очень важный момент

Вот это:

Current local:
19:05:51 GMT+0500

Current UTC:
14:05:51Z

правильно.

И вот это:

nextResendAt:
19:06:51Z

означает 19:06 UTC, а не 19:06 по Туркменистану.

В локальном времени это:

00:06:51 GMT+0500

И браузер именно это показывает:

Parsed resend date:
Sun Sep 20 2026 00:06:51 GMT+0500

Это тоже правильно.

Значит ищи backend

Скорее всего у тебя где-то логика примерно такая:

const nextResendAt = new Date(
  Date.now() + RESEND_COOLDOWN_SECONDS * 1000
);

Это правильно.

Но проблема возникает, если перед этим время преобразуется в локальное:

// ❌ подозрительно
new Date(...)
someDate.setHours(...)
someDate.setMinutes(...)

или:

// ❌ подозрительно
const localTime = ...
const utcTime = ...

или особенно если используется что-то вроде:

dayjs().tz(...)

и потом результат снова конвертируется неправильно.

Что должно быть на backend

Если cooldown = 60 секунд:

const nextResendAt = new Date(
  Date.now() + 60 * 1000,
);

И Prisma:

nextResendAt,

А response:

{
  nextResendAt: nextResendAt.toISOString(),
}

Получится:

current:
2026-09-19T14:05:51.678Z

next:
2026-09-19T14:06:51.678Z

Frontend тогда получит:

differenceSeconds: ~60
И ещё один момент

У тебя два раза:

========== INITIAL COUNTDOWN CHECK ==========

Это не backend вызывает два раза.

В development режиме React StrictMode намеренно запускает эффекты повторно для проверки side effects.

То есть это нормально:

useEffect()
useEffect()

В production этого двойного вызова не будет.

Итог: Date, sessionStorage, new Date(nextResendAt), Date.now() и Statistic.Timer здесь не виноваты. Твой backend реально прислал 19:06:51Z, тогда как текущее UTC 14:05:51Z. Исправлять нужно генерацию nextResendAt на backend.










========== INITIAL COUNTDOWN CHECK ==========
ResendButton.tsx:24 [COUNTDOWN] Browser timezone: Asia/Ashgabat
ResendButton.tsx:29 [COUNTDOWN] Browser timezone offset: -300 minutes
ResendButton.tsx:35 [COUNTDOWN] Current Date object: Sat Sep 19 2026 19:05:51 GMT+0500 (Туркменистан, стандартное время)
ResendButton.tsx:36 [COUNTDOWN] Current local time: Sat Sep 19 2026 19:05:51 GMT+0500 (Туркменистан, стандартное время)
ResendButton.tsx:37 [COUNTDOWN] Current UTC time: 2026-09-19T14:05:51.678Z
ResendButton.tsx:38 [COUNTDOWN] Date.now(): 1789826751678
ResendButton.tsx:42 [COUNTDOWN] Storage key: sentInfo
ResendButton.tsx:43 [COUNTDOWN] Raw sessionStorage value: {"revId":27644,"email":"dzumanjee+resend55@gmail.com","expiresAt":"2026-09-19T19:15:51.243Z","nextResendAt":"2026-09-19T19:06:51.243Z","attempts":0,"maxAttempts":5,"resendCount":0,"maxResendCount":5}
ResendButton.tsx:47 [COUNTDOWN] Parsed sentInfo: {revId: 27644, email: 'dzumanjee+resend55@gmail.com', expiresAt: '2026-09-19T19:15:51.243Z', nextResendAt: '2026-09-19T19:06:51.243Z', attempts: 0, …}
ResendButton.tsx:55 [COUNTDOWN] Backend response fields:
ResendButton.tsx:56 [COUNTDOWN] revId: 27644
ResendButton.tsx:57 [COUNTDOWN] email: undefined
ResendButton.tsx:58 [COUNTDOWN] expiresAt: 2026-09-19T19:15:51.243Z
ResendButton.tsx:59 [COUNTDOWN] nextResendAt: 2026-09-19T19:06:51.243Z
ResendButton.tsx:60 [COUNTDOWN] attempts: 0
ResendButton.tsx:62 [COUNTDOWN] nextResendAt type: string
ResendButton.tsx:64 [COUNTDOWN] nextResendAt raw: 2026-09-19T19:06:51.243Z
ResendButton.tsx:69 [COUNTDOWN] Parsed resend date: Sun Sep 20 2026 00:06:51 GMT+0500 (Туркменистан, стандартное время)
ResendButton.tsx:73 [COUNTDOWN] Parsed resend date local: Sun Sep 20 2026 00:06:51 GMT+0500 (Туркменистан, стандартное время)
ResendButton.tsx:77 [COUNTDOWN] Parsed resend date UTC: 2026-09-19T19:06:51.243Z
ResendButton.tsx:82 [COUNTDOWN] endTime timestamp: 1789844811243
ResendButton.tsx:83 [COUNTDOWN] nowTime timestamp: 1789826751685
ResendButton.tsx:85 [COUNTDOWN] Difference milliseconds: 18059558
ResendButton.tsx:87 [COUNTDOWN] Difference seconds: 18059.558
ResendButton.tsx:89 [COUNTDOWN] Difference minutes: 300.99263333333334
ResendButton.tsx:94 [COUNTDOWN] Date.now() formatted UTC: 2026-09-19T14:05:51.685Z
ResendButton.tsx:99 [COUNTDOWN] nextResendAt formatted UTC: 2026-09-19T19:06:51.243Z
ResendButton.tsx:104 [COUNTDOWN] Is endTime valid: true
ResendButton.tsx:106 [COUNTDOWN] Is countdown still active: true
ResendButton.tsx:109 [COUNTDOWN] ✅ Setting countdownEnd: 1789844811243
ResendButton.tsx:124 ============================================
installHook.js:1 ========== INITIAL COUNTDOWN CHECK ==========
installHook.js:1 [COUNTDOWN] Browser timezone: Asia/Ashgabat
installHook.js:1 [COUNTDOWN] Browser timezone offset: -300 minutes
installHook.js:1 [COUNTDOWN] Current Date object: Sat Sep 19 2026 19:05:51 GMT+0500 (Туркменистан, стандартное время)
installHook.js:1 [COUNTDOWN] Current local time: Sat Sep 19 2026 19:05:51 GMT+0500 (Туркменистан, стандартное время)
installHook.js:1 [COUNTDOWN] Current UTC time: 2026-09-19T14:05:51.695Z
installHook.js:1 [COUNTDOWN] Date.now(): 1789826751695
installHook.js:1 [COUNTDOWN] Storage key: sentInfo
installHook.js:1 [COUNTDOWN] Raw sessionStorage value: {"revId":27644,"email":"dzumanjee+resend55@gmail.com","expiresAt":"2026-09-19T19:15:51.243Z","nextResendAt":"2026-09-19T19:06:51.243Z","attempts":0,"maxAttempts":5,"resendCount":0,"maxResendCount":5}
installHook.js:1 [COUNTDOWN] Parsed sentInfo: {revId: 27644, email: 'dzumanjee+resend55@gmail.com', expiresAt: '2026-09-19T19:15:51.243Z', nextResendAt: '2026-09-19T19:06:51.243Z', attempts: 0, …}
installHook.js:1 [COUNTDOWN] Backend response fields:
installHook.js:1 [COUNTDOWN] revId: 27644
installHook.js:1 [COUNTDOWN] email: undefined
installHook.js:1 [COUNTDOWN] expiresAt: 2026-09-19T19:15:51.243Z
installHook.js:1 [COUNTDOWN] nextResendAt: 2026-09-19T19:06:51.243Z
installHook.js:1 [COUNTDOWN] attempts: 0
installHook.js:1 [COUNTDOWN] nextResendAt type: string
installHook.js:1 [COUNTDOWN] nextResendAt raw: 2026-09-19T19:06:51.243Z
installHook.js:1 [COUNTDOWN] Parsed resend date: Sun Sep 20 2026 00:06:51 GMT+0500 (Туркменистан, стандартное время)
installHook.js:1 [COUNTDOWN] Parsed resend date local: Sun Sep 20 2026 00:06:51 GMT+0500 (Туркменистан, стандартное время)
installHook.js:1 [COUNTDOWN] Parsed resend date UTC: 2026-09-19T19:06:51.243Z
installHook.js:1 [COUNTDOWN] endTime timestamp: 1789844811243
installHook.js:1 [COUNTDOWN] nowTime timestamp: 1789826751704
installHook.js:1 [COUNTDOWN] Difference milliseconds: 18059539
installHook.js:1 [COUNTDOWN] Difference seconds: 18059.539
installHook.js:1 [COUNTDOWN] Difference minutes: 300.9923166666667
installHook.js:1 [COUNTDOWN] Date.now() formatted UTC: 2026-09-19T14:05:51.704Z
installHook.js:1 [COUNTDOWN] nextResendAt formatted UTC: 2026-09-19T19:06:51.243Z
installHook.js:1 [COUNTDOWN] Is endTime valid: true
installHook.js:1 [COUNTDOWN] Is countdown still active: true
installHook.js:1 [COUNTDOWN] ✅ Setting countdownEnd: 1789844811243
installHook.js:1 ============================================