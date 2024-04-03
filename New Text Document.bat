@echo off
set num_runs=2

for /l %%x in (1, 1, %num_runs%) do (
    npx playwright test testFile16.spec.js
)