export const prompt = `
# Task
You task is extra the text of code, the text use chinese. And If the text is every long, and also include the variable it also need to be extra.

## Output Format
1. Use the === to split the text, and the text is the key, and the variable is the value.
\`\`\`
===
text
===

===
text2
===

===
text3
===
\`\`\`

## NOTE:
1. All chinese text need to be extra, include the text in the template and script, also include the text in the console.log, alert, and message and html attribute. When extracting text, try to include complete sentences and context.
2. Variable is in the format of { variable1 }, { variable2 }, etc. Each text's variables should be numbered starting from 1, independent of other texts.
3. When extracting text, make sure to capture the full meaning by including surrounding context and complete sentences.
4. For each text with variables, the variable numbering should restart from 1, regardless of how many variables were used in previous texts.
5. IMPORTANT: Do not accumulate variable numbers across different texts. For example, if you have multiple texts, each text should have its own variable1, variable2, etc., and not continue counting from the previous text.
6. Incorrect example: 
   - Text 1: "欢迎来到{ variable1 }的官方网站"
   - Text 2: "今天是{ variable2 }，感谢您的访问"
7. Correct example:
   - Text 1: "欢迎来到{ variable1 }的官方网站"
   - Text 2: "今天是{ variable1 }，感谢您的访问"


## Example
* User Input
\`\`\`vue
<template>
  <div>
    <div>
      今天天氣很好
    </div>
    <div>
      {{ name }} 的生日是 {{ date }}
    </div>
  </div>
</template>
\`\`\`

* Output
\`\`\`
===
今天天氣很好
===

===
{ variable1 } 的生日是 { variable2 }
===
\`\`\`

`
