<script setup>
import ReactWrapper from '../../ReactWrapper.vue'
import React from 'react'
import Bitrix24Icon from '@bitrix24/b24icons-react/common-service/Bitrix24Icon'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reactCode = `import Bitrix24Icon from '@bitrix24/b24icons-react/common-service/Bitrix24Icon'

function App() {
  return (
    <div class="rounded-md border flex gap-4 p-4 shadow-md bg-inherit">
      <div class="flex flex-col flex-nowrap items-center justify-center">
        <span class="text-md text-base-500">
          Common-service::Bitrix24Icon
        </span>

        <Bitrix24Icon className="size-25 text-blue-500 dark:text-blue-900" />
      </div>
    </div>
  )
}`

function App() {
  return React.createElement(Bitrix24Icon, { className: 'size-25 text-blue-500 dark:text-blue-900' })
}
</script>

<template>
  <div class="rounded-md border flex gap-4 p-4 shadow-md bg-inherit">
    <div class="flex flex-col flex-nowrap items-center justify-center">
      <span class="text-md text-base-500">
        Common-service::Bitrix24Icon
      </span>

      <ReactWrapper :component="App" />
    </div>
  </div>
</template>
