name: Déploiement GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      # Remplace par "npm install" s'il n'y a pas de package-lock.json
      - run: npm ci

      # Si tu utilises des variables Firebase, ajoute-les en secrets du dépôt
      # puis décommente et adapte le bloc env ci-dessous.
      - run: npm run build
        # env:
        #   VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}

      # Cette étape crée l'artefact "github-pages" que le job deploy cherche.
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
