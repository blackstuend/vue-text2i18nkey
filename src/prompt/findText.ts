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
   - DO NOT extract text from comments
   - DO NOT extract text from i18n functions like t(), $t(), i18n.t(), etc.
     - Examples of i18n calls to ignore: {{ $t('message.allMessages') }}, {{ t('welcome') }}, etc.
     - Any text inside quotes in an i18n function call should not be extracted

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

6. Specifically, DO NOT extract template expressions like {{ $t('message.allMessages') }} as these
   are i18n translation calls - even if they contain Chinese labels like 'allMessages'.

7. Make sure to ignore tab labels or other UI elements that use $t() or other i18n methods.

8. Make sure the extracted text exists in the user provided code.

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
    <!-- 這是中文註解，不需提取 -->
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
// 這是中文註解，不需提取
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

### Example 4: i18n Already Applied (Do Not Extract)
* Input
\`\`\`vue
<template>
  <div>
    <h1>{{ $t('welcome') }}</h1>
    <p>{{ $t('greeting', { name: user.name }) }}</p>
    <div>{{ $t('notifications', { count: notifications }) }}</div>
    <div>{{ $t('farewell') }}</div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t, i18n } = useI18n()

const welcomeMessage = t('welcome_back')

Message.success(welcomeMessage)
</script>
\`\`\`

* Output
\`\`\`

\`\`\`
`
