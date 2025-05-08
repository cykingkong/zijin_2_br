<template>
    <div class="pt-12 px-12 flex flex-col gap-12">
        <div class="title font-size-24">安全</div>
        <div class="font-size-14">双重安全认证</div>
        <div class="font-size-12 color-blueGray">為了保護您的財產，建議至少開啟一個雙重身份驗證（2FA）。</div>
        <div class="flex gap-24">
            <div class="item flex-1   px-16 py-8  flex-shrink-0 ">
                <div class="flex justify-between items-center">
                    <div class="imgBox w45 h34"><img class="w-full h-full"
                            src="data:image/png;base64,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"
                            alt="">
                    </div>
                    <div class="right icon w14 h14"><img class="w-full h-full"
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAbCAYAAABvCO8sAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD+SURBVHgB7dUxDoIwFAbgUiLqxhG4gayOHdn0BMaT6Q1wkkhM6qKuHoEjuBkYeBaMCxJ5fX2b/gkJKU2+vw0FIf5hjoedmGU68sbjDZTlOklUIYhBgS0WBNrcRuYqoKoUFR0EO9g7ZFQOTfD9IDStws5wW6IpIyyD2tI8P8fgCw2fsPVK0S8NF4oGuVArkAO1Bl1REuiCkkEqOngOvwVGctaDvTKZ9A6TV3jQ1xXU9bbnUQFSqkTNC8EFUjES6IJZg66YFciBoUEuDAXuj5eF9CDlwJoMnsPSL0+m1o0Da4La0lTrcArmrw8idsGaoL40S6XuD69Spt3OBfuNPAEoBciwl2zMXQAAAABJRU5ErkJggg=="
                            alt=""></div>
                </div>
                <div class="text text-12 mt-12">手机验证</div>

            </div>
            <div class="item flex-1  px-16 py-8 h100">
                <div class="flex justify-between items-center">
                    <div class="imgBox w45 h34"><img class="w-full h-full"
                            src="data:image/png;base64,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"
                            alt="">
                    </div>
                    <div class="right icon w14 h14"><img class="w-full h-full"
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAbCAYAAABvCO8sAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD+SURBVHgB7dUxDoIwFAbgUiLqxhG4gayOHdn0BMaT6Q1wkkhM6qKuHoEjuBkYeBaMCxJ5fX2b/gkJKU2+vw0FIf5hjoedmGU68sbjDZTlOklUIYhBgS0WBNrcRuYqoKoUFR0EO9g7ZFQOTfD9IDStws5wW6IpIyyD2tI8P8fgCw2fsPVK0S8NF4oGuVArkAO1Bl1REuiCkkEqOngOvwVGctaDvTKZ9A6TV3jQ1xXU9bbnUQFSqkTNC8EFUjES6IJZg66YFciBoUEuDAXuj5eF9CDlwJoMnsPSL0+m1o0Da4La0lTrcArmrw8idsGaoL40S6XuD69Spt3OBfuNPAEoBciwl2zMXQAAAABJRU5ErkJggg=="
                            alt=""></div>
                </div>
                <div class="text text-12 mt-12">手机验证</div>
            </div>
        </div>
        <ul>
            <li class="w-full h50 flex items-center justify-between  pl-16 pr-16 text-12">
                <div class="l">修改登陆密码</div>
                <div class="right icon w14 h14"><img class="w-full h-full"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAbCAYAAABvCO8sAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD+SURBVHgB7dUxDoIwFAbgUiLqxhG4gayOHdn0BMaT6Q1wkkhM6qKuHoEjuBkYeBaMCxJ5fX2b/gkJKU2+vw0FIf5hjoedmGU68sbjDZTlOklUIYhBgS0WBNrcRuYqoKoUFR0EO9g7ZFQOTfD9IDStws5wW6IpIyyD2tI8P8fgCw2fsPVK0S8NF4oGuVArkAO1Bl1REuiCkkEqOngOvwVGctaDvTKZ9A6TV3jQ1xXU9bbnUQFSqkTNC8EFUjES6IJZg66YFciBoUEuDAXuj5eF9CDlwJoMnsPSL0+m1o0Da4La0lTrcArmrw8idsGaoL40S6XuD69Spt3OBfuNPAEoBciwl2zMXQAAAABJRU5ErkJggg=="
                        alt=""></div>
            </li>
            <li class="w-full h50 flex items-center justify-between  pl-16 pr-16 text-12">
                <div class="l">修改登陆密码</div>
                <div class="right icon w14 h14"><img class="w-full h-full"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAbCAYAAABvCO8sAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD+SURBVHgB7dUxDoIwFAbgUiLqxhG4gayOHdn0BMaT6Q1wkkhM6qKuHoEjuBkYeBaMCxJ5fX2b/gkJKU2+vw0FIf5hjoedmGU68sbjDZTlOklUIYhBgS0WBNrcRuYqoKoUFR0EO9g7ZFQOTfD9IDStws5wW6IpIyyD2tI8P8fgCw2fsPVK0S8NF4oGuVArkAO1Bl1REuiCkkEqOngOvwVGctaDvTKZ9A6TV3jQ1xXU9bbnUQFSqkTNC8EFUjES6IJZg66YFciBoUEuDAXuj5eF9CDlwJoMnsPSL0+m1o0Da4La0lTrcArmrw8idsGaoL40S6XuD69Spt3OBfuNPAEoBciwl2zMXQAAAABJRU5ErkJggg=="
                        alt=""></div>
            </li>
            <li class="w-full h50 flex items-center justify-between  pl-16 pr-16 text-12">
                <div class="l">修改登陆密码</div>
                <div class="right icon w14 h14"><img class="w-full h-full"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAbCAYAAABvCO8sAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD+SURBVHgB7dUxDoIwFAbgUiLqxhG4gayOHdn0BMaT6Q1wkkhM6qKuHoEjuBkYeBaMCxJ5fX2b/gkJKU2+vw0FIf5hjoedmGU68sbjDZTlOklUIYhBgS0WBNrcRuYqoKoUFR0EO9g7ZFQOTfD9IDStws5wW6IpIyyD2tI8P8fgCw2fsPVK0S8NF4oGuVArkAO1Bl1REuiCkkEqOngOvwVGctaDvTKZ9A6TV3jQ1xXU9bbnUQFSqkTNC8EFUjES6IJZg66YFciBoUEuDAXuj5eF9CDlwJoMnsPSL0+m1o0Da4La0lTrcArmrw8idsGaoL40S6XuD69Spt3OBfuNPAEoBciwl2zMXQAAAABJRU5ErkJggg=="
                        alt=""></div>
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"




</script>
<style lang="less" scoped>
.item {
    background: var(--bg-main);
    border: 1px solid var(--grey_bg);
}

:deep(.van-cell) {
    background: transparent;
}

:deep(.van-cell-group) {
    background: transparent;

}
</style>
