@echo off
echo Stopping database lock...
echo Please ensure 'npm run dev' is STOPPED before proceeding or this will fail.
pause
call npx prisma generate
call npx prisma db push
call node prisma/seed-admin.js
echo.
echo Database fixed! You can now run 'npm run dev' again.
pause
