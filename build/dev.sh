#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

MENU="${DIR}/../menu"
REPOSITORY="${DIR}/../repository"

EXTENSION="${DIR}/../extension"

cd $MENU
npm run build -- --watch &
menuWatchPid=$!

cd $REPOSITORY
npm run build -- --watch &
repoWatchPid=$!

echo "Repo pid = ${repoWatchPid}"

read -p "Press any key to stop..."

kill ${menuWatchPid}
kill ${repoWatchPid}

echo "All processes have been stopped"