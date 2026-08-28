````
Да. Сейчас **первый шаг регистрации** — это создание `RegistrationDraft` только с personal info.

### Step 1 — Personal info

```ts
const url = /registration-drafts
const method = 'POST'

const body = {
    "eventId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "patronymicName": null,
    "email": "dzumanjee@example.com",
    "phoneNumber": "+99371826988",
    "position": "Developer",
    "participantTypeId": 1,
    "privacyPolicyAccepted": true,
    "termsAndConditionsAccepted": true
}
````

### Что делает backend

Backend:

```text
проверяет event
→ проверяет что registration открыта
→ проверяет participantType
→ создаёт RegistrationDraft
→ status = PENDING
→ expiresAt = +60 минут
→ subtotal = 0
→ discountAmount = 0
→ totalAmount = 0
→ privacyPolicyAccepted = false
→ termsAndConditionsAccepted = false
→ создаёт email verification
→ генерирует OTP
→ отправляет OTP на email
```

Response даст тебе:

```json
{
  "success": true,
  "data": {
    "id": 25,
    "status": "PENDING",
    "email": "john@example.com",
    "emailVerified": false
  }
}
```

### Что frontend должен сделать

Сохранить:

```ts
const draftId = response.data.id;
```

Например:

```ts
localStorage.setItem("registrationDraftId", String(response.data.id));
```

После этого **не создавай новый draft**.

Все следующие шаги работают с этим `draftId`:

```http
    PATCH /registration-drafts/25/company-info
```

### Step 2 — Company

```json
{
  "companyName": "Example Company",
  "website": "https://example.com",
  "address": "Main Street 10",
  "countryId": 1,
  "city": "Ashgabat",
  "postalCode": "744000"
}
```

### Step 3 — Packages

```json
{
    "packages": [
        {
            "eventPackageId": 1,
            "quantity": 2
        },
         {
            "eventPackageId": 2,
            "quantity": 1
        } {
            "eventPackageId": 3,
            "quantity": 1
        }
    ]
}
```

Backend сам посчитает цены.

### Step 4 — Promocode

```http
    POST /registration-drafts/25/apply-promocode
```

```json
{
  "code": "WELCOME20"
}
```

we get new total amount

### Step 5 — Payment method

```json
{
  "paymentMethodId": 1
}
```

### Step 6 — send OTP to users Email

POST registration-drafts/2/email/send

### Step 7 — confirm OTP

Пользователь вводит код:

```http
POST /registration-drafts/25/email/verify
```

```json
{
  "code": "482913"
}
```

После успешной проверки:

```text
status = VERIFIED
emailVerified = true
```

### Step 8 — Finish

```http
    POST /registration-drafts/25/complete
```

После этого backend создаёт `User`, `Company`, `RegisterRequest` и packages в одной transaction.

---

**Прямо сейчас твоя задача на frontend:** сделать первый экран Personal Info и вызвать POST /registration-drafts. Получив id, сохрани его и используй для всех последующих шагов.```

# paticipant types

GET: /participant-types?offset=0&limit=10

# countries

GET: /country?offset=0&limit=10

# package types

GET: /event-package-types?offset=0&limit=10

# packages

GET: /event-packages?offset=0&limit=10

# payment methods

GET: /payment-methods?offset=0&limit=10

### Step 1 — Personal info

```json
POST: /registration-drafts

{
    "eventId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "patronymicName": null,
    "email": "dzumanjee@example.com",
    "phoneNumber": "+99371826988",
    "position": "Developer",
    "participantTypeId": 1,
    "privacyPolicyAccepted": true,
    "termsAndConditionsAccepted": true
}
```

# draftId <- get ID from response and put save it

```json
{
    "success": true,
    "data": {
        "id": 25,
        .....
    }
}
```

### Step 2 — Company

PATCH: /registration-drafts/{draftId}/company-info

```json

{
    "companyName": "Example Company",
    "website": "https://example.com", (or null)
    "address": "Main Street 10",
    "countryId": 1,
    "city": "Ashgabat",
    "postalCode": "744000"
}
```

### Step 3 — Packages

PATCH: /registration-drafts/{draftId}/packages

```json
{
  "packages": [
    {
      "eventPackageId": 1,
      "quantity": 2
    },
    {
      "eventPackageId": 2,
      "quantity": 1
    },
    {
      "eventPackageId": 3,
      "quantity": 1
    }
  ]
}
```

### Step 4 — Promocode

POST: /registration-drafts/{draftId}/promocode

```json
{
  "code": {"PROMOCODE"}
}
```

### Step 5 — Payment method

PATCH: /registration-drafts/{draftId}/payment-methods

```json
{
  "paymentMethodId": 1
}
```

### Step 6 — send OTP to users Email

POST: /registration-drafts/{draftId}/email/send

```json
{}
```

### Step 7 — confirm OTP

POST: /registration-drafts/{draftId}/email/verify

{
"code": "482913"
}

### Step 8 — Finish

POST: /registration-drafts/{draftId}/complete

{}
