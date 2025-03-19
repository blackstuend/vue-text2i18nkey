export const prompt = `
# Task
Your task is to extract Chinese text from Vue 3 code files (including Composition API). 
Extract all Chinese text segments and replace any Vue template variables with standardized variable placeholders.

## Output Format
Use === to separate each extracted text segment:
\`\`\`
===
text1
===

===
text2
===

===
text3
===
\`\`\`

## NOTE:
1. Only extract text containing Chinese characters. Text without any Chinese characters should be ignored.
2. Identify and extract Chinese text from:
   - Vue templates (inside <template> tags)
   - Script sections (inside <script setup> or regular <script> tags)
   - alerts, messages
   - HTML attributes
   - Comments

3. For Vue template variables:
   - Replace template expressions like {{ variableName }} with { variable1 }, { variable2 }, etc.
   - For example: "你好，{{ userName }}" becomes "你好，{ variable1 }"
   - And Every items's variable number should restart from 1.
     - Correct: 
      - Text 1: "欢迎来到{ variable1 }的官方网站"
      - Text 2: "今天是{ variable1 }，感谢您的访问"
    - Incorrect:
      - Text 1: "欢迎来到{ variable1 }的官方网站"
      - Text 2: "今天是{ variable2 }，感谢您的访问"

4. If text doesn't contain any Chinese characters, don't extract it.

5. If text only contains variables, don't extract it like this: {{ name }}, don't extract it.

## Examples

### Example 1: Basic Template
* Input
\`\`\`vue
<template>
  <div>
    <div>
      今天天氣很好
    </div>
    <div>
      {{ name }} 的生日是 {{ date }}
    </div>
    <div>
      No Chinese text here
    </div>
    <div>
      {{ standalone }}
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

### Example 2: Composition API
* Input
\`\`\`vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>您好，{{ user.name }}。您有{{ notifications }}条未读消息。</p>
    <p>更新时间：{{ lastUpdated ? dayjs(lastUpdated).format('YYYY-MM-DD hh:mm') : '' }}</p>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const title = ref('我的应用')
const user = reactive({
  name: '张三',
  role: 'admin'
})
const notifications = ref(5)
const lastUpdated = ref(new Date())

console.log('用户已登录')
</script>
\`\`\`

* Output
\`\`\`
===
您好，{ variable1 }。您有{ variable2 }条未读消息。
===

===
更新时间：{ variable1 }
===

===
我的应用
===

===
用户已登录
===
\`\`\`

### Example 3: Multiple Segments with Similar Variables
* Input
\`\`\`vue
<template>
  <div>
    <div>{{ username }}的回复：{{ message }}</div>
    <div>管理员回复：{{ adminResponse }}</div>
    <div>{{ dayjs(responseTime).format('YYYY-MM-DD') }}</div>
  </div>
</template>
\`\`\`

* Output
\`\`\`
===
{ variable1 }的回复：{ variable2 }
===

===
管理员回复：{ variable1 }
===
\`\`\`
`
