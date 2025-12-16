<script setup>
import ReactWrapper from '../../ReactWrapper.vue'
import { B24Icon } from '@bitrix24/b24icons-react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reactCode = `import { B24Icon } from '@bitrix24/b24icons-react'

function App() {
  return (
    <div class="rounded-md border flex gap-4 p-4 shadow-md bg-inherit">
      <div class="flex flex-col flex-nowrap items-center justify-center">
        <span class="text-md text-base-500">
          Button::TariffIcon
        </span>

        <B24Icon name="Button::TariffIcon" className="size-25 text-blue-500 dark:text-blue-900" />
      </div>
      <div class="flex flex-col flex-nowrap items-center justify-center">
        <span class="text-sm text-base-500">
          Main::CopilotAiIcon
        </span>

        <B24Icon name="Main::CopilotAiIcon" className="size-15 text-red-500 dark:text-red-900" />
      </div>
      <div class="flex flex-col flex-nowrap items-center justify-center">
        <span class="text-xs text-base-500">
          Main::AiIcon
        </span>

        <B24Icon name="Main::AiIcon" className="size-8 text-green-500 dark:text-green-900" />
      </div>
    </div>
  )
}`
</script>

<template>
  <div class="rounded-md border flex gap-4 p-4 shadow-md bg-inherit">
    <div class="flex flex-col flex-nowrap items-center justify-center">
      <span class="text-md text-base-500">
        Button::TariffIcon
      </span>

      <ReactWrapper
        :component="B24Icon"
        :props="{ name: 'Button::TariffIcon', className: 'size-25 text-blue-500 dark:text-blue-900' }"
      />
    </div>
    <div class="flex flex-col flex-nowrap items-center justify-center">
      <span class="text-sm text-base-500">
        Main::CopilotAiIcon
      </span>

      <ReactWrapper
        :component="B24Icon"
        :props="{ name: 'Main::CopilotAiIcon', className: 'size-20 text-red-500 dark:text-red-900' }"
      />
    </div>
    <div class="flex flex-col flex-nowrap items-center justify-center">
      <span class="text-xs text-base-500">
        Main::AiIcon
      </span>

      <ReactWrapper
        :component="B24Icon"
        :props="{ name: 'Main::AiIcon', className: 'size-10 text-green-500 dark:text-green-900' }"
      />
    </div>
  </div>
</template>
