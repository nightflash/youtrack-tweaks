Update production:
ssh root@youtrack-tweaks.com "cd /var/www/youtrack-tweaks/ && git pull && cd repository/ && npm run build && cd ../menu && ng build --prod"