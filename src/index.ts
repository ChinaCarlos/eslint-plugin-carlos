import maxParamsPlus from "./rules/max-params-plus";

export = {
  // 所有规则配置
  rules: {
    "max-params-plus": maxParamsPlus,
  },
  // 预设配置
  configs: {
    // 推荐配置
    recommended: {
      plugins: ["carlos-rules"],
      rules: {
        "carlos-rules/max-params-plus": ["error", { max: 3 }],
      },
    },
    // 所有规则
    all: {
      plugins: ["carlos-rules"],
      rules: {
        "carlos-rules/max-params-plus": ["error", { max: 3 }],
      },
    },
  },
};
