#!/bin/bash
#
# Copyright (c) 2025 zhanghongping (zhanghongping@gmail.com)
#
# 基础使用示例
# 演示 ShellSage 的基本功能

# 1. 初始化
source "$(dirname "$0")/../../src/main.sh"

# 2. 基本命令历史管理
echo "=== 命令历史管理示例 ==="

# 添加命令到历史
add_to_history "ls -la"
add_to_history "git status"
add_to_history "docker ps"

# 搜索历史
echo "搜索包含 'git' 的命令："
search_history "git"

# 3. 配置管理
echo -e "\n=== 配置管理示例 ==="

# 获取配置
echo "当前 AI 模型设置："
get_config "aiModel"

# 修改配置
echo "修改配置示例："
set_config "historySize" 2000
echo "新的历史大小：$(get_config historySize)"

# 4. AI 建议功能
echo -e "\n=== AI 建议功能示例 ==="

# 获取命令建议
echo "获取 'docker' 相关命令建议："
get_suggestions "docker"

# 5. 错误处理示例
echo -e "\n=== 错误处理示例 ==="

# 尝试无效操作
echo "尝试无效操作："
if ! set_config "invalid_key" "value"; then
    echo "错误处理正常工作"
fi

# 6. 日志示例
echo -e "\n=== 日志功能示例 ==="

# 记录不同级别的日志
log_message "这是一条信息日志" "INFO"
log_message "这是一条警告日志" "WARNING"
log_message "这是一条错误日志" "ERROR"

echo -e "\n示例运行完成！"
