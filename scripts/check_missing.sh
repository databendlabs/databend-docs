#!/bin/bash

# 定义英文目录和中文目录
en_dir="docs/en"
cn_dir="docs/cn"

# 创建临时文件
temp_md=$(mktemp)
temp_json=$(mktemp)

# 查找 en 目录中存在，但 cn 目录中不存在的文件，并进行处理
find "$en_dir" -type f \( -name "*.md" -o -name "*.json" \) -print0 | while IFS= read -r -d '' en_file; do
  # 获取 en_file 相对于 en_dir 的路径
  en_relative_path="${en_file#$en_dir/}"
  # 构造对应的 cn_file 路径
  cn_file="$cn_dir/$en_relative_path"

  # 判断 cn_file 是否存在
  if [ ! -e "$cn_file" ]; then
    case "$en_relative_path" in
      *.md)
        echo "./$en_dir/$en_relative_path" >> "$temp_md"
        ;;
      *.json)
        echo "./$en_dir/$en_relative_path" >> "$temp_json"
        ;;
    esac
  fi
done

# 删除空目录
find "$cn_dir" -type d -empty -print0 | while IFS= read -r -d '' dir; do
  remove_empty_dir "${dir}"
done

# 读取临时文件到变量
missing_md_files=$(cat "$temp_md")
missing_json_files=$(cat "$temp_json")

# 清理临时文件
rm "$temp_md" "$temp_json"

