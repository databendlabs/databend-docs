#!/bin/bash

# Define English directory and Chinese directory.
en_dir="docs/en"
cn_dir="docs/cn"

# Read the exclusion list into an array.
mapfile -t exclusions < sync_exclusions.txt

# Check if the path is excluded.
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

# Check and delete the directory if it is empty.
remove_empty_dir() {
    local dir="$1"
    # 只处理 cn_dir 下的子目录
    if [[ "$dir" != "$cn_dir" ]] && [ -d "$dir" ] && [ -z "$(ls -A "$dir")" ] && ! is_excluded "$dir"; then
        rmdir "$dir"
        echo "Removed empty directory: $dir"
    fi
}

# Search for files that exist in the cn directory but do not exist in the en directory, and delete them.
find "$cn_dir" -type f \( -name "*.md" -o -name "*.json" \) -print0 | while IFS= read -r -d '' cn_file; do
    # Get the path of cn_file relative to cn_dir.
    cn_relative_path="${cn_file#$cn_dir/}"
    # Construct the corresponding en_file path.
    en_file="$en_dir/$cn_relative_path"

    # Check if en_file exists and cn_file is not in the exclusion list.
    if [ ! -e "$en_file" ] && ! is_excluded "$cn_file"; then
        rm -rf "$cn_file"
        echo "Removed file: $cn_file"
    fi
done

# Delete empty directories.
find "$cn_dir" -type d -empty -print0 | while IFS= read -r -d '' dir; do
    remove_empty_dir "${dir}"
done