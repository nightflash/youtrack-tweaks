SSL:
certbot certonly --webroot -w /var/www/public/youtrack-tweaks/landing -d youtrack-tweaks.com

https://certbot.eff.org/#ubuntuxenial-nginx

Renew: certbot renew --dry-run

Upload:
scp -rp ./vue/dist/* root@youtrack-tweaks.com:/var/www/public/youtrack-tweaks/landing