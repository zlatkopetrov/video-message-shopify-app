# Video Message App for Daily Blooms

## Config

The app is hosted in Heroku (Melbs dev account).

There are 2 pipelines setup:

- One targeting `development` branch and that triggers deployment to the UAT (staging) app version.
- The other targeting `main` branch and that triggers deployment to PROD app version.

### Keep `development` branch as source of truth!!!
