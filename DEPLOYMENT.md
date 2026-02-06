# Deployment Guide

## Prerequisites

- **Docker**: Ensure Docker is installed on the target server.
- **Environment Variables**: Collect all necessary secrets (Supabase keys, Stripe keys, etc.).
- **Domain**: A domain name pointing to the server IP.

## 1. Environment Setup

Create a `.env.production` file on your server (do NOT commit this to Git):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# Add other secrets...
```

## 2. Docker Deployment

### Option A: Using Pre-built Image (CI/CD)

If you have set up the GitHub Actions workflow, simply pull the image:

```bash
docker pull ghcr.io/your-username/marsana-fleet:latest
docker run -d -p 3000:3000 --env-file .env.production --name marsana-fleet ghcr.io/your-username/marsana-fleet:latest
```

### Option B: Manual Build

```bash
docker build -t marsana-fleet .
docker run -d -p 3000:3000 --env-file .env.production --name marsana-fleet marsana-fleet
```

## 3. Database Migrations

Ensure your production database is up to date. You can apply migrations manually or via a CI job.

**Manual:**
```bash
npx supabase db push
```

## 4. Rollback Plan

In case of a critical failure:

1.  **Stop the current container**:
    ```bash
    docker stop marsana-fleet
    ```
2.  **Run the previous version**:
    ```bash
    # Assuming you tagged previous versions or use SHA
    docker run -d -p 3000:3000 --env-file .env.production --name marsana-fleet ghcr.io/your-username/marsana-fleet:previous-tag
    ```

## 5. Monitoring & Logs

- **Logs**: View logs via Docker:
    ```bash
    docker logs -f marsana-fleet
    ```
- **Health Check**: The app exposes standard endpoints. Configure your load balancer (Nginx/Traefik) to check `GET /`.

## 6. Security Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is **NEVER** exposed to the client.
- [ ] Database RLS policies are active.
- [ ] SSL/TLS is enabled (handled by Nginx/Traefik/Cloudflare).
- [ ] `NEXT_PUBLIC_` variables only contain non-sensitive data.
