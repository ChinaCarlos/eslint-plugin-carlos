import { RuleTester } from "eslint";
import rule from "../../rules/max-params-plus";

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
});

ruleTester.run("enforce-object-params", rule, {
  valid: [
    // 基本场景 - 参数数量在限制内
    "function test(a, b, c) {}",
    "function test(a, b, c) {}",
    "function test(a, b) {}",
    "function test(a) {}",
    "function test() {}",

    // 箭头函数
    "const test = (a, b, c) => {}",
    "const test = (a, b) => {}",
    "const test = a => {}",
    "const test = () => {}",

    // 类方法
    `
      class Test {
        method(a, b, c) {}
      }
    `,

    // 自定义最大参数数量
    {
      code: "function test(a, b, c, d) {}",
      options: [{ maxParams: 4 }],
    },

    // 简单的对象参数
    "function test({ name, age, city }) {}",
    "const test = ({ name, age, city }) => {}",
  ],

  invalid: [
    // 基本函数测试
    {
      code: "function test(name, age, city, country) {}",
      errors: [
        {
          messageId: "tooManyParams",
          data: { count: 4, limit: 3 },
        },
      ],
      output: "function test({ name, age, city, country }) {}",
    },

    // 箭头函数测试
    {
      code: "const test = (name, age, city, country) => {}",
      errors: [
        {
          messageId: "tooManyParams",
          data: { count: 4, limit: 3 },
        },
      ],
      output: "const test = ({ name, age, city, country }) => {}",
    },

    // 带默认值的参数测试
    {
      code: "function test(name, age = 18, city = 'NY', country = 'USA') {}",
      errors: [
        {
          messageId: "tooManyParams",
          data: { count: 4, limit: 3 },
        },
      ],
      output: "function test({ name, age = 18, city = 'NY', country = 'USA' }) {}",
    },

    // 类方法测试
    {
      code: `
        class Test {
          method(name, age, city, country) {}
        }
      `,
      errors: [
        {
          messageId: "tooManyParams",
          data: { count: 4, limit: 3 },
        },
      ],
      output: `
        class Test {
          method({ name, age, city, country }) {}
        }
      `,
    },

    // 测试对象属性中的箭头函数
    {
      code: `
        const obj = {
          test: (name, age, city, country) => {}
        }
      `,
      errors: [
        {
          messageId: "tooManyParams",
          data: {
            count: "4",
            limit: "3",
          },
        },
      ],
      output: `
        const obj = {
          test: ({ name, age, city, country }) => {}
        }
      `,
    },

    // 测试复杂参数结构（不提供自动修复）
    {
      code: `
        function test({ x }, [y], z, w) {}
      `,
      errors: [
        {
          messageId: "tooManyParamsNoFix",
          data: {
            count: "4",
            limit: "3",
          },
        },
      ],
    },

    // 测试对象解构参数
    {
      code: `
        function test({ x }, { y }, { z }, { w }) {}
      `,
      errors: [
        {
          messageId: "tooManyParamsNoFix",
          data: {
            count: "4",
            limit: "3",
          },
        },
      ],
    },

    // 测试数组解构参数
    {
      code: `
        function test([a], [b], [c], [d]) {}
      `,
      errors: [
        {
          messageId: "tooManyParamsNoFix",
          data: {
            count: "4",
            limit: "3",
          },
        },
      ],
    },

    // 测试带默认值的解构参数
    {
      code: `
        function test({ x } = {}, [y] = [], z = 1, w) {}
      `,
      errors: [
        {
          messageId: "tooManyParamsNoFix",
          data: {
            count: "4",
            limit: "3",
          },
        },
      ],
    },

    // 测试混合解构和普通参数
    {
      code: `
        const test = ({ a }, [b], { c } = {}, d) => {}
      `,
      errors: [
        {
          messageId: "tooManyParamsNoFix",
          data: {
            count: "4",
            limit: "3",
          },
        },
      ],
    },

    // 测试类方法中的复杂参数
    {
      code: `
        class Test {
          method({ x }, [y], { z = 1 }, w) {}
        }
      `,
      errors: [
        {
          messageId: "tooManyParamsNoFix",
          data: {
            count: "4",
            limit: "3",
          },
        },
      ],
    },

    // 测试对象方法中的复杂参数
    {
      code: `
        const obj = {
          test: ({ a }, [b], { c } = {}, d) => {}
        }
      `,
      errors: [
        {
          messageId: "tooManyParamsNoFix",
          data: {
            count: "4",
            limit: "3",
          },
        },
      ],
    },
  ],
});
