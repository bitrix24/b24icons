<script setup>
import ReactWrapper from '../../ReactWrapper.vue'
import { B24Icon } from '@bitrix24/b24icons-react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reactCode = `import { B24Icon } from '@bitrix24/b24icons-react'

function App() {
  return (
    <div className="rounded">
      <B24Icon name="Button::TariffIcon" className="size-25 text-blue-500" />
      <B24Icon name="Main::CopilotAiIcon" className="size-25 text-blue-500" />
      <B24Icon name="Main::AiIcon" className="size-25 text-blue-500" />
    </div>
  )
}`
</script>

<template>
  <B24PageColumns>
    <B24Card
      class="shadow-md"
      :b24ui="{ body: 'flex flex-row flex-nowrap items-center justify-center' }"
    >
      <template #header>
        <ProseP small class="mb-0">
          Button::TariffIcon
        </ProseP>
      </template>
      <ReactWrapper
        :component="B24Icon"
        :props="{ name: 'Button::TariffIcon', className: 'size-25 text-blue-500 dark:text-blue-900' }"
      />
    </B24Card>
    <B24Card
      class="shadow-md"
      :b24ui="{ body: 'flex flex-row flex-nowrap items-center justify-center' }"
    >
      <template #header>
        <ProseP small class="mb-0">
          Main::CopilotAiIcon
        </ProseP>
      </template>
      <ReactWrapper
        :component="B24Icon"
        :props="{ name: 'Main::CopilotAiIcon', className: 'size-25 text-blue-500 dark:text-blue-900' }"
      />
    </B24Card>
    <B24Card
      class="shadow-md"
      :b24ui="{ body: 'flex flex-row flex-nowrap items-center justify-center' }"
    >
      <template #header>
        <ProseP small class="mb-0">
          Main::AiIcon
        </ProseP>
      </template>
      <ReactWrapper
        :component="B24Icon"
        :props="{ name: 'Main::AiIcon', className: 'size-25 text-blue-500 dark:text-blue-900' }"
      />
    </B24Card>
  </B24PageColumns>
</template>
