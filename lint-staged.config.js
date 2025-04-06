export default {
  '**/*.{ts,js}': ['eslint --fix', 'prettier --write'],
  '**/*.{json,md}': ['prettier --write'],
  '**/*': async () => {
    return 'npm run typecheck'
  },
}
