Chrome Webstore:
https://chrome.google.com/webstore/developer/dashboard?hl=ru

Firefox Store:


Production build (will generate extension.zip in root directory):
./build/prod.sh

Development (will run watched menu and repository build for ./extension directory):
./build/dev.sh

SSL:
certbot certonly --webroot -w /var/www/public/youtrack-tweaks/landing -d youtrack-tweaks.com

https://certbot.eff.org/#ubuntuxenial-nginx

Renew: certbot renew --dry-run
