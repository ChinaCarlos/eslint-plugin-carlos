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
    fixable: "code",
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
      tooManyParamsNoFix: "当函数参数数量超过{{limit}}个时，推荐使用对象作为参数。由于存在复杂参数结构，请手动修复",
    },
  },

  create(context: Rule.RuleContext) {
    const options: RuleOptions = context.options[0] || {};
    const maxParams = options.maxParams || DEFAULT_MAX_PARAMS;
    const sourceCode = context.getSourceCode();
    const processedNodes = new Set();

    function hasComplexParams(params: Pattern[]): boolean {
      return params.some(
        param =>
          param.type === "ObjectPattern" ||
          param.type === "ArrayPattern" ||
          (param.type === "AssignmentPattern" &&
            (param.left.type === "ObjectPattern" || param.left.type === "ArrayPattern")),
      );
    }

    function getParamText(param: Pattern): string {
      if (param.type === "AssignmentPattern") {
        const left = param.left;
        const right = sourceCode.getText(param.right);

        if (left.type === "Identifier") {
          return `${left.name} = ${right}`;
        }
      }
      return sourceCode.getText(param);
    }

    function checkFunctionParams(node: FunctionLike) {
      if (processedNodes.has(node)) {
        return;
      }
      processedNodes.add(node);

      if (node.params.length > maxParams) {
        const hasComplex = hasComplexParams(node.params);

        context.report({
          node,
          messageId: hasComplex ? "tooManyParamsNoFix" : "tooManyParams",
          data: {
            count: node.params.length.toString(),
            limit: maxParams.toString(),
          },
          fix: hasComplex
            ? null
            : fixer => {
                const paramsText = node.params.map(param => getParamText(param));
                const newParam = `{ ${paramsText.join(", ")} }`;
                return fixer.replaceTextRange(
                  [node.params[0].range![0], node.params[node.params.length - 1].range![1]],
                  newParam,
                );
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
