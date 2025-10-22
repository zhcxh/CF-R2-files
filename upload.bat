@echo off
:: 修正控制台中文乱码
chcp 65001 > nul

:: ==================  R2 一键上传  ==================
:: 拖文件到图标即可上传
:: 支持中文/空格路径

setlocal enabledelayedexpansion

:: 1. 拖进来的文件
set "FILE=%~1"
if "%FILE%"=="" (
    echo 用法：直接把文件拖到本图标上
    pause & exit /b 1
)
if not exist "%FILE%" (
    echo 文件不存在：%FILE%
    pause & exit /b 1
)

:: 2. 上传（地址 & token 下面自己填写，注意 token 要和 wrangler.toml 一致）
echo 正在上传：%~nx1 ...
curl -X POST -F "file=@\"%FILE%\"" "https://你的域名/upload?token=xxxxxx" 

:: 3. 停住看结果
echo.
echo 上传完成！
pause