# Mock Data for InCampus Frontend

This directory contains mock data and services to replace backend API calls for development and testing purposes.

## Overview

The mock implementation includes:

- `mockData.ts` - Contains mock data for users, posts, profiles, notifications, and friend relationships
- `mockServices.ts` - Contains mock implementations of all API services

## Using Mock Data

All API services have been replaced with mock implementations that simulate API responses with delays to mimic real-world behavior.

### Mock Users

The system includes 5 mock users:
- John Doe (student)
- Jane Smith (student)
- Prof. Robert Johnson (faculty)
- Emily Davis (student)
- Michael Wilson (student)

### Mock Posts

The system includes 5 mock posts with likes and comments.

### Authentication

For login, you can use any of the mock user emails or university IDs with any password. The role must match the user's role.

For OTP verification, always use the code `123456`.

### Testing Notes

- All API calls have simulated delays to mimic real network requests
- The mock data is not persistent - changes will be lost on page refresh
- Friend requests, likes, and other interactions are simulated but not stored permanently

## Default User

The default logged-in user is "John Doe" (user-1). All actions are performed as this user. 