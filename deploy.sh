#!/bin/bash
cd /var/www/html

# Fix permissions
find resources/views -type d -exec chmod 755 {} \;
find resources/views -type f -exec chmod 644 {} \;
find storage -type d -exec chmod 755 {} \;
chown -R www-data:www-data resources/views/ storage/ bootstrap/cache/

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Dump autoload
COMPOSER_ALLOW_SUPERUSER=1 composer dump-autoload --optimize

# DEV-01: OPcache is cleared automatically by PHP-FPM restart below
# Removed temporary public/oc.php file for security

# Run pending migrations
php artisan migrate --force

# Restart PHP-FPM
systemctl restart php8.2-fpm

echo ""
echo "Deploy complete!"
