#!/bin/bash

mkdir -p client/idl/ && cp anchor/target/idl/ruma.json client/idl/
mkdir -p client/src/types/ && cp anchor/target/types/ruma.ts client/src/types/
