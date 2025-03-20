export const prompt = `
  # TASK
  User will provide a json object, you need to generate a key for each value, and use your experience to determine need to create a new key or use the existing key.

  # NOTE
  - How to determine the key name:
    - If user provide the keys, means the key is already exists, you need to use your experience to determine need to create a new key or use the existing key
    - When you create a new key, you need to determine by the filename, and the value, could be nested like this: "a.b.c", but don't be too more nested
    - Key name should be use english, and describe the value by english, if the value is a long sentence, you need to simplify the key, but user could understand the value.
    - Key name must be unique, and use camelCase format
    - Key names should be concise and meaningful, maximum 3-4 words combined
    - NEVER include variable names (like "variable1") in the key name itself
    - For sentences with variables, focus on the action or meaning in the key name
    - Keys must always have at least a parent and child structure like "a.b" or "a.b.c", never just a single level like "a"
  - IMPORTANT: DO NOT generate placeholder entries with generic variable names like "variable1", "variable2", etc.
  - Only generate keys for actual meaningful content provided by the user.
  - For text with variables (like "{name}"), preserve the exact variable format in the value but don't include variable names in the key.
  - Variables in the text should be preserved exactly as they appear in the original content.

  # EXAMPLES OF GOOD KEY NAMING
  - For "今天天氣真好, 我們一起去吃火鍋吧" → Use "weatherNiceEatHotpot" (NOT "todayWeatherIsGoodLetUsEatHotPot")
  - For "{name} 你今天有什麼計畫嗎, 我今天想要去吃火鍋, 你想要一起去嗎" → Use "askPlansHotpot" (NOT "nameWhatAreYourPlansForTodayIWantToEatHotPot")
  - For "{username} 好久沒有一起出去玩了" → Use "longTimeNoSee" (NOT "usernameLongTimeNoSee")

  # OUTPUT FORMAT RULES
  - Use the following format for each entry:
    ===key
    [key name]
    ===value
    [value]
    ===
  - Each entry should be separated by a newline
  - Do not add any additional formatting or indentation
  - Ensure the key and value are exactly as they should appear

  # EXAMPLE
  INPUT
  FilePath: ./pages/greeting.vue
  \`\`\`json
  [
    { value: 'greeting', keys: [ 'common.greeting' ] },
    { value: 'hello', keys: [ 'greeting.hello' ] },
    { value: 'world', keys: [ ] },
    { value: '你好 {name}，歡迎回來', keys: [ ] }
  ]
  \`\`\`


  OUTPUT
  ===key
  common.greeting
  ===value
  greeting
  ===

  ===key
  greeting.hello
  ===value
  hello
  ===

  ===key
  greeting.world
  ===value
  world
  ===

  ===key
  greeting.welcomeBack
  ===value
  你好 {name}，歡迎回來
  ===

  # WHAT NOT TO DO
  DO NOT generate entries like:
  ===key
  variable1
  ===value
  { variable1 }
  ===
`