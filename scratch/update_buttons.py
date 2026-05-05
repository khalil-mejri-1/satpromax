
import sys

filepath = r"c:\Users\khalil\Desktop\khalil\project_react\technoplus\client\src\pages\admin.jsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def update_button(lines, search_text, replacement):
    new_lines = []
    for line in lines:
        if search_text in line and '<button' in line and 'Ajouter' in line:
            # This is a bit too specific, let's try just searching for the unique style part
            pass
    # Let's try a simpler approach: find the lines by their content regardless of exact whitespace
    return lines

# I'll just do it manually in the script for the specific lines I know
# Line 4133 approx (0-indexed 4132)
# 4133:                         <button type="submit" className="btn btn-primary" style={{ height: '42px', borderRadius: '8px', padding: '0 20px' }} >
# 4134:                             Ajouter
# 4135:                         </button>

import re

content = "".join(lines)

# Resolution
content = re.sub(
    r'(<button type="submit" className="btn btn-primary" style=\{\{ height: \'42px\', borderRadius: \'8px\', padding: \'0 20px\' \}\} >\s+)Ajouter(\s+</button>)',
    r'\1{submitting ? (<div className="admin-loader-sm" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>) : null} Ajouter\2',
    content
)

# And add disabled={submitting} and flex style
content = content.replace(
    'style={{ height: \'42px\', borderRadius: \'8px\', padding: \'0 20px\' }}',
    'disabled={submitting} style={{ height: \'42px\', borderRadius: \'8px\', padding: \'0 20px\', display: \'flex\', alignItems: \'center\', gap: \'8px\' }}'
)

# Regions
content = content.replace(
    'style={{ height: \'42px\', borderRadius: \'8px\', padding: \'0 20px\' }}',
    'disabled={submitting} style={{ height: \'42px\', borderRadius: \'8px\', padding: \'0 20px\', display: \'flex\', alignItems: \'center\', gap: \'8px\' }}'
)
# Wait, replace() replaces all occurrences. That's good if they are identical.

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
