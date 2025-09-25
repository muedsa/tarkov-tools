@echo off
setlocal enabledelayedexpansion

:: 设置要清理的目录，默认为当前目录
set "target_dir=../../public/tarkov/images/"

:: 检查参数，如果提供了目录参数则使用该目录
if not "%~1"=="" set "target_dir=%~1"

:: 验证目录是否存在
if not exist "%target_dir%\" (
    echo Error: Directory "%target_dir%" does not exist!
    exit /b 1
)

echo Cleaning zero-byte files in "%target_dir%" and its subdirectories...
echo.

:: 查找所有0字节文件并删除
for /r "%target_dir%" %%f in (*) do (
    if %%~zf equ 0 (
        echo Deleting: %%f
        del /f /q "%%f"
    )
)

echo.
echo Zero-byte file cleanup completed!
endlocal