import { RuleTester } from "eslint";
import rule from "../max-params-plus";

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
});

const DEFAULT_MAX_PARAMS = 3;

ruleTester.run("max-params-plus", rule, {
  valid: [
    // 默认配置测试
    {
      code: "function foo(a, b, c) {}", // 刚好3个参数
    },
    {
      code: "const bar = (a, b) => {};", // 少于3个参数
    },
    // 自定义配置测试
    {
      code: "function foo(a, b, c, d) {}", // 4个参数但配置允许
      options: [{ maxParams: 4 }],
    },
    // 类方法测试
    {
      code: "class Test { method(a, b, c) {} }", // 类方法刚好3个参数
    },
    // 对象方法测试
    {
      code: "const obj = { method(a, b) {} }", // 对象方法少于3个参数
    },
    // 添加新的测试用例
    {
      code: "class Test { constructor() { this.notAFunction = 42; } }", // 使用构造函数替代类字段
    },
    {
      code: "const obj = { notAFunction: 42 }", // 对象的非方法属性
    },
    {
      code: "const obj = { prop: () => {} }", // 箭头函数属性
    },
  ],
  invalid: [
    // 默认配置测试（超过3个参数）
    {
      code: "function foo(a, b, c, d) {}",
      errors: [
        {
          messageId: "tooManyParams",
          data: {
            count: "4",
            limit: String(DEFAULT_MAX_PARAMS),
          },
        },
      ],
    },
    // 箭头函数测试
    {
      code: "const bar = (a, b, c, d) => {};",
      errors: [
        {
          messageId: "tooManyParams",
          data: {
            count: "4",
            limit: String(DEFAULT_MAX_PARAMS),
          },
        },
      ],
    },
    // 自定义配置测试
    {
      code: "function test(a, b, c, d, e) {}",
      options: [{ maxParams: 4 }],
      errors: [
        {
          messageId: "tooManyParams",
          data: {
            count: "5",
            limit: "4",
          },
        },
      ],
    },
    // 类方法测试
    {
      code: "class Test { method(a, b, c, d) {} }",
      errors: [
        {
          messageId: "tooManyParams",
          data: {
            count: "4",
            limit: String(DEFAULT_MAX_PARAMS),
          },
        },
      ],
    },
    // 对象方法测试
    {
      code: "const obj = { method(a, b, c, d) {} }",
      errors: [
        {
          messageId: "tooManyParams",
          data: {
            count: "4",
            limit: String(DEFAULT_MAX_PARAMS),
          },
        },
      ],
    },
    // 添加新的测试用例
    {
      code: "const obj = { method: function(a, b, c, d) {} }", // 函数表达式作为对象属性
      errors: [
        {
          messageId: "tooManyParams",
          data: {
            count: "4",
            limit: String(DEFAULT_MAX_PARAMS),
          },
        },
      ],
    },
    {
      code: "const obj = { prop: (a, b, c, d) => {} }", // 箭头函数作为对象属性
      errors: [
        {
          messageId: "tooManyParams",
          data: {
            count: "4",
            limit: String(DEFAULT_MAX_PARAMS),
          },
        },
      ],
    },
  ],
});
