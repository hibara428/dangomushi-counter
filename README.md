# Roly-Poly counter

## Deployment

- Create OAuth providers:

Google OAuth, etc

- Build infrastructures with CFn:

Please read the [infra/README.md](infra/README.md).

- Set the redirect URI of OAuth providers:

Set the redirect URI of OAuth providers with created Cognito client domain.

- Set environment variables for application:

```bash
cp .env.example .env
vi .env
```

- Build & Deploy the application:

```bash
npm run build
./infra/bin/sync.sh <AWS_PROFILE>
```

or GitHub Actions workflow.
