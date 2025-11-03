# GitHub Actions Workflows

## Vercel Deployment

This workflow automatically deploys the Oak Network documentation to Vercel when code is pushed to the `main` branch.

### Setup Instructions

To enable automatic deployments, you need to add the following secrets to your GitHub repository:

1. Go to your GitHub repository: `https://github.com/oaknetwork/docs/settings/secrets/actions`
2. Click "New repository secret" and add the following three secrets:

   **Secret 1**: `VERCEL_TOKEN`
   - **Value**: Your Vercel authentication token
   - **How to get**: Go to https://vercel.com/account/tokens
   - Create a new token or use an existing one
   - Copy the token and paste it as the secret value

   **Secret 2**: `VERCEL_ORG_ID`
   - **Value**: `team_WfYtI5PAjKfkXLe5d9zqJHdZ`
   - This is your Vercel organization ID (ccp-rotocol)

   **Secret 3**: `VERCEL_PROJECT_ID`
   - **Value**: `prj_CHrLy7KZXhjZt3flCt9jYXVLphKb`
   - This is your Vercel project ID (docs project)

### How It Works

- **Trigger**: Automatically runs on push to `main` branch
- **Path Filter**: Only runs if files in `oaknetwork/` directory are changed
- **Process**:
  1. Checks out the code
  2. Sets up Node.js 20
  3. Installs dependencies
  4. Builds the Docusaurus site
  5. Deploys to Vercel production

### Required Secrets

The workflow requires the following GitHub secrets:
- `VERCEL_TOKEN`: Your Vercel authentication token (sensitive - keep private)
- `VERCEL_ORG_ID`: `team_XXY` (ccp-rotocol organization)
- `VERCEL_PROJECT_ID`: `prj_XXZ` (docs project)

**Note**: While `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are not sensitive, they're stored as secrets for maintainability and consistency with the workflow pattern.

### Manual Deployment

If you need to deploy manually, you can still run:

```bash
cd oaknetwork
npx vercel --prod
```

