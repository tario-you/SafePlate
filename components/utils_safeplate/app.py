apikey_harrison = 'AIzaSyDmbi6wrtLTm9svCjE6nmZ3NALF8msGS_s'
apikey_me = 'AIzaSyBh5UKEZMSYFtr0C-IWHFYIJEN5-aqJMrg'

import pathlib
import textwrap

import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown


def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

genai.configure(api_key=apikey_me)

for m in genai.list_models():
  if 'generateContent' in m.supported_generation_methods:
    print(m.name)