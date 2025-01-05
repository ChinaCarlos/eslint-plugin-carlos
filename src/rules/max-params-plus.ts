import { Rule } from "eslint";
import { FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, Pattern } from "estree";

type FunctionLike = FunctionDeclaration | FunctionExpression | ArrowFunctionExpression;

interface RuleOptions {
  maxParams?: number;
}

const DEFAULT_MAX_PARAMS = 3;

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "强制使用对象作为参数，当函数参数数量超过设定值时",
      category: "Best Practices",
      recommended: false,
    },
    schema: [
      {
        type: "object",
        properties: {
          maxParams: {
            type: "number",
            minimum: DEFAULT_MAX_PARAMS,
          },
        },
        additionalProperties: true,
      },
    ],
    messages: {
      tooManyParams: "当函数参数数量超过{{limit}}个时，推荐使用对象作为参数（当前参数数量：{{count}}个）",
    },
  },

  create(context: Rule.RuleContext) {
    const options: RuleOptions = context.options[0] || {};
    const maxParams = options.maxParams || DEFAULT_MAX_PARAMS;
    const processedNodes = new Set();

    function checkFunctionParams(node: FunctionLike) {
      if (processedNodes.has(node)) {
        return;
      }
      processedNodes.add(node);

      if (node.params.length > maxParams) {
        context.report({
          node,
          messageId: "tooManyParams",
          data: {
            count: node.params.length.toString(),
            limit: maxParams.toString(),
          },
        });
      }
    }

    return {
      FunctionDeclaration: checkFunctionParams,
      FunctionExpression: checkFunctionParams,
      ArrowFunctionExpression: checkFunctionParams,
      MethodDefinition(node) {
        if (node.value.type === "FunctionExpression") {
          checkFunctionParams(node.value);
        }
      },
      Property(node) {
        if (node.value.type === "FunctionExpression" || node.value.type === "ArrowFunctionExpression") {
          checkFunctionParams(node.value);
        }
      },
    };
  },
};

export default rule;
