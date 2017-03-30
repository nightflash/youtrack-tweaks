#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

DIST="${DIR}/../dist"
MENU="${DIR}/../menu"
EXTENSION="${DIR}/../extension"
REPOSITORY="${DIR}/../repository"

ARCHIVE="extension.zip"

echo "Cleaning dist..."
rm -rf $DIST
rm -rf $ARCHIVE
mkdir $DIST

if (( $# == 0 ))
then
  echo "Rebuild everything..."

  echo "Building menu..."
  cd $MENU
  npm i && npm run build

  echo "Building tweaks..."
  cd $REPOSITORY
  npm i && npm run build
fi

echo "Copying files..."
cp -R -L ${EXTENSION}/* $DIST

# Update extension version in manifest
CURRENT_VERSION=`wget https://chrome.google.com/webstore/detail/youtrack-tweaks/ialcocpchgkbmpmoipmoheklimalbcia -O - |
  grep -E -o '([0-9]+?\.[0-9]+?\.[0-9]+?\.[0-9]+?)' |
  tail -1`

echo "Current version in google store: ${CURRENT_VERSION}"

LAST_DIGIT=`echo $CURRENT_VERSION | cut -d '.' -f4`
NEW_DIGIT=`expr $LAST_DIGIT + 1`

echo "Increment last digit: $LAST_DIGIT => $NEW_DIGIT"

NEW_VERSION=`echo $CURRENT_VERSION | sed -e "s/$LAST_DIGIT\$/$NEW_DIGIT/g"`

echo "New version: $NEW_VERSION, updating manifest..."

sed -ie "s/0.0.0.0/$NEW_VERSION/g" $DIST/manifest.json
# end of updating version

echo "Removing hidden files..."
find $DIST -type f -name ".*" -delete

echo "Creating archive..."
cd $DIST
zip -r ../$ARCHIVE ./*
cd ..

echo "Cleaning..."
rm -rf $DIST