import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      reporter: ["cobertura", "lcov"]
    },
    environment: "miniflare",
    environmentOptions: {
      bindings: { EXAMPLE_ENVIRONMENT_VARIABLE: "value" },
      kvNamespaces: ["BINDING_NAME_1", "BINDING_NAME_2"]
    }
  },
  resolve: {
    alias: {
      "~": "/src"
    }
  }
});
