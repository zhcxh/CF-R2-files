📁 R2 文件服务器
是根据[cmliu/CF-Workers-TEXT2KV](https://github.com/cmliu/CF-Workers-TEXT2KV)编写得，由于有65行限制，所以想到R2存储桶 10G免费容量！
此项目，带 Token 认证，支持上传/下载/删除 ，仅适合个人自己文件存储使用！

📁 R2 文件服务器（带 Token）
一行命令部署的在线网盘，支持上传、下载、直连、删除，全网页操作。
前端：拖拽上传 + 文件列表 + 一键复制直连
后端：Cloudflare Workers + R2 存储，自带 Token 鉴权
大小：单文件 ≤ 100MB，数量不限
👉 访问 https://你的域名/?token=你的密钥 即可使用。
