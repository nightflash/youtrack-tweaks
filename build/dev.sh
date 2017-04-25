#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

MENU="${DIR}/../menu"
REPOSITORY="${DIR}/../repository"

EXTENSION="${DIR}/../extension"

cd $MENU
npm run dev &
menuWatchPid=$!

cd $REPOSITORY
npm run dev &
repoWatchPid=$!

echo "Repo pid = ${repoWatchPid}"

read -p "Press any key to stop..."

kill ${menuWatchPid}
kill ${repoWatchPid}

echo "All processes have been stopped"