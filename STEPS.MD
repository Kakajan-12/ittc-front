<!-- http://192.168.1.108:5001 -->

**6 основных шагов**:
create →
personal info →
organization →
packages →
promocode →
payment →
email verification →
complete.

---

## 1. CREATE DRAFT — STEP 1

POST /registration-drafts

```json
{
  "eventId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "patronymicName": null,
  "email": "john.doe@example.com",
  "phoneNumber": "+99365123456",
  "position": "Developer",
  "privacyPolicyAccepted": true,
  "termsAndConditionsAccepted": true
}
```

```json
{
  "data": {
    "id": 1
    .....
  }
}
```

save this `id` — and use it for next requests:
DRAFT_ID = 1

---

# 2. (OPTIONAL) PERSONAL INFO — STEP 1 UPDATE

PATCH /registration-drafts/1/personal-info

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "patronymicName": "Michael",
  "email": "john.doe@example.com",
  "phoneNumber": "+99365123456",
  "position": "Senior Developer"
}
```

---

# 3. ORGANIZATION INFO — STEP 2

PATCH /registration-drafts/1/organization-info

```json
{
  "organizationName": "Tech Solutions LLC",
  "website": "https://example.com",
  "address": "123 Main Street",
  "countryId": 1,
  "city": "Ashgabat",
  "postalCode": "744000"
}
```

---

# 4. PACKAGES — STEP 3

PATCH /registration-drafts/1/packages

```json
{
  "packages": [
    {
      "eventPackageId": 1,
      "quantity": 1
    },
    {
      "eventPackageId": 2,
      "quantity": 2
    }
  ]
}
```

---

# 5. APPLY PROMOCODE

POST /registration-drafts/1/apply-promocode

```json
{
  "code": "WELCOME10"
}
```

---

# 6. PAYMENT — STEP 4

PATCH /registration-drafts/1/payment-method

```json
{
  "paymentMethodId": 1
}
```

---

# 7. SEND EMAIL VERIFICATION

POST /registration-drafts/1/email/send

```json
{}
```

---

# 8. VERIFY EMAIL

POST /registration-drafts/1/verify-email

{
"otp": "482913"
}

---

# 9. COMPLETE REGISTRATION

POST /registration-drafts/1/complete

{}
