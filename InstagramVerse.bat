@echo off
cd /d "C:\Users\prath\OneDrive\Desktop\Bots\InstagramVerse"

docker compose up -d

start http://localhost:3000

npm run dev