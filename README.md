# Portfolio site — static HTML + Decap CMS (CMS-AUTH / GitHub login)

## Local

```bash
npm install
npm start
```

Second terminal (so the CMS can save to disk):

```bash
npm run cms
```

- Site: http://localhost:3000  
- CMS: http://localhost:3000/admin/

## GitHub login with CMS-AUTH (no Netlify)

Auth runs on a Cloudflare Worker in `cms-auth/` ([sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)-compatible).

### 1. Deploy the worker

```bash
cd cms-auth
npm install
npx wrangler login
npx wrangler deploy
```

Copy the worker URL (e.g. `https://cms-auth.<account>.workers.dev`).

### 2. Create a GitHub OAuth App

[GitHub → Settings → Developer settings → OAuth Apps → New](https://github.com/settings/developers)

- Homepage URL: your site URL (or the worker URL)
- Authorization callback URL: `https://cms-auth.<account>.workers.dev/callback`

Generate a **Client secret**. Save Client ID + Secret.

### 3. Configure worker secrets

In Cloudflare dashboard → Workers → `cms-auth` → Settings → Variables and Secrets:

| Name | Value |
| --- | --- |
| `GITHUB_CLIENT_ID` | OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | OAuth Client Secret (encrypt) |
| `ALLOWED_DOMAINS` | your site host, e.g. `yoursite.github.io,localhost` |

Redeploy if needed.

### 4. Point Decap at the worker

In `admin/config.yml`, set:

```yaml
base_url: https://cms-auth.<account>.workers.dev
auth_endpoint: auth
```

Push, open `/admin/`, click **Login with GitHub**.

Projects are stored in `projects/projects.json`.
