# @bitrix24/b24icons-react

`@bitrix24/b24icons-react` library for React.

## Installation

Install via npm.

```sh
$ npm i @bitrix24/b24icons-react
```

## Usage

### Direct import

```jsx
import { AddIcon } from '@bitrix24/b24icons-react/main'

function App() {
  return (
    <div className="rounded">
      <AddIcon className="size-15 text-blue-500" />
    </div>
  )
}
```

### Using B24Icon component

```jsx
import { B24Icon } from '@bitrix24/b24icons-react'

function App() {
  return (
    <div className="rounded">
      <B24Icon name="main::AddIcon" className="size-15 text-blue-500" />
    </div>
  )
}
```

### Import by category

```jsx
import * as MainIcons from '@bitrix24/b24icons-react/main'

function App() {
  return (
    <div className="rounded">
      <MainIcons.AddIcon className="size-15 text-blue-500" />
    </div>
  )
}
```

Find more details in the [documentation](https://bitrix24.github.io/b24icons/).
