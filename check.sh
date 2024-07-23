#!/bin/bash

# 定义英文目录和中文目录
en_dir="docs/en"
cn_dir="docs/cn"

# 函数：检查并删除目录，如果目录为空
remove_empty_dir() {
  local dir="$1"
  # 只处理 cn_dir 下的子目录
  if [[ "$dir" != "$cn_dir" ]] && [ -d "$dir" ] && [ -z "$(ls -A "$dir")" ]; then
    rmdir "$dir"
  fi
}

# 查找 cn 目录中存在，但 en 目录中不存在的文件，并删除
find "$cn_dir" -type f \( -name "*.md" -o -name "*.json" \) -print0 | while IFS= read -r -d '' cn_file; do
  # 获取 cn_file 相对于 cn_dir 的路径
  cn_relative_path="${cn_file#$cn_dir/}"
  # 构造对应的 en_file 路径
  en_file="$en_dir/$cn_relative_path"

  # 判断 en_file 是否存在
  if [ ! -e "$en_file" ]; then
    rm -rf "$cn_file"
  fi
done


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

# 输出结果
echo "Missing Markdown files:"
echo "$missing_md_files"
echo "Missing JSON files:"
echo "$missing_json_files"

# 清理临时文件
rm "$temp_md" "$temp_json"

