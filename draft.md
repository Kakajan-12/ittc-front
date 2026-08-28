export type T_REGISTRATION_DRAFT = T_ENTITY & {
eventId: number
firstName: string
lastName: string
patronymicName: string | null
email: string
phoneNumber: string
position: string
organizationName: string | null
website: string | null
address: string | null
countryId: number | null
city: string | null
postalCode: string | null

    packages: {
        id: number
        registrationDraftId: number
        eventPackageId: number
        quantity: number
        unitPrice: number
        totalPrice: number
        discountAmount: number
        discountedTotalPrice: number
        createdAt: Date
        updatedAt: Date
    }[]

    paymentMethodId: number | null
    promocodeId: number | null
    promocodeCode: string | null
    subtotalUsd: number
    subtotalTmt: number
    discountAmountUsd: number
    discountAmountTmt: number
    totalAmountUsd: number
    totalAmountTmt: number
    privacyPolicyAccepted: boolean
    termsAndConditionsAccepted: boolean
    status: 'PENDING' | 'VERIFIED' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED'
    expiresAt: Date
    emailVerified: boolean
    createdAt: Date
    updatedAt: Date

}

{
"success": true,
"message": "Registration draft retrieved successfully",
"data": {
"id": 1,
"eventId": 1,
"firstName": "TEST1",
"lastName": "TEST1",
"patronymicName": null,
"email": "dzumanjee@gmail.com",
"phoneNumber": "+99365123456",
"position": "Developer",
"organizationName": "Tech Solutions LLC",
"website": "https://example.com",
"address": "123 Main Street",
"countryId": 1,
"city": "Ashgabat",
"postalCode": "744000",
"paymentMethodId": 1,
"promocodeId": 1,
"promocodeCode": "WELCOME10",
"subtotalUsd": 500,
"subtotalTmt": 0,
"discountAmountUsd": 50,
"discountAmountTmt": 0,
"totalAmountUsd": 450,
"totalAmountTmt": 0,
"privacyPolicyAccepted": true,
"termsAndConditionsAccepted": true,
"status": "COMPLETED",
"expiresAt": "2026-08-25T04:43:16.706Z",
"createdAt": "2026-08-25T03:43:16.719Z",
"updatedAt": "2026-08-25T03:49:35.574Z",
"packages": [
{
"id": 1,
"registrationDraftId": 1,
"eventPackageId": 1,
"quantity": 1,
"unitPrice": 500,
"totalPrice": 500,
"createdAt": "2026-08-25T03:45:24.912Z",
"updatedAt": "2026-08-25T03:45:24.912Z"
}
],
"emailVerification": {
"id": 1,
"registrationDraftId": 1,
"codeHash": "3f895c0ecb48e79c23e1e3e2480ea0e557eb85411d09613237cfb33243de08e0",
"expiresAt": "2026-08-25T03:58:39.426Z",
"verifiedAt": "2026-08-25T03:49:22.679Z",
"attempts": 0,
"maxAttempts": 5,
"resendCount": 0,
"lastSentAt": "2026-08-25T03:48:39.426Z",
"createdAt": "2026-08-25T03:48:39.428Z",
"updatedAt": "2026-08-25T03:49:22.683Z"
},
"emailVerified": true
}
}
