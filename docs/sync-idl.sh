#!/bin/bash

mkdir -p next-app/idl/ && cp target/idl/ruma.json next-app/idl/
mkdir -p next-app/src/types/ && cp target/types/ruma.ts next-app/src/types/
