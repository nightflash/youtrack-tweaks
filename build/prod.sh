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
RELEASED_VERSION=`wget https://chrome.google.com/webstore/detail/youtrack-tweaks/ialcocpchgkbmpmoipmoheklimalbcia -O - |
  grep -E -o '([0-9]+?\.[0-9]+?\.[0-9]+?\.[0-9]+?)' |
  tail -1`

echo "Store version: ${RELEASED_VERSION}"

MANIFEST_VERSION=`cat $DIST/manifest.json | grep -E -o '([0-9]+?\.[0-9]+?\.[0-9]+?\.[0-9]+?)'`

echo "Manifest version: ${MANIFEST_VERSION}"

RELEASED_MAJOR=`echo $RELEASED_VERSION | grep -E -o '([0-9]+?\.[0-9]+?\.[0-9]+?)'`
CURRENT_MAJOR=`echo $MANIFEST_VERSION | grep -E -o '([0-9]+?\.[0-9]+?\.[0-9]+?)'`

echo "Released ${RELEASED_MAJOR} vs manifest ${CURRENT_MAJOR}"

if [ $RELEASED_MAJOR == $CURRENT_MAJOR ];
then

  LAST_DIGIT=`echo $RELEASED_VERSION | cut -d '.' -f4`
  NEW_BUILD_NUMBER=`expr $LAST_DIGIT + 1`

  echo "Increment last digit: $LAST_DIGIT => $NEW_BUILD_NUMBER"

  NEW_VERSION=`echo $RELEASED_VERSION | sed -E "s/([0-9]*).([0-9]*).([0-9]*).([0-9]*)/\1.\2.\3.$NEW_BUILD_NUMBER/g"`

  echo "New version: $NEW_VERSION, updating manifest..."

  sed -i '' -E "s/[0-9]*\.[0-9]\.*[0-9]*\.[0-9]*/$NEW_VERSION/g" $DIST/manifest.json
else
  echo "Keep version: $MANIFEST_VERSION"
fi
# end of updating version

echo "Removing hidden files..."
find $DIST -type f -name ".*" -delete

echo "Creating archive..."
cd $DIST
zip -r ../$ARCHIVE ./*
cd ..

echo "Cleaning..."
rm -rf $DIST