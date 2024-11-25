# Simple Banking System

## Done

1. Setup separate env file for testing ✓
2. Create validation for envs, create 'fail fast' ✓
3. Add user service again ✓
4. Add generateRefreshToken ✓
5. Add generateAccessToken ✓
6. Add generateJWT and test to it ✓
7. Generate refresh token and save it into the database ✓
8. Refresh-token endpoint, that receive refresh token, and return new access token ✓
9. Create bull queue, that runs every day, like at 00:00 am to select all token that expiredIn < current time
   then remove it from database to keep number of records as low as possible ✓
10. User controller get current user information /users/me => get current information, userId, balance, name ✓
11. it should have auth middleware to verify if the access token is correct ✓
12. Add Swagger response (TBA)
