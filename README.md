# vue-chinese2i18n
透過 AI 自動將 vue 中的中文轉換為 i18n 函數調用, 並自動更新 locale 檔案, 解決一些專案一開始未做 i18n 導致後續需要手動轉換浪費大量時間


## 使用須知
1. 透過 openrouter 的 API 進行轉換, 需要先申請 openrouter 的 API key
2. 由於 code 是 AI 生成的, 所以可能產出的會有些許錯誤, 建議一次轉換少許的文件, 確認沒有問題後再繼續
3. 只會轉換 vue 的檔案, 其他檔案不會支援, 而且目前只支援 vue3 composition api  (script setup) 的寫法, 當 script 裡面有文字需要轉換會使用 useI18n 的函數


## 前置需求

- Node.js (v16.14.0 or higher)
- OpenRouter API key
- Locale file (e.g. zh-CN.json), 如果裡面是空的請先設定一個空的物件

## 使用方式

```bash
npx vue-chinese2i18n [options]

Options:
  --file <path>          處理單一 Vue 文件。如果未提供且設置了 --nested，
                         將處理所有子目錄中的 Vue 文件
  --use-diff <bool>      使用差異格式進行更改（默認：true）
                         AI 響應僅發送差異代碼以減少令牌消耗
                         如果設置為 false，將返回完整代碼
  --nested               處理目錄中的所有 Vue 文件（默認：false）
  --with-cache <bool>    使用緩存跳過已處理的文件, 會將成功處理與失敗的文件記錄在 .vue-chinese2i18n.json 中（默認：true）
```

### 環境變量

在執行工具之前, 請先設置以下環境變量:

- `OPEN_ROUTER_API_KEY`: 你的 OpenRouter API key 用於 AI 服務
- `LOCALE_FILE_PATH`: 你的 locale 檔案絕對路徑 (e.g. /Users/username/project/locales/zh-CN.json)
- `OPENROUTER_MODEL`: 你的 AI 模型, 目前推薦是 google/gemini-2.0-pro-exp-02-05:free 但有使用限制需注意, 如果不帶 default 會使用 google/gemini-2.0-flash-001

```bash
export OPEN_ROUTER_API_KEY=your_api_key_here
export LOCALE_FILE_PATH=/absolute/path/to/your/zh-CN.json
export OPENROUTER_MODEL=google/gemini-2.0-pro-exp-02-05:free
```

### 指令
建議使用此指令執行, 除非資料夾內有過多檔案, 可以使用下方處理單一文件的方式, 避免有錯誤出現
```bash
npx vue-chinese2i18n
```

處理單一文件:
```bash
npx vue-chinese2i18n --file src/App.vue
```

處理當前目錄及其子目錄中的所有 Vue 文件:
```bash
npx vue-chinese2i18n --nested
```

不使用 diff 格式, ai 回傳完整的 code(注意: 可能會消耗較多 token)
```bash
npx vue-chinese2i18n --use-diff false
```

