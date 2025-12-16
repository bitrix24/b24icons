<script setup>
import ReactWrapper from '../../ReactWrapper.vue'
import React from 'react'
import Bitrix24Icon from '@bitrix24/b24icons-react/common-service/Bitrix24Icon'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reactCode = `import Bitrix24Icon from '@bitrix24/b24icons-react/common-service/Bitrix24Icon'

function App() {
  return (
    <div className="rounded">
      <Bitrix24Icon className="size-25 text-blue-500" />
    </div>
  )
}`

function App() {
  return React.createElement('div', { className: 'rounded' },
    React.createElement(Bitrix24Icon, { className: 'size-25 text-blue-500 dark:text-blue-900' })
  )
}
</script>

<template>
  <B24Card
    class="shadow-md"
    :b24ui="{ body: 'flex flex-row flex-nowrap items-center justify-center' }"
  >
    <template #header>
      <ProseP small class="mb-0">
        Common-service::Bitrix24Icon
      </ProseP>
    </template>
    <ReactWrapper :component="App" />
  </B24Card>
</template>
