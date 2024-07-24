#!/bin/bash

# 定义英文目录和中文目录
en_dir="docs/en"
cn_dir="docs/cn"

# 读取排除列表到数组
mapfile -t exclusions < sync_exclusions.txt

# 函数：检查路径是否被排除
is_excluded() {
    local path="$1"
    for exclude in "${exclusions[@]}"; do
        # 匹配完整路径或子路径
        if [[ "$path" == "$exclude"* ]]; then
            return 0  # 路径被排除
        fi
    done
    return 1  # 路径不被排除
}

# 函数：检查并删除目录，如果目录为空
remove_empty_dir() {
    local dir="$1"
    # 只处理 cn_dir 下的子目录
    if [[ "$dir" != "$cn_dir" ]] && [ -d "$dir" ] && [ -z "$(ls -A "$dir")" ] && ! is_excluded "$dir"; then
        rmdir "$dir"
        echo "Removed empty directory: $dir"
    fi
}

# 查找 cn 目录中存在，但 en 目录中不存在的文件，并删除
find "$cn_dir" -type f \( -name "*.md" -o -name "*.json" \) -print0 | while IFS= read -r -d '' cn_file; do
    # 获取 cn_file 相对于 cn_dir 的路径
    cn_relative_path="${cn_file#$cn_dir/}"
    # 构造对应的 en_file 路径
    en_file="$en_dir/$cn_relative_path"

    # 判断 en_file 是否存在，且 cn_file 不在排除列表中
    if [ ! -e "$en_file" ] && ! is_excluded "$cn_file"; then
        rm -rf "$cn_file"
        echo "Removed file: $cn_file"
    fi
done

# 删除空目录
find "$cn_dir" -type d -empty -print0 | while IFS= read -r -d '' dir; do
    remove_empty_dir "${dir}"
done