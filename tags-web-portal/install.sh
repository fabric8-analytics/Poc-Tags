#!/usr/bin/env bash

set -eux;

# Initialize variables
HTTPD_CONF="/etc/httpd/conf/httpd.conf"
HTTPD_WELCOME="/etc/httpd/conf.d/welcome.conf"
INSTALL_PKGS="highlight httpd nss_wrapper gettext";

# Setup necessary packages
yum -y install epel-release && yum -y install ${INSTALL_PKGS};

# Fixup Configurations
rm -rf ${HTTPD_WELCOME};
sed -i 's/^Listen 80/Listen 8080\\\nListen 8443/g' ${HTTPD_CONF};
sed -i 's/^Listen 8080\\/Listen 8080/g' ${HTTPD_CONF};
sed -i 's/^Group apache/Group root/g' ${HTTPD_CONF};
sed -i 's/logs\/error_log/\/dev\/stderr/g' ${HTTPD_CONF};
sed -i 's/logs\/access_log/\/dev\/stdout/g' ${HTTPD_CONF};
mkdir -p /etc/httpd/logs && touch /etc/httpd/logs/error_log && touch /etc/httpd/logs/access_log;

# Fix the permissions
for item in "/etc/httpd" "/var/www"; do
    . /opt/scripts/fix-permissions.sh ${item} apache;
done

chmod -R 777 /etc/httpd/logs
