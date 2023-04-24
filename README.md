# Roly-Poly counter

## Deployment

- Create OAuth providers

Google OAuth, etc

- Set up `.env.cfn` and `.env`

```bash
cp .env.cfn.example .env.cfn
vi .env.cfn
cp .env.example .env
vi .env
```

- Set up infrastructure with CFn

```bash
./infra/bin/deploy.sh create|update|delete <AWS_PROFILE>
```

- Set up OAuth

Set a created Cognito domain to OAuth providers.

- Deploy code

```bash
npm run build
./infra/bin/sync.sh <AWS_PROFILE>
```
