# Roly-Poly counter

## Deployment

```bash
# インフラ構築
./infra/bin/deploy.sh create|update|delete HOSTED_ZONE_NAME ACM_CERTIFICATE_ARN
# public以下のファイルをアップロード
./infra/bin/sync.sh
```