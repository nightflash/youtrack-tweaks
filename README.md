Chrome Webstore
https://chrome.google.com/webstore/developer/dashboard?hl=ru

Update production:
ssh root@youtrack-tweaks.com "cd /var/www/youtrack-tweaks/ && git pull && cd repository/ && npm run build && cd ../menu && npm i && npm run build"