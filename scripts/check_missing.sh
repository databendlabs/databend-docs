#!/bin/bash

# Define English directory and Chinese directory.
en_dir="docs/en"
cn_dir="docs/cn"

# Create temporary files.
temp_md=$(mktemp)
temp_json=$(mktemp)

# Search for files that exist in the "en" directory but do not exist in the "cn" directory, and process them.
find "$en_dir" -type f \( -name "*.md" -o -name "*.json" \) -print0 | while IFS= read -r -d '' en_file; do
  # Get the path of en_file relative to en_dir.
  en_relative_path="${en_file#$en_dir/}"
  # Construct the corresponding cn_file path.
  cn_file="$cn_dir/$en_relative_path"

  # Check if the cn_file exists.
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

# Read temporary files into variables.
missing_md_files=$(cat "$temp_md")
missing_json_files=$(cat "$temp_json")

# Output results.
echo "Missing Markdown files:"
echo "$missing_md_files"
echo "Missing JSON files:"
echo "$missing_json_files"

# Clean up temporary files.
rm "$temp_md" "$temp_json"

