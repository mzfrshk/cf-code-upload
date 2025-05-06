import { expect, test, describe, vi, afterAll } from 'vitest';
import worker from '../src';

declare global {
  function getMiniflareBindings(): customBindings;
}

const env = getMiniflareBindings();

// Mock the ScheduledController
const mockScheduledController = {
  scheduledTime: Date.now(),
  cron: "10min",
  noRetry: vi.fn(),
};

describe.concurrent('worker fetch events', () => {
  const fetchWorker = (target: string) => {
    return worker.fetch(new Request(target), env);
  };

  test('GET / is ok', async () => {
    const response = await fetchWorker('http://127.0.0.1:8787/');

    expect(response.status).toBe(200);
    expect(JSON.parse(await response.text())).toEqual({
      success: true,
      status: 200,
      data: { message: 'Hono!!' }
    });
  });

  test('GET /404 is not found', async () => {
    const response = await fetchWorker('http://127.0.0.1:8787/404');

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      success: false,
      status: 404,
      error: { message: 'Not Found!', code: 404 }
    });
  });
});

describe.concurrent('worker scheduled events', () => {
  const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  afterAll(() => {
    consoleMock.mockReset();
  });


  test('Scheduled event works as expected', async () => {
    const scheduledTime = mockScheduledController.scheduledTime;
    await worker.scheduled(mockScheduledController, env);
    expect(consoleMock).toHaveBeenCalledTimes(6)
    expect(console.log).toHaveBeenCalledWith('env', env.EXAMPLE_ENVIRONMENT_VARIABLE);
    expect(consoleMock).toHaveBeenCalledWith('Doing something scheduled...');
    expect(console.log).toHaveBeenCalledWith('kv', await env.BINDING_NAME_2.get('key'));
    expect(console.log).toHaveBeenCalledWith(scheduledTime);
  });
});
