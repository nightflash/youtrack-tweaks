#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

DIST="${DIR}/../dist"
MENU="${DIR}/../menu"
EXTENSION="${DIR}/../extension"
REPOSITORY="${DIR}/../repository"

ARCHIVE="extension.zip"

echo "Cleaning dist..."
rm -rf $DIST
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

echo "Creating archive..."
cd $DIST
zip -r ../$ARCHIVE ./*
cd ..

echo "Cleaning..."
rm -rf $DIST