#!/bin/sh

echo "Installing dependencies..."
npm install

echo "Starting development server..."
npm run dev -- --host 0.0.0.0 