#!/usr/bin/env bash

bun build ./lib/Store.ts --outdir ./dist;
tsc ./lib/Store.ts --declaration --emitDeclarationOnly --target es2015
mv ./lib/Store.d.ts ./dist;
