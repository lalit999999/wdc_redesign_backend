# Setting Up Admin User

## Quick Setup via MongoDB

1. Open MongoDB Compass or use MongoDB Shell
2. Connect to your database: `mongodb+srv://lalitgujar:1234@learnmongodb.sxfmjhc.mongodb.net/wdc_redesign`
3. Run this command in the `users` collection:

```javascript
db.users.updateOne(
  { email: "your-email@nitp.ac.in" },
  { $set: { role: "admin" } },
);
```

Replace `your-email@nitp.ac.in` with the email you logged in with.

## Verify It Worked

After updating, log out and log in again. You should now be able to create assignments and announcements. Check the browser console for any errors.

## Troubleshooting

If items still don't save:

1. Check browser Console (F12) for error messages
2. Check backend terminal for logs (should show "Assignment created successfully")
3. Verify the deadline format is correct (should be a valid date)
4. Make sure you're logged in as admin (check localStorage in DevTools)
