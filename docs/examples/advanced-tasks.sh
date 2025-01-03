#!/bin/bash
#
# Copyright (c) 2025 zhanghongping (zhanghongping@gmail.com)
#
# 高级功能示例
# 演示 ShellSage 的高级特性

# 1. 初始化
source "$(dirname "$0")/../../src/main.sh"

# 2. 高级配置管理
echo "=== 高级配置管理示例 ==="

# 自定义配置文件
CONFIG_FILE="./custom_config.json"

# 创建自定义配置
cat > "$CONFIG_FILE" << EOF
{
    "historySize": 5000,
    "suggestionDelay": 0.3,
    "aiModel": "custom",
    "customSettings": {
        "maxSuggestions": 10,
        "filterLevel": "strict"
    }
}
EOF

# 加载自定义配置
load_config "$CONFIG_FILE"

# 3. 高级命令历史分析
echo -e "\n=== 高级命令历史分析 ==="

# 添加一些测试命令
add_to_history "find . -type f -name '*.log'"
add_to_history "grep 'ERROR' /var/log/syslog"
add_to_history "tail -f /var/log/application.log"
add_to_history "awk '/ERROR/ {print $0}' error.log"

# 分析命令模式
echo "分析日志相关命令："
analyze_command_patterns "log"

# 4. 自定义 AI 集成
echo -e "\n=== 自定义 AI 集成示例 ==="

# 设置自定义 AI 模型
set_config "aiModel" "custom"
set_config "customAiEndpoint" "http://localhost:8080/api/suggest"

# 获取高级建议
echo "获取高级命令建议："
get_advanced_suggestions "optimize docker container performance" "detailed"

# 5. 批处理示例
echo -e "\n=== 批处理示例 ==="

# 创建批处理任务
cat > batch_tasks.txt << EOF
find /var/log -type f -name "*.log"
grep "ERROR" *.log
sort | uniq -c
EOF

# 执行批处理
echo "执行批处理任务："
process_batch_file "batch_tasks.txt"

# 6. 性能监控示例
echo -e "\n=== 性能监控示例 ==="

# 启动性能监控
start_performance_monitoring

# 执行一些操作
for i in {1..5}; do
    get_suggestions "complex command $i"
    sleep 1
done

# 停止性能监控并显示报告
stop_performance_monitoring
show_performance_report

# 7. 清理
echo -e "\n=== 清理临时文件 ==="
rm -f "$CONFIG_FILE" batch_tasks.txt

echo -e "\n高级示例运行完成！"
