# Production Failure Simulation Report

## Project Overview
This project simulates real-world production failures using FastAPI. The objective was to test application behavior under common production issues such as invalid inputs, connection failures, retries, high concurrency, logging, and prolonged instability.
---

## 1. Invalid Input Simulation

### Endpoint
POST /user

### Test
Sent invalid data:

{
    "name": "Shivanshu",
    "age": "abc"
}

### Result
The API returned:

422 Unprocessable Entity

The validation failed because the age field expects an integer value.

### Status
PASS

---

## 2. Disconnect Simulation

### Endpoint
GET /disconnect

### Test
The endpoint was configured to randomly fail using probability-based logic.
### Result
Some requests returned:
500 Internal Server Error
200 OK

### Status
PASS

---

## 3. Retry Mechanism

### File
retry_handler.py

### Test
The retry handler automatically retried requests when failures occurred.

### Result
Failed requests were retried automatically up to the configured retry limit. Temporary failures were successfully recovered without manual intervention.

### Status
PASS

---

## 4. High Concurrency Test

### File
concurrency_test.py

### Users
100 simultaneous requests

### Result

Success Requests: 54
Failed Requests: 46

Execution Time: 0.27 seconds

### Status
PASS

---

## 5. Logging System

### File
logs.txt

### Test
Application events were logged during disconnect and instability simulations.
### Result
Sample log entries:

2026-06-01 22:55:31 - Unstable Success
2026-06-01 22:55:35 - Unstable Failure
2026-06-01 22:55:37 - Unstable Failure
2026-06-01 22:55:39 - Unstable Failure
2026-06-01 22:55:40 - Unstable Success

All events were successfully recorded with timestamps.

### Status
PASS

---

## 6. Prolonged Instability Simulation

### Endpoint
GET /unstable

### Test
80% failure probability

### Result
Observed behavior:

Unstable Success
Unstable Failure
Unstable Failure
Unstable Failure
Unstable Success

### Status
PASS

---

## Conclusion

The Production Failure Simulation Suite successfully simulated:

- Invalid Inputs
- Random Disconnects
- Retry Mechanisms
- High Concurrency
- Logging
- Prolonged Instability

The system behaved as expected under different failure scenarios.