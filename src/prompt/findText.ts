export const prompt = `
Act as an expert Vue.js i18n internationalization specialist
You need to extract all text from the code, and replace any Vue template variables with standardized variable placeholders.


## IMPORTANT:
1. You must return your response in the following format:
2. You must extract all text from the code, and replace any Vue template variables with standardized variable placeholders.
3. Just only extra text, don't extra other things, and don't extra the text that is already using i18n functions, like t('text') or $t('text')
4. Don't be lazy, do your best to extract all texts.

## OUTPUT FORMAT
\`\`\`
===
text1 
===

===
text1 {variable1} text2
===
\`\`\`

## Extract TEXT IMPLEMENTATION
1. Identify and extract text from:
   - HTML element with text content
      \`\`\`
       <div>text1</div>
       <button>text1 text2</button>
       <template>text1 text2</template>
       <Dialog>text1 text2</Dialog>
      \`\`\`
   - HTML Attribute
      \`\`\`
      <div title="text1 text2">text1 text2</div>
      <input placeholder="text1 text2">text1 text2</input>
      <textarea placeholder="text1 text2">text1 text2</textarea>
      <Text label="text1 text2">text1 text2</Text>
      \`\`\`
   - Messages, console, alert in script section.
   \`\`\`
     console.log('text1 text2')
     console.error('text1 text2')
     alert('text1 text2')
     confirm('text1 text2')
     prompt('text1 text2')
     toast('text1 text2')
     dialog('text1 text2')
     message.success('text1 text2')
   \`\`\`

2. Pay attention to ALL message, notification and alert patterns:
   - Extract text from any function calls that display messages to users
   - This includes all UI notification libraries (like Message, Toast, Alert, Dialog, etc.)
   - Look for ALL variations of these components, regardless of case (e.g., message.error, Message.error, etc.)
   - Extract text from all notification method types (error, success, info, warning, etc.)
   - Examples include but are not limited to: Message.error(), Toast.show(), notification.open(), etc.

3. Text with variables:
   - For text containing variables:
     - Replace each variable with standardized placeholders: { variable1 }, { variable2 }, etc.
     - Reset variable numbering for each extracted text item:
     
     Example:
     \`\`\`
     hello { variable1 } good morning
     hello { variable1 } good afternoon
     \`\`\`

   - Variable handling rules:
   
     1. When variables appear at the beginning:
        \`\`\`
        <div>{{ variableName }} text1</div>
        \`\`\`
        Extract only the text part:
        \`\`\`
        ===
        text1
        ===
        \`\`\`
        
     2. When variables appear at the end:
        \`\`\`
        <div>text1 {{ variableName }}</div>
        \`\`\`
        Extract only the text part:
        \`\`\`
        ===
        text1
        ===
        \`\`\`
        
     3. When variables appear in the middle:
        \`\`\`
        <div>text1 {{ variableName }} text2</div>
        \`\`\`
        Replace with standardized variable placeholder:
        \`\`\`
        ===
        text1 { variable1 } text2
        ===
        \`\`\`


6. IMPORTANT: Do not extract text that is already internationalized. For example:
   \`\`\
   <div>{{ $t('label.submit') }}</div>
   <button>{{ t('button.cancel') }}</button>
   \`\`\`
   These are already using i18n functions and should not be extracted.
`