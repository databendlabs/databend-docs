"""
Fix relative links in index.md files that break when trailingSlash: false is enabled.

When trailingSlash is true:  /sql/sql-commands/dml/ + "dml-insert" = /sql/sql-commands/dml/dml-insert (correct)
When trailingSlash is false: /sql/sql-commands/dml  + "dml-insert" = /sql/sql-commands/dml-insert   (broken)

Fix: convert bare relative links like `dml-insert` or `./python` to `./dml/dml-insert` or `./drivers/python`
by prepending the current directory name.
"""
import re
import os

def fix_index_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Get the directory name that this index.md represents
    dir_name = os.path.basename(os.path.dirname(filepath))
    # Strip numeric prefix like "01-load" -> need the slug used in permalink
    # But we don't need the dir_name for the fix - we just need to make relative links
    # point into the current directory by prefixing with ./

    # Match markdown links with bare relative paths (no leading / or http)
    # Pattern: [text](relative-path) or [text](./relative-path)
    # We need to convert:
    #   [text](foo)           -> [text](./foo)  won't help, same resolution
    #   [text](./foo)         -> same issue
    # The real fix: since this is an index.md, relative links should use ./ prefix
    # But with trailingSlash:false, the page is /parent/current not /parent/current/
    # So ./foo resolves to /parent/foo instead of /parent/current/foo
    #
    # The correct fix is to use the directory-relative path explicitly.
    # For an index.md in directory "dml/", link "dml-insert" should become "dml/dml-insert"
    # or "./dml/dml-insert" when referenced from the parent perspective.
    #
    # Actually the simplest fix: bare links like "foo" or "./foo" in index.md
    # need to become "./current-dir-slug/foo" - but that changes the URL structure.
    #
    # Better approach: just don't use bare relative links. Use explicit paths.
    # But we don't know the full URL structure from the file system alone.
    #
    # Simplest correct fix: in each index.md, find all markdown links that are
    # bare relative (no leading /, no http, no #), and check if they point to
    # sibling files in the same directory. If so, keep them but ensure they work
    # by making the link relative to the directory.

    # Actually, the cleanest fix for Docusaurus with trailingSlash:false is:
    # In index.md files, bare relative links like [text](foo) should be [text](./foo)
    # But that still won't work because without trailing slash, ./foo resolves to parent/foo.
    #
    # The REAL fix: use slug-based relative paths. Since the index.md page permalink
    # is /parent/current, a link to a child "foo" needs to be "current/foo" not just "foo".

    # Let's extract the "slug" portion of the directory
    # e.g., "10-dml" -> slug is "dml" (Docusaurus strips numeric prefix)
    slug = re.sub(r'^\d+-', '', dir_name)

    changed = False
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        # Match markdown links: [text](link) but not [text](http...) or [text](/...) or [text](#...)
        def fix_link(m):
            nonlocal changed
            text = m.group(1)
            link = m.group(2)

            # Skip absolute, external, anchor-only, or already directory-prefixed links
            if link.startswith(('http', '/', '#', 'mailto:')):
                return m.group(0)

            # Strip leading ./ if present
            clean_link = link.lstrip('./')

            # Skip if it already contains the slug prefix (already fixed)
            if clean_link.startswith(slug + '/'):
                return m.group(0)

            # Skip links to files with extensions (like images)
            if '.' in clean_link.split('/')[-1].split('#')[0]:
                # Has a file extension, likely an image or explicit file reference
                # But .md links should be fixed too... skip only non-md extensions
                ext = clean_link.split('/')[-1].split('#')[0].rsplit('.', 1)[-1]
                if ext not in ('md', 'mdx'):
                    return m.group(0)

            # This is a bare relative link - prefix with slug/
            changed = True
            return f'[{text}]({slug}/{clean_link})'

        new_line = re.sub(r'\[([^\]]*)\]\(([^)]+)\)', fix_link, line)
        new_lines.append(new_line)

    if changed:
        new_content = '\n'.join(new_lines)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Fixed: {filepath}')

# All the index.md files that have broken links
source_files = [
    'docs/{lang}/developer/00-drivers/index.md',
    'docs/{lang}/guides/10-cloud/index.md',
    'docs/{lang}/guides/40-load-data/01-load/index.md',
    'docs/{lang}/guides/40-load-data/03-load-semistructured/index.md',
    'docs/{lang}/guides/20-self-hosted/index.md',
    'docs/{lang}/guides/20-self-hosted/00-editions/index.md',
    'docs/{lang}/sql-reference/10-sql-commands/10-dml/index.md',
    'docs/{lang}/sql-reference/10-sql-commands/40-explain-cmds/index.md',
    'docs/{lang}/sql-reference/10-sql-commands/30-query-operators/index.md',
    'docs/{lang}/sql-reference/10-sql-commands/20-query-syntax/index.md',
    'docs/{lang}/sql-reference/20-sql-functions/05-interval-functions/index.md',
    'docs/{lang}/sql-reference/20-sql-functions/10-search-functions/index.md',
    'docs/{lang}/sql-reference/20-sql-functions/10-semi-structured-functions/index.md',
    'docs/{lang}/sql-reference/20-sql-functions/10-semi-structured-functions/1-array/index.md',
    'docs/{lang}/sql-reference/20-sql-functions/10-semi-structured-functions/4-conversion/index.md',
    'docs/{lang}/sql-reference/20-sql-functions/10-semi-structured-functions/0-json/index.md',
    'docs/{lang}/sql-reference/20-sql-functions/10-semi-structured-functions/3-map/index.md',
    'docs/{lang}/sql-reference/20-sql-functions/10-semi-structured-functions/2-object/index.md',
    'docs/{lang}/sql-reference/20-sql-functions/10-semi-structured-functions/5-type-predicate/index.md',
    'docs/{lang}/sql-reference/20-sql-functions/18-sequence-functions/index.md',
    'docs/{lang}/sql-reference/20-sql-functions/19-test-functions/index.md',
    'docs/{lang}/sql-reference/00-sql-reference/30-table-engines/index.md',
]

for lang in ['en', 'cn']:
    for template in source_files:
        filepath = template.replace('{lang}', lang)
        if os.path.exists(filepath):
            fix_index_file(filepath)
