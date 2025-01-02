#!/bin/bash

SCRIPT_PATH=$(dirname $(readlink -f $0))

# ruma.json in target/idl
mkdir -p $SCRIPT_PATH/../../client/src/idl || exit 1
cp $SCRIPT_PATH/../target/idl/ruma.json $SCRIPT_PATH/../../client/src/idl || exit 1
echo "Copied ruma.json to client/src/idl"

# ruma.ts in target/types
mkdir -p $SCRIPT_PATH/../../client/src/types || exit 1
cp $SCRIPT_PATH/../target/types/ruma.ts $SCRIPT_PATH/../../client/src/types || exit 1
echo "Copied ruma.ts to client/src/types"
