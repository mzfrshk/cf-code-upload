/**
 * ヾ(๑╹◡╹)ﾉ"
 *
 * Welcome to Cloudflare Workers!
 *
 * - Rename the `wrangler.example.toml` to `wrangler.toml` and populate the variables
 * - Run `pnpm run dev` in your terminal to start a development server
 * - Open a browser at `http://127.0.0.1:8787/` to see your worker in action
 * - Make HTTP requests to `/cdn-cgi/mf/scheduled` to trigger scheduled events
 *
 * Learn more at:
 * - https://developers.cloudflare.com/workers
 * - https://miniflare.dev
 * - https://honojs.dev
 */

import { Hono } from 'hono';

import { Bindings } from 'hono/types';
import { transformer, TransformerContext } from '@salla.sa/cf-utils';

const app = new Hono<{ Bindings: Bindings; Context: TransformerContext }>();

app.use('*', transformer(app));

app.get('/', async (context) => {
  const env = context.env as customBindings;
  console.log('env', env.EXAMPLE_ENVIRONMENT_VARIABLE);
  console.log('kv', await env.BINDING_NAME_1.get('key'));

  return context.jsonS('Hono!!', 200);
});

const cronTrigger = async (controller?: ScheduledController, env?: customBindings) => {
  console.log('env', env?.EXAMPLE_ENVIRONMENT_VARIABLE);
  console.log('kv', await env?.BINDING_NAME_2?.get('key'));
  console.log(controller?.scheduledTime);
  console.log('Doing something scheduled...');
};

export default {
  fetch: app.fetch,
  scheduled: cronTrigger
};
