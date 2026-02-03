<template>
    <div class="news-item relative w-full rounded-[16px] overflow-hidden flex gap-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
        @click="handleClick">
        <div class="img w-68 h-68 flex-shrink-0 bg-[#F5F5F5] overflow-hidden rounded-[16px 16px 0 0]">
            <img :src="item.article_image" alt="" v-if="item && item.article_image"
                class="w-full h-full object-cover rounded-[16px 0 0]">
        </div>
        <div class="info w-full color-[#111827] font-bold py-8 text-[12px] flex justify-between items-center pr-9">
            <div class="flex flex-col justify-between h-full">
                {{ item.title }}
                <div class="time color-[#8E8E93]">{{ item.create_time || '12:22 AM' }}</div>
            </div>
            <svg class="w-16 h-16 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.94 13.28L10.2867 8.9333C10.8 8.41997 10.8 7.57997 10.2867 7.06664L5.94 2.71997"
                    stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    name: 'faqItem',
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    methods: {
        handleClick() {
            this.$emit('click', this.item)
        }
    }
}
</script>