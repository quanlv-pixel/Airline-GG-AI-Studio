# Firestore Security Specification for JetJet Air

## Data Invariants
1. A **Flight** must have a unique ID matching `JJ\d+`.
2. A **Passenger** profile must be linked to a valid email.
3. A **Booking** must contain a valid PNR (6 alphanumeric characters) and reference a valid flight.
4. Only authorized staff (admins) can modify flight schedules.
5. Passengers can only view and manage their own bookings (assuming authenticated users map to passengers). *Note: For this MVP, we will treat all authenticated users as staff/admins who can manage everything, but we will structure it for future multi-user separation.*

## The Dirty Dozen Payloads (Attack Scenarios)
1. **Unauthenticated Write**: Attempting to create a flight without being signed in.
2. **Flight ID Poisoning**: Creating a flight with a 2MB string as its ID.
3. **Invalid Status Injection**: Updating a flight with status `Hibernating`.
4. **PNR Spoofing**: Creating a booking with a PNR like `ADMIN_HACK`.
5. **Unauthorized Booking Deletion**: An unauthenticated user deleting a booking.
6. **Negative Seats**: Creating a flight with `-1` seats.
7. **Shadow Field Injection**: Adding `isVerified: true` to a passenger profile.
8. **PII Leak**: An unauthenticated user listing all passengers.
9. **Flight Fare Manipulation**: A non-admin user changing a flight price.
10. **Orphaned Booking**: Creating a booking for a flight that doesn't exist (relational sync).
11. **Timestamp Spoofing**: Setting `createdAt` to a date in the future from the client.
12. **Immutable Field Change**: Changing the `id` of a flight after creation.

## The Test Runner (Mock)
We will verify that these return `PERMISSION_DENIED` in our audit.
