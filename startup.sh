apt-get update -y
apt-get install -y cron

echo "30 3 * * * node codes.js" | crontab -
service cron start

nodemon server.js