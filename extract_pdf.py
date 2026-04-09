import fitz
import sys

doc = fitz.open("c:\\my propjects\\morph\\public\\2041 (Autosaved).xlsx - Civl Costing Final.pdf")
text = ""
for page in doc:
    text += page.get_text("text")

with open("c:\\my propjects\\morph\\temp_pdf.txt", "w", encoding="utf-8") as f:
    f.write(text)
print("Finished")
