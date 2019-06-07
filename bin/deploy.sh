#!/bin/bash
set -ex

export ENV_NAME="$1"

if [ $ENV_NAME == "testing" ]; then
    echo "CONFIGURING TESTING PROPERTIES"
    export API_URL=http://localhost/api_rentas/rest
    export NODE_ENV=testing
elif [ $ENV_NAME == "prod" ]; then
    echo "CONFIGURING PROD PROPERTIES"
    export API_URL=http://cs.intervan.com.ar/api_rentas/rest
    export NODE_ENV=production
fi

echo "BUILDING"
yarn build
