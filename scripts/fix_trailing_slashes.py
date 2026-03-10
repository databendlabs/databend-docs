import os
import re

PREFIXES = ['/guides/', '/sql/', '/developer/', '/tutorials/', '/integrations/', '/release-notes/', '/dev/']

def fix_trailing_slashes(directory):
    prefix_pattern = '|'.join(re.escape(p) for p in PREFIXES)
    pattern = re.compile(r'(\[.*?\])\(((?:' + prefix_pattern + r').*?)/\)')
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = pattern.sub(lambda m: f"{m.group(1)}({m.group(2)})", content)
                    
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Fixed links in: {filepath}")
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    fix_trailing_slashes('./docs')
