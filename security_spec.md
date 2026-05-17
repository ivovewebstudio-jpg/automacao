# Security Specification for I9webstudio

## Data Invariants
1. A **User** profile can only be created with a UID matching the authenticated user.
2. A **Lead** must have a valid `ownerId` matching the creator's UID.
3. An **Automation** can only be created or modified by its owner.
4. `role` fields in User profiles are immutable for regular users and can only be set to "user" on creation.
5. `createdAt` and `updatedAt` must sync with server time.

## The Dirty Dozen (Payloads to Reject)

1. **Identity Theft (User Profile)**: Creating a user profile for a different UID.
   ```json
   { "uid": "victim_uid", "email": "attacker@evil.com", "role": "user" }
   ```
2. **Privilege Escalation**: Setting `role: "admin"` during registration.
   ```json
   { "uid": "attacker_uid", "email": "attacker@evil.com", "role": "admin" }
   ```
3. **Lead Poaching**: Reading leads belonging to another user.
   (Querying without `where("ownerId", "==", uid)`)
4. **Automation Hijacking**: Modifying an automation owned by another user.
   (Update request on `/automations/other_user_flow`)
5. **Timestamp Spoofing**: Setting a fake `createdAt` in the past.
   ```json
   { "createdAt": "2020-01-01T00:00:00Z" }
   ```
6. **Shadow Field Injection**: Adding `isVerified: true` to a lead.
   ```json
   { "email": "test@test.com", "isVerified": true }
   ```
7. **Orphaned Lead**: Creating a lead without a valid ownerId.
   ```json
   { "email": "missing@owner.com" }
   ```
8. **Resource Poisoning**: Injection of 1MB string into lead name.
9. **ID Poisoning**: Using `../` or junk characters in document IDs.
10. **State Shortcut**: Setting lead status to "converted" bypassing "new" (if status logic enforced).
11. **PII Leak**: Accessing the `users` list without ownership filters.
12. **Recursive Attack**: Deep nested objects in automation config to crash rules.

## Test Runner (Logic Verification)
The `firestore.rules` will explicitly block these via `isValid[Entity]` and `hasOnly()` checks.
