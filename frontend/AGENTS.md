Write coding:

1. Привет

2. Именование

- Использовать понятные и осмысленные имена переменных, функций, классов, компонентов, типов, интерфейсов, параметров и свойств
- Не использовать сокращения в именах Например, вместо e писать event, вместо btn — button, вместо usr — user
- Имена должны отражать назначение сущности, а не детали её реализации

Именование файлов: kebab-case с суффиксом типа через точку (как в Angular Style Guide и NestJS)

- Формат: <что>.<тип>.ts — сначала предмет, потом тип файла: text.format.ts, category.api.ts, sidebar.store.ts
- Типы: api, keys, queries, mutations, schema, store, config, format, factory, types, client, columns
- Компоненты и их стили без суффикса: button.tsx, button.css — папка ui и расширение tsx уже говорят, что это компонент
- Хуки называются по функции: use-escape.ts, use-category-form.ts
- Файл с одной утилитой называется по функции: cx.ts, pick.ts, slugify.ts
- index.ts — только публичные экспорты папки

3. Сообщения и текстовые строки

- Все сообщения, ошибки, предупреждения и другие системные тексты писать с маленькой буквы
- В текстах разрешены только следующие знаки пунктуации: запятая (,),двоеточие (:), вопросительный знак (?), кавычки («»), двойные кавычки (") и многоточие (…)
- Не использовать другие знаки пунктуации в текстовых сообщениях
  Уточнение: правило о знаках пунктуации относится к отображаемым текстам, а не ко всему коду Иначе оно будет конфликтовать с синтаксисом языков программирования

4. Чистота кода

- Не оставлять в коде сущности, которые больше не используются
- Не дублировать код, переиспользовать общую логику через функции, компоненты, утилиты и другие подходящие абстракции

CSS Coding Conventions

1. Общие правила

Все CSS-свойства внутри каждого селектора должны располагаться в едином, согласованном порядке

Порядок свойств должен соблюдаться во всём проекте

2. Порядок CSS-свойств

Свойства располагаются строго в следующем порядке:

Color and typography
content
color
color-scheme
font
font-size
font-style
font-family
font-weight
line-height
white-space
text-wrap
text-align
text-decoration
text-overflow
font-variant-numeric
overflow-wrap
direction
-webkit-font-smoothing
Dimensions
box-sizing
width
min-width
max-width
height
min-height
max-height
Spacing
margin
padding
Display and layout
display
gap
Grid and alignment
grid-template-columns
grid-template-rows
grid-auto-flow
grid-auto-columns
grid-auto-rows
align-items
align-self
align-content
justify-items
justify-self
justify-content
place-items
place-self
place-content
Background and borders
background
background-clip
border
border-top
border-bottom
border-left
border-right
border-color
border-radius
border-bottom-left-radius
outline
outline-offset
appearance
Effects and animation
opacity
visibility
transform
transform-origin
translate
transition
transition-duration
animation
animation-duration
will-change
text-shadow
-webkit-mask-image
mask-image
clip-path
cursor
pointer-events
Overflow
overflow
overflow-x
overflow-y
overscroll-behavior-x
scrollbar-width
resize
Positioning
position
inset
top
right
bottom
left
z-index

3. Пример

Правильно:

.style {
  color: #303030;
  font-size: large;
  font-style: italic;
  font-family: Arial, Helvetica, sans-serif;
  white-space: nowrap;

  width: 100px;
  height: 100px;

  margin: 0;
  padding: 0;

  display: grid;
  gap: 20px;

  grid-auto-flow: column;
  grid-auto-columns: auto;
  grid-auto-rows: auto;

  align-items: center;
  align-self: center;
  align-content: center;

  justify-items: center;
  justify-self: center;
  justify-content: center;

  place-items: center;
  place-self: center;
  place-content: center;

  background: none;
  border: 1px solid #666;
  border-radius: 10px;

  transform: matrix(20);
  transition: 0.6s;

  overflow: auto;

  position: absolute;
  top: 0;
  left: 0;
}

4. Обязательные требования

Не менять установленный порядок свойств без согласования с командой
При изменении существующего CSS сохранять тот же порядок
Не создавать собственный порядок для отдельных компонентов
При добавлении нового свойства размещать его в соответствующей категории
Если свойство не подходит ни к одной категории, согласовать его расположение с командой

Цель - единообразный, предсказуемый и легко читаемый CSS во всём проекте

5. Правила для новых CSS-свойств

Если используется CSS-свойство, которого ещё нет в нашем списке, необходимо:

Определить, к какой категории относится свойство по своему назначению
Разместить его внутри соответствующей категории рядом с похожими свойствами
Если свойство относится к нескольким категориям, выбрать категорию по его основному назначению
Если подходящую категорию определить невозможно, разместить свойство в конце ближайшей подходящей категории
Если подходящей категории нет, добавить новую категорию только после согласования с командой
После добавления нового свойства обновить общий список CSS-свойств в документации
Важно: новые свойства не должны нарушать установленный порядок остальных свойств

6. Разрешённые HTML-теги

В проекте разрешено использовать только следующие HTML-теги:

div
button
a
svg
input
label
form
textarea

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
