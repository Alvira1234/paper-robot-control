# 手机远程控制接入

## Cloudflare Pages

1. 在 Cloudflare 创建 Pages 项目，连接本仓库。
2. 绑定一个 KV namespace，变量名必须是 `PAPER_ROBOT_STATE`。
3. 添加加密环境变量 `CONTROL_TOKEN`，使用至少 32 个 ASCII 字符。
4. 部署后，使用 Pages 项目的根地址作为 `CLOUD_API_BASE`。

Functions 会提供：

```text
GET  /api/status
POST /api/mode
POST /api/memo
GET  /api/device/poll
POST /api/device/report
```

## ESP32

`firmware/cloud.py` 自带精简 HTTPS 客户端（socket + TLS），不依赖 `urequests`，
把它和其他固件文件一起上传即可。在 `firmware/config.py` 填写 Wi-Fi、API 地址和同一个控制密钥：

```python
CLOUD_ENABLED = True
CLOUD_WIFI_SSID = "你的 Wi-Fi 名称"
CLOUD_WIFI_PASSWORD = "你的 Wi-Fi 密码"
CLOUD_API_BASE = "https://你的项目.pages.dev"
CLOUD_TOKEN = "与网页相同的随机密钥"
```

默认 `CLOUD_ENABLED = False`，因此不配置时仍保持原来的独立互动和 USB/ROS2 行为。

> 不要把真实 Wi-Fi 密码或控制密钥提交到 Git。
