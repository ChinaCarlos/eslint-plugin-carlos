
# eslint-plugin-carlos-rules

一个教你如何创建自定义 ESLint 规则的指南项目，包含了从基础到进阶的完整教程。

## 安装

使用 npm 安装：

```bash
npm install eslint-plugin-carlos-rules --save-dev
```

或者使用 yarn 安装：

```bash
yarn add -D eslint-plugin-carlos-rules
```

或者使用 pnpm 安装：

```bash
pnpm add -D eslint-plugin-carlos-rules
```

## 使用

在你的 ESLint 配置文件中添加 `carlos-rules` 插件。

### .eslintrc.js 配置示例

```javascript
module.exports = {
  plugins: ['carlos-rules'],
  extends: [
    'plugin:carlos-rules/recommended'
  ],
  rules: {
    // 自定义规则配置
    'carlos-rules/max-params-plus': ['error', { maxParams: 3 }]
  }
};
```

## 规则

### max-params-plus

限制函数参数的最大数量。当函数参数数量超过设定值时，推荐使用对象作为参数。

#### 配置

- `maxParams`: 指定函数允许的最大参数数量（默认值为 3）

#### 示例

```javascript
// 错误示例
function foo(a, b, c, d) {}

// 正确示例
function foo({ a, b, c, d }) {}
```

## 开发

克隆项目并安装依赖：

```bash
git clone https://github.com/ChinaCarlos/eslint-plugin-carlos
cd eslint-plugin-carlos
pnpm install
```

运行测试：

```bash
pnpm test
```

构建项目：

```bash
pnpm build
```

## 贡献

欢迎提交问题和贡献代码！请确保在提交代码前运行所有测试并通过。

## 许可证

MIT

### 说明

- **安装**：提供了使用 npm、yarn 和 pnpm 安装插件的命令。
- **使用**：展示了如何在 ESLint 配置中使用插件和规则。
- **规则**：详细描述了 `max-params-plus` 规则的功能和配置。
- **开发**：提供了克隆、安装依赖、运行测试和构建项目的命令。
- **贡献**：鼓励用户提交问题和贡献代码。
- **许可证**：声明项目的许可证类型。

请根据实际项目需求和细节进行调整。
