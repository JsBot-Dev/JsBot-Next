## JsBot
### 简介 
基于 @SnowLuma/SDK 实现的 QQBot 框架。
### 部署
#### pm2 部署
- 拉取源代码

```bash
git clone https://github.com/JsBot-Dev/JsBot-Next
```

- 填写配置

```bash
cp ./bot.config.example.json ./bot.config.json
nano ./bot.config.json # 或 vim ./bot.config.json
```

- 拉取依赖

```bash
npm install
```

- 启动

```bash
pm2 start ecosystem.config.cjs
```

#### Docker 部署
待补充。