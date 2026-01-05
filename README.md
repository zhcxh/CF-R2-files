## 📁 R2 文件服务器

R2-files是一个在 Cloudflare Workers 上运行的无服务器应用程序,之前使用[cmliu/CF-Workers-TEXT2KV](https://github.com/cmliu/CF-Workers-TEXT2KV)，由于KV限制，所以想到R2存储桶 10G免费容量！

## 功能特性

- **文件存储**: 一行命令部署的在线网盘，支持上传、下载、直连、删除，全网页操作。
- **web前端**: 拖拽上传 + 文件列表 + 一键复制直连
- **安全访问控制**: Cloudflare Workers + R2 存储，自带 Token 鉴权，通过设置 token 参数,可以限制只有拥有正确密钥的请求才能访问您的文件。https://你的域名/?token=你的密钥 即可使用。
- **大小限制**: 单文件 ≤ 100MB，数量不限
- **辅助工具脚本**: 提供了 Windows 批处理文件脚本,用于方便地从本地上传文件到 R2。
- **👉 适用范围**: 仅适合个人自己文件存储使用！

## 使用说明

1. **创建 R2 存储**

在您的 Cloudflare 存储中选R2,创建一个新的 存储桶 记下名称,因为您需要将它绑定到 Workers 上。

2. **本地部署到 Cloudflare Workers**

   - 下载项目至本地 并修改wrangler.toml配置文件中的 AUTH_TOKEN = "xxxxxxxxxxx" # ← 你的 TOKEN,R2 存储桶名称 bucket_name = "my-r2-name"   # ← 你的 R2 桶名 就是你上面创建 R2 存储桶 的名称
   - 以管理员身份运行 CMD
   - npm i -g wrangler
   - wrangler login
   - cd 进项目目录
   - wrangler deploy

3. **通过 web 访问文件**

例如 您的workers项目域名为：`xxxxxx.workers.dev` , token值为 `ssssss` , 需要访问的文件名为 `a.pdf`；
  - 构造 URL 的格式为 `https://您的Workers域名/?token=您的TOKEN` 即 `https://xxxxxx.workers.dev/?token=ssssss`。您就可以在浏览器中查看文件了,建议绑定自己域名，墙内workers.dev不一定能连通。
  - 文件直连地址则为： `https://您的Workers域名/files/文件名?token=您的TOKEN` 即 `https://xxxxxx.workers.dev/files/a.pdf?token=ssssss`。

4. **使用辅助脚本上传文件**

  - Windows 用户可以在web页下载 `upload.bat` 脚本，然后拖动文件至 `upload.bat` 来上传本地文件到 R2。

5. **简单的更新文件内容**

  - 直接web或脚本bat上传,即可更新

通过这个无服务器应用,您可以方便地在 Cloudflare 的分布式网络上存储和管理文件,同时享受高性能和安全可靠的优势。欢迎使用 📁 R2 文件服务器!
