<template>
    <div class="notify-content px-12 w-full text-center">
        <empty :noTips="true"></empty>
        {{ t("No Notify") }}
    </div>
</template>
<script setup lang="ts">
const { t } = useI18n();
</script>

<style lang="less" scoped></style>
<route lang="json5">
    {
      name: 'Notify',
      meta: {
        title: 'Notify',
        i18n: 'Notify'
      },
    }
</route>
