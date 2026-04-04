
import xml.etree.ElementTree as ET
import os

xml_path = r'c:\my propjects\morph\temp_docx\word\document.xml'
output_path = r'c:\my propjects\morph\specification.txt'

if os.path.exists(xml_path):
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    # Namespaces
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    
    text_content = []
    for paragraph in root.findall('.//w:p', ns):
        text_parts = []
        for run in paragraph.findall('.//w:r', ns):
            t = run.find('w:t', ns)
            if t is not None and t.text:
                text_parts.append(t.text)
        if text_parts:
            text_content.append(" ".join(text_parts))
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(text_content))
    print(f"Extraction successful: {output_path}")
else:
    print(f"File not found: {xml_path}")
