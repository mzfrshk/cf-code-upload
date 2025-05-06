# Worker Backend Starter-Kit

This is a minimal starter for building a new Cloudflare Workers project that uses TypeScript, Hono, Miniflare, esbuild, and Vitest. Use this boilerplate to build your new best thing.

🔗 [Template Repo](https://github.com/SallaApp/cfworker-backend-starter)

## Quick Start

- Create a new repo from this template
- Add the new repo to Codacy
- Happy Coding 🚀

## How to use


1. Rename the `wrangler.example.toml` to `wrangler.toml` and populate the variables.
2. Run `pnpm run dev` in your terminal to start a development server.
3. Open a browser at `http://127.0.0.1:8787/` to see your worker in action.
4. Make HTTP requests to `/cdn-cgi/mf/scheduled` to trigger scheduled events.

## Learn more

* [Cloudflare Workers](https://developers.cloudflare.com/workers)
* [Miniflare](https://miniflare.dev)
* [Hono](https://honojs.dev)

## CLI

```cli
# Install dependencies
$ pnpm install

# Start local development server with live reload
$ pnpm run dev

# Start remote development server using wrangler
$ pnpm run dev:remote

# Run tests
$ pnpm run test

# Run coverage test report
$ pnpm run coverage

# Deploy using wrangler
$ pnpm run deploy
```

## CI/CD

After preparing & customizing `wrangler.toml`, make a copy of it named `wrangler.template.toml` which will be used in the CI/CD. Make sure not to keep any sensitive data in `wrangler.template.toml` as git will NOT ignore it.

### Basic Usage

```yaml
      - uses: SallaApp/.CI/worker-backend/build-deploy@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          cf_account_id: ${{ secrets.CF_ACCOUT_ID_SALLA_GROUP }}
          cf_api_token: ${{ secrets.CF_API_TOKEN }}
          secrets: |
            SOME_ENV_SECRET
```

### Using Sensitive Env Vars

If you want to use sensitive environment variables, you can pass them to the action in `.github/workflows/deploy.yaml`.


1. First, ask the DevOps team or the EM to add the secret to GitHub secrets.
2. Then add it to the env vars in the workflow.
3. Lastly, pass the name of the env var in the actions `secrets` parameter.
4. Optionally, you can pass KV namespaces in the action under `kv`. More details under “KV Namespaces” sections

> Don"t add the vars & secret in the wrangler.yaml file unless it"s static value all the time

The example below illustrates how to add `SOME_ENV_SECRET`:

```yaml
jobs:
  deploy:
    runs-on:
      group: default

    env:
      SOME_ENV_SECRET: ${{ secrets.SOME_ENV_SECRET }}

    steps:
      - uses: SallaApp/.CI/worker-backend/build-deploy@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          cf_account_id: ${{ secrets.CF_ACCOUT_ID_SALLA_GROUP }}
          cf_api_token: ${{ secrets.CF_API_TOKEN }}
          secrets: |
            TEST_ENV_SECRET
            TEST_ENV_SECRET_2
          # optionally
          kv: |
            BINDING_NAME_1
            BINDING_NAME_2
```


### KV Namespaces

* Just define the KV namespaces bindings name and the action will generate or bind their ids automatically

```javascript
      - uses: SallaApp/.CI/worker-backend/build-deploy@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          cf_account_id: ${{ secrets.CF_ACCOUT_ID_SALLA_GROUP }}
          cf_api_token: ${{ secrets.CF_API_TOKEN }}
          secrets: |
            TEST_ENV_SECRET
            TEST_ENV_SECRET_2
          # the new way for defining kv namespace bindings
          kv: |
            BINDING_NAME_1
            BINDING_NAME_2
```

* You need to update:
  * `bindings.d.ts` **for type safety:**

    ```typescript
    type Bindings = {
      BINDING_NAME_1: KVNamespace;
      BINDING_NAME_2: KVNamespace;
    };
    ```

  * `vitest.config.js` **for the tests:**

    ```typescript
    import { defineConfig } from "vitest/config";

    export default defineConfig({
      test: {
        environmentOptions: {
          kvNamespaces: ["BINDING_NAME_1", "BINDING_NAME_2"]
        }
      }
    });
    ```

  * `wrangler.template.toml` **for binding the created KVs to the worker:**\nYou need to add them in all environments with a placeholder in the `id` field as below:

    ```toml
    [env.prod]
    kv_namespaces = [
      { binding = "BINDING_NAME_1", id = "vars.BINDING_NAME_1" },
      { binding = "BINDING_NAME_2", id = "vars.BINDING_NAME_2" }
    ]

    [env.stage]
    kv_namespaces = [
      { binding = "BINDING_NAME_1", id = "vars.BINDING_NAME_1" },
      { binding = "BINDING_NAME_2", id = "vars.BINDING_NAME_2" }
    ]

    [env.dev]
    kv_namespaces = [
      { binding = "BINDING_NAME_1", id = "vars.BINDING_NAME_1" },
      { binding = "BINDING_NAME_2", id = "vars.BINDING_NAME_2" }
    ]
    ```


### GitHub Action Flow & Code

What the `.github/workflows/deploy.yaml` is doing is calling the action in [this file](https://github.com/SallaApp/.CI/blob/feature/OPS-000-migrate-to-actions/worker-backend/build-deploy/action.yaml).

The basic flow is:


1. It automatically detects the environment of the deployment (prod, stage, or dev\[PR\]).
2. It replaces the name of the project according to be `${ repo-name }-${ environment }`
3. It uses [Cloudflare Official Wrangler action](https://github.com/cloudflare/wrangler-action) under the hood.

You can open a PR in the [Actions Repo](https://github.com/SallaApp/.CI) if you have any suggestions, bug fixes, or enhancements to the action code. Or contact the DevOps team.

### Unit Tests

The tests will be run in the CI and the coverage reported will be uploaded automatically to Codacy.

More precisely, it will run the following steps:


1. `pnpm install`
2. `pnpm run lint`
3. `pnpm run typecheck`
4. `pnpm run build`
5. `pnpm run coverage`
6. Upload the coverage report generated by Vitess to Codacy.

**Basic Usage:**

```yaml
jobs:
  run_tests:
    name: Run Tests
    runs-on:
      group: default
    steps:
      - uses: SallaApp/.CI/worker-backend/test@master
        with:
          codacy_token: ${{ secrets.CODACY_API_TOKEN }}
          node_version: "18" # optional, default is 18
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## You Are Part of It

If you believe [this template](https://github.com/SallaApp/cfworker-backend-starter) could be enhanced, You can open a PR.
