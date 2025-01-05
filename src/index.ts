import enforceObjectParams from "./rules/max-params-plus";

export = {
  rules: {
    "enforce-object-params": enforceObjectParams,
  },
  configs: {
    // 推荐配置
    recommended: {
      plugins: ["@carlos/eslint-plugin-guide"],
      rules: {
        "@carlos/eslint-plugin-guide/enforce-object-params": "warn",
      },
    },
    // 所有规则
    all: {
      plugins: ["@carlos/eslint-plugin-guide"],
      rules: {
        "@carlos/eslint-plugin-guide/enforce-object-params": "warn",
        "@carlos/eslint-plugin-guide/no-function-apply": "error",
        "@carlos/eslint-plugin-guide/no-jsx-button": "warn",
      },
    },
  },
};
