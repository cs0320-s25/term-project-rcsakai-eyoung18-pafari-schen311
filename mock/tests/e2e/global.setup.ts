import dotenv from 'dotenv';
dotenv.config(); 
import { test } from "@playwright/test";
import { clerkSetup } from "@clerk/testing/playwright";


test('global Clerk setup', async () => {
  await clerkSetup();
  console.log("CLERK_FRONTEND_API:", process.env.CLERK_FRONTEND_API);
});