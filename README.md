# sandbox-bundler

一个可以本地快速启动 demo 的工具

## 何时使用

- 想快速启动 demo
- 不想配置繁琐的 webpack
- 不想安装 babel，react 等依赖

## 安装

```
npm i sandbox-bundler -g
```

## 使用

默认使用 index.js 入口文件：

```
bundle react
```

指定当前目录下的 entry.js 为入口文件：

```
bundle react entry.js
```

## next action

- 添加对 ts、vue、css 的支持
- 尝试使用 bundleless 模式
