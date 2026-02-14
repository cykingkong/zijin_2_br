<template>
  <div class="profile-page min-h-screen bg-[#F7F7F7] pb-[100px] ">

    <!-- 1. Header Title -->
    <div class="pt-[10px] pb-[10px] text-center">
      <h1 class="text-[18px] font-bold text-[#1A1A1A]">{{ t("Profile") }}</h1>
    </div>

    <!-- 2. User Info Card -->
    <div class="px-[16px] mb-[16px]">
      <div class="flex items-center gap-[12px]">
        <!-- Avatar Upload Trigger -->
        <div class="relative" @click="handleClickUploadAvatar">
          <!-- Hexagon Shape Simulation or Circle as fallback -->
          <div
            class="w-[36px] h-[36px] rounded-full overflow-hidden border-2 border-white shadow-sm bg-white flex items-center justify-center">
            <img :src="userInfo.avatar" class="w-full h-full object-cover" v-if="userInfo.avatar" />
            <img src="@/assets/lv/lv1.png" class="w-full h-full object-cover" v-else />
          </div>
          <!-- Level Badge -->
          <div
            class="absolute -top-[4px] -right-[4px] bg-[#EBB37D] text-white text-[10px] px-[4px] py-[1px] rounded-[4px] border border-white">
            {{ userInfo.levelName || 'LV1' }}
          </div>
        </div>

        <div class="flex flex-col justify-center">
          <div class="flex items-center gap-2">
            <span class="text-[#1b1b1b] text-[14px] font-bold">ACC:</span>
            <span class="text-[#333] text-[16px] font-normal">{{ formatName(userInfo.username) }}</span>
          </div>
          <!-- Missing Field: ID -->
          <div class="text-[#999] text-[12px]">ID: {{ userInfo.userId || '234527' }}</div>
        </div>
      </div>
    </div>

    <!-- 3. My Product Card -->
    <div class="px-[16px] mb-[16px]">
      <div class="bg-white rounded-[16px] p-[16px] flex justify-between items-center shadow-sm">
        <span class="text-[16px] font-bold text-[#1A1A1A]">{{ t("MyProducts") }}</span>
        <div
          class="bg-[#1A1A1A] text-[#fff] px-[12px] py-[6px] rounded-[8px] flex items-center gap-4 text-[12px] active:opacity-80 text-[12px]"
          @click="toReceive">
          <img src="@/assets/coin.png" alt="" class="w-16 h-16 block">
          <span>{{ t("ReceiveIncome") }}</span>
        </div>
      </div>
    </div>

    <!-- 4. Wallet / Stats Card -->
    <div class="px-[16px] mb-[16px]">
      <div class="bg-white rounded-[16px] p-[20px] shadow-sm">
        <!-- Top Balances -->
        <div class="flex justify-between mb-[20px]">
          <div class="flex flex-col items-center flex-1">
            <span class="text-[24px] font-bold text-[#A26D47] ">{{ fakeData.balance_wallet > 0 ?
              addCommasToNumber(fakeData.balance_wallet) : addCommasToNumber(userInfo.balance) || '0'
              }}</span>
            <span class="text-[#666] text-[12px] mt-[4px]">{{ t("DepositWallet") }}</span>
          </div>
          <div class="flex flex-col items-center flex-1 border-l border-[#f5f5f5]">
            <span class="text-[24px] font-bold text-[#A26D47] ">{{ fakeData.deposit_wallet > 0 ?
              addCommasToNumber(fakeData.deposit_wallet) : addCommasToNumber(userInfo.teamBalance) ||
              '0' }}</span>
            <span class="text-[#666] text-[12px] mt-[4px]">{{ t("TeamWallet") }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-[16px] mb-[24px]">
          <button @click="handleHerf(2)"
            class="flex-1 bg-[#1A1A1A] text-white h-[44px] rounded-[12px] font-bold text-[15px]">{{ t("Deposit")
            }}</button>
          <button @click="handleHerf(1)"
            class="flex-1 bg-[#1A1A1A] text-white h-[44px] rounded-[12px] font-bold text-[15px]">{{ t("Withdraw")
            }}</button>
        </div>

        <!-- 6-Grid Data Stats -->
        <div class="grid grid-cols-2 gap-y-[20px] gap-x-[12px]">
          <!-- Row 1 -->
          <div class="flex flex-col">
            <span class="text-[#999] text-[12px] mb-[2px]">{{ t("TotalIncome") }}</span>
            <span class="text-[#1A1A1A] text-[16px] font-bold ">{{ fakeData.total_income > 0 ?
              addCommasToNumber(fakeData.total_income) : addCommasToNumber(userInfo.allProfit)
              }}</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[#999] text-[12px] mb-[2px]">{{ t("TotalWithdraw") }}</span>
            <span class="text-[#1A1A1A] text-[16px] font-bold ">{{ fakeData.total_withdraw > 0 ?
              addCommasToNumber(fakeData.total_withdraw) : addCommasToNumber(userInfo.rechargePrice)
              }}</span>
          </div>
          <!-- Row 2 -->
          <div class="flex flex-col">
            <span class="text-[#999] text-[12px] mb-[2px]">{{ t("ProductIncome") }}</span>
            <span class="text-[#1A1A1A] text-[16px] font-bold ">{{ fakeData.product_income > 0 ?
              addCommasToNumber(fakeData.product_income) : addCommasToNumber(userInfo.productProfit)
              }}</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[#999] text-[12px] mb-[2px]">{{ t("TeamIncome") }}</span>
            <span class="text-[#1A1A1A] text-[16px] font-bold ">{{ fakeData.team_income > 0 ?
              addCommasToNumber(fakeData.team_income) : addCommasToNumber(userInfo.itemProfit)
              }}</span>
          </div>
          <!-- Row 3 (Missing Fields Simulation) -->
          <div class="flex flex-col">
            <span class="text-[#999] text-[12px] mb-[2px]">{{ t("OtherIncome") }}</span>
            <span class="text-[#1A1A1A] text-[16px] font-bold ">{{ fakeData.other_income > 0 ?
              addCommasToNumber(fakeData.other_income) : addCommasToNumber(userInfo.otherIncome ||
              '0') }}</span>
          </div>
          <div class="flex flex-col items-end" @click="router.push('/exchange')">
            <span class="text-[#999] text-[12px] mb-[2px]">{{ t('Pearl') }} <svg class="w-14 h-14" viewBox="0 0 14 14"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_6753_24019)">
                  <path
                    d="M9.40607 0.375C11.8522 0.403498 13.7624 2.25321 13.7625 4.59082C13.7625 6.90078 11.795 8.7793 9.37677 8.7793C9.06472 8.77927 8.7516 8.75059 8.49396 8.69336L8.44611 8.68262L8.45587 8.63477L8.56818 8.07227L8.57794 8.02051L8.6297 8.0332C8.84999 8.08824 9.09886 8.11618 9.37677 8.11621C11.4349 8.11621 13.0994 6.5313 13.0994 4.59082C13.0993 2.62187 11.4907 1.06641 9.40509 1.06641C7.34724 1.06655 5.68358 2.65057 5.68341 4.59082C5.68341 4.76108 5.68381 4.9247 5.71075 5.05957L5.72052 5.11133L5.66876 5.11914L5.10529 5.20312L5.05548 5.21094L5.04865 5.16113C5.01992 4.96001 5.02032 4.75895 5.02032 4.5625C5.02059 2.25284 6.98712 0.375149 9.40509 0.375H9.40607Z"
                    fill="#8C91A2" stroke="#8C91A2" stroke-width="0.1" />
                  <path
                    d="M4.53497 4.73779C6.95307 4.73779 8.92045 6.61554 8.92072 8.92529C8.92072 11.2353 6.95323 13.1138 4.53497 13.1138C2.11685 13.1136 0.150208 11.2352 0.150208 8.92529C0.150471 6.61564 2.11701 4.73794 4.53497 4.73779ZM4.53497 5.40088C2.47719 5.40103 0.813558 6.98512 0.813293 8.92529C0.813293 10.8657 2.47702 12.4505 4.53497 12.4507C6.59306 12.4507 8.25763 10.8658 8.25763 8.92529C8.25736 6.98503 6.59289 5.40088 4.53497 5.40088Z"
                    fill="#8C91A2" stroke="#8C91A2" stroke-width="0.1" />
                  <path
                    d="M5.23951 6.11989C5.64522 6.20179 6.0329 6.38041 6.36035 6.63638C6.38463 6.65544 6.41282 6.66892 6.4429 6.67586C6.47299 6.68281 6.50423 6.68305 6.53442 6.67657C6.58117 6.66662 6.62509 6.6408 6.65692 6.60001C6.72862 6.50807 6.71249 6.37514 6.62055 6.30344C6.24138 6.00744 5.79291 5.80071 5.32312 5.70571C5.20882 5.68251 5.09738 5.75645 5.07423 5.871C5.05102 5.98529 5.12521 6.09668 5.23951 6.11989ZM4.7798 11.8478C4.79321 11.8474 4.8064 11.8459 4.81906 11.8433C4.91645 11.8225 4.98851 11.7348 4.98601 11.6317C4.98334 11.5151 4.88648 11.4228 4.76986 11.4255C3.97648 11.4442 3.22001 11.111 2.69421 10.5116C2.61726 10.424 2.48361 10.4152 2.39603 10.4922C2.35392 10.5291 2.32822 10.5813 2.32457 10.6372C2.32092 10.6932 2.33963 10.7482 2.37658 10.7904C2.98506 11.4839 3.8612 11.8694 4.7798 11.8478Z"
                    fill="#8C91A2" />
                  <path
                    d="M8.74908 2.74951C9.0757 2.57818 9.49456 2.56885 9.85358 2.60596C10.2637 2.64838 10.6177 2.75515 10.6817 2.76807L10.7364 2.77979L10.7198 2.83252L10.5508 3.36768L10.5352 3.41553L10.4874 3.3999C10.2804 3.33092 9.98235 3.26785 9.6983 3.25049C9.55649 3.24184 9.41925 3.24502 9.29987 3.26318C9.18105 3.2813 9.08292 3.31403 9.01471 3.36279C8.98417 3.39293 8.95757 3.41445 8.93463 3.45459C8.91188 3.49451 8.89268 3.55585 8.89264 3.66162V3.72998L8.88678 3.74072L8.86627 3.77979C8.86868 3.78752 8.87391 3.80394 8.88971 3.82764C8.91198 3.86104 8.95101 3.90556 9.01471 3.95752C9.14222 4.06153 9.36873 4.19248 9.75885 4.31787H9.75787C10.3009 4.48934 10.6571 4.77953 10.7764 5.16748C10.9237 5.63944 10.6592 6.02515 10.6329 6.07666L10.6016 6.13916L10.5811 6.11865C10.5692 6.12979 10.5541 6.1441 10.5342 6.1626C10.4809 6.21238 10.402 6.2823 10.295 6.35303C10.0805 6.49479 9.75455 6.6391 9.29303 6.63916C8.97524 6.63916 8.57476 6.55305 8.09381 6.3833L8.04303 6.36572L8.06451 6.31592L8.2901 5.80908L8.30963 5.76514L8.35455 5.78369C9.00785 6.04772 9.432 6.02383 9.69244 5.93701C9.8226 5.89359 9.91372 5.83372 9.97369 5.78369C10.037 5.73077 10.0582 5.69628 10.0733 5.68115L10.087 5.65869C10.0983 5.63884 10.1131 5.60969 10.126 5.57568C10.1522 5.50679 10.1695 5.42014 10.1456 5.33643V5.33545C10.1212 5.26542 10.0597 5.18978 9.96002 5.1167C9.85961 5.04307 9.72387 4.97451 9.55865 4.91943H9.55768C8.91006 4.69416 8.46976 4.43572 8.29108 4.07861L8.28912 4.07568V4.07471C8.20395 3.87547 8.19869 3.72416 8.22955 3.62451C8.23264 3.21586 8.43934 2.98046 8.61334 2.83545L8.6153 2.8335L8.74908 2.74951Z"
                    fill="#8C91A2" stroke="#8C91A2" stroke-width="0.1" />
                  <path d="M9.70901 2.23242V6.94922H9.04593V2.23242H9.70901Z" fill="#8C91A2" stroke="#8C91A2"
                    stroke-width="0.1" />
                  <path
                    d="M4.332 0.785645L4.38766 1.34814L4.39255 1.39795L4.34372 1.40283C2.91429 1.55549 2.07418 2.40159 1.58688 3.22998C1.09911 4.05935 0.96717 4.86859 0.953094 4.93896L0.943329 4.98486L0.896454 4.97803L0.332977 4.89404L0.290985 4.88721V4.84424L0.292938 4.82275C0.294286 4.81455 0.297072 4.80295 0.299774 4.78857C0.305239 4.75953 0.313367 4.71765 0.325165 4.66553C0.348839 4.56099 0.386093 4.41322 0.441376 4.23584C0.552165 3.88043 0.734945 3.40469 1.02243 2.91846C1.59758 1.94569 2.59495 0.925995 4.27634 0.740723L4.32712 0.734863L4.332 0.785645Z"
                    fill="#8C91A2" stroke="#8C91A2" stroke-width="0.1" />
                  <path
                    d="M13.0166 8.53857L13.5791 8.62256L13.6221 8.62939V8.67236C13.6221 8.67859 13.6202 8.68779 13.6191 8.69482C13.6178 8.70397 13.616 8.7167 13.6133 8.73193C13.6078 8.76244 13.5997 8.80558 13.5879 8.85889C13.5642 8.96555 13.5261 9.11496 13.4707 9.29346C13.3599 9.65064 13.1771 10.1257 12.8896 10.6118C12.3145 11.5846 11.3178 12.6047 9.63672 12.8042L9.58594 12.8101L9.58105 12.7593L9.52441 12.1958L9.51953 12.147L9.56836 12.1411C10.9979 11.9746 11.8378 11.1225 12.3252 10.2905C12.8132 9.45749 12.9459 8.64801 12.96 8.57764L12.9688 8.53174L13.0166 8.53857ZM3.32422 0.0161133C3.36515 0.0434002 3.57537 0.162336 3.83496 0.306152L4.64355 0.745605L4.64551 0.747559L4.92676 0.916504L4.97461 0.944824L4.94141 0.98877L3.81543 2.48096L3.78516 2.521L3.74512 2.49072L3.29492 2.15283L3.25488 2.12354L3.28418 2.0835L3.98242 1.14307C3.48093 0.865733 3.21844 0.718358 3.07812 0.63623C2.93526 0.552603 2.91472 0.535294 2.89551 0.516113L2.86035 0.47998L2.89551 0.444824L3.08984 0.249512L3.25684 0.027832L3.28516 -0.00927734L3.32422 0.0161133Z"
                    fill="#8C91A2" stroke="#8C91A2" stroke-width="0.1" />
                  <path
                    d="M10.1675 11.0254L10.6177 11.3633L10.6578 11.3936L10.6275 11.4326L9.92926 12.3721C10.4315 12.6498 10.6941 12.7977 10.8345 12.8799C10.9781 12.9639 10.9979 12.9817 11.0172 13.001L11.0523 13.0361L11.0172 13.0713L10.8218 13.2656L10.6558 13.4883L10.6275 13.5264L10.5884 13.5C10.5066 13.4454 9.74862 13.0244 9.2691 12.7705L9.26715 12.7695L8.9859 12.6006L8.93805 12.5713L8.97125 12.5273L10.0972 11.0352L10.1275 10.9951L10.1675 11.0254Z"
                    fill="#8C91A2" stroke="#8C91A2" stroke-width="0.1" />
                </g>
                <defs>
                  <clipPath id="clip0_6753_24019">
                    <rect width="14" height="14" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <span class="text-[#1A1A1A] text-[16px] font-bold ">{{ fakeData.pearl_amount > 0 ?
              addCommasToNumber(fakeData.pearl_amount) : addCommasToNumber(userInfo.seedBalance ?
                userInfo.seedBalance :
                '0')
              }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. My Team Card -->
    <div class="px-[16px] mb-[16px]">
      <div class="bg-white rounded-[16px] p-[16px] shadow-sm relative">
        <div class="flex justify-between items-center mb-[16px]">
          <span class="text-[16px] font-bold text-[#1A1A1A]">{{ t('My team') }}</span>
          <!-- Calculator Icon Placeholder -->
          <svg class="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            @click="router.push('/team')">
            <path d="M10 22H14C19 22 21 20 21 15V9C21 4 19 2 14 2H10C5 2 3 4 3 9V15C3 20 5 22 10 22Z" stroke="#8C91A2"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M16.5 7.58008V8.58008C16.5 9.40008 15.83 10.0801 15 10.0801H9C8.18 10.0801 7.5 9.41008 7.5 8.58008V7.58008C7.5 6.76008 8.17 6.08008 9 6.08008H15C15.83 6.08008 16.5 6.75008 16.5 7.58008Z"
              stroke="#8C91A2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.13612 14H8.14767" stroke="#8C91A2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M11.9952 14H12.0068" stroke="#8C91A2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M15.8543 14H15.8659" stroke="#8C91A2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M8.13612 17.5H8.14767" stroke="#8C91A2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M11.9952 17.5H12.0068" stroke="#8C91A2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M15.8543 17.5H15.8659" stroke="#8C91A2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>

        </div>

        <!-- Levels Grid -->
        <div class="flex gap-[12px] mb-[16px]">
          <div v-for="(i, k) in myteamList" :key="k"
            class="flex-1 bg-white border border-[#f2f2f2] border-solid rounded-[12px] py-[12px] flex flex-col items-center">
            <div class="flex items-center text-[12px] text-[#999] mb-[4px]">
              <img :src="i.img" class="w-17 h-17 object-cover block mr-4"></img> {{ i.name }}
            </div>
            <span class="text-[#1A1A1A] text-[16px] font-bold ">{{ fakeData[i.fakeKey] > 0 ?
              addCommasToNumber(fakeData[i.fakeKey]):i.num }}</span>
          </div>
        </div>

        <!-- Rules Text -->
        <div class="text-[#666] text-[11px] leading-[1.5] mb-[12px]">
          Regras: Membros Nível 1 - comissão de 10%; Membros Nível 2 - comissão de 5%; Membros Nível 3 - comissão de 2%.
        </div>

        <!-- Details Link -->
        <div class="text-center" @click="router.push('/team')">
          <span class="text-[#999] text-[12px] flex items-center justify-center gap-1">
            {{ t('Details') }} <van-icon name="arrow" size="10" />
          </span>
        </div>
      </div>
    </div>

    <!-- 6. Bottom Grid Menu (Replacs old Cell List) -->
    <div class="px-[16px]">
      <div class="bg-white rounded-[16px] p-[16px] shadow-sm grid grid-cols-3 gap-y-[24px]">
        <div v-for="(item, index) in menuList" :key="index" class="flex flex-col items-center"
          @click="handleClickMenu(item)">
          <!-- Icon Box -->
          <div class="w-[20px] h-[20px] mb-[8px] flex items-center justify-center">
            <img :src="item.icon" alt="" class="w-20 h-20 block">
          </div>
          <!-- Text -->
          <span class="text-[#333] text-[12px] font-medium text-center" :class="{ 'text-red-500': item.isLogout }">{{
            item.text
            }}</span>
        </div>
      </div>
    </div>

    <!-- Upload Popup (Kept from original) -->
    <van-popup v-model:show="uploadPopShow" destroy-on-close round :position="'center'" :safe-area-inset-bottom="true">
      <div class="p-12 w-[80vw]">
        <div class="upload-label mb-12 flex items-center justify-center font-bold">
          {{ t('Upload Avatar') }}
        </div>
        <van-uploader accept="image/*" :max-count="1" v-model="pictureList"
          :after-read="(file) => handleAfterRead(file, 1)" class="w-full flex justify-center">
          <div
            class="w-[120px] h-[120px] border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
            <van-icon name="photograph" size="24" />
            <span class="text-[12px] mt-2">{{ t("Choose a file") }}</span>
          </div>
        </van-uploader>
        <div class="mt-4 flex gap-4">
          <van-button block plain size="small" @click="uploadPopShow = false">{{ t("Cancel") }}</van-button>
          <van-button block type="primary" color="#1A1A1A" size="small" :disabled="canUpdateAvatar"
            @click="updateUserAvatar">{{ t("Confirm") }}</van-button>
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores';
import { userUpdate, getUserFakeInfo, } from '@/api/user';
import { uploadFile } from '@/api/tool';
import { showFailToast, showSuccessToast } from 'vant';
import { addCommasToNumber } from '@/utils/tool';
import defaultAvatar from "@/assets/image/avatar.png";
import lv1 from "@/assets/lv/lv1.png";
import lv2 from "@/assets/lv/lv2.png";
import lv3 from "@/assets/lv/lv3.png";
// Import Icons (Placeholders based on screenshot)
// 实际开发请替换为对应的 cell1.png 等资源
import iconExchange from "@/assets/profile/1.svg"; // 兑换奖励
import iconBank from "@/assets/profile/2.svg";     // 银行卡
import iconFunds from "@/assets/profile/3.svg";    // 资金明细
import iconPass from "@/assets/profile/4.svg";     // 密码
import iconQuit from "@/assets/profile/5.svg";     // 辞职说明
import iconLogout from "@/assets/profile/6.svg";   // 登出

const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const fakeData = ref<any>({
  team_level1_count: 0,
  team_level2_count: 0,
  team_level3_count: 0,



})
// --- 状态变量 ---
const uploadPopShow = ref(false);
const canUpdateAvatar = ref(true);
const userAvatar = ref('');
const pictureList = ref<any[]>([])

// --- 数据处理 ---


const formatName = (str: string) => {
  if (!str) return '';
  // 模拟截图: 389****4253
  if (str.length > 7) {
    return str.substring(0, 3) + '****' + str.substring(str.length - 4);
  }
  return str;
};

// 模拟获取团队各等级人数 (Missing Field)
const getLevelCount = (level: number) => {
  // 实际应从 API 获取
  return 30;
};

// --- 菜单配置 (Grid Menu) ---
const menuList = [
  { text: t('Exchange Code'), icon: iconExchange, url: '/reward', type: 'link' },
  { text: t('Bank Account'), icon: iconBank, url: '/profile/bankAccount', type: 'link' },
  { text: t('Fund Details'), icon: iconFunds, url: '/wallet/walletLogs', type: 'link' },
  { text: t('Password'), icon: iconPass, url: '/forgot-password?noLogin=1', type: 'link' },
  { text: t('Quit Article'), icon: iconQuit, url: '/richTextDetail?type=czwz', type: 'link' }, // 暂定 About Us
  { text: t('Logout'), icon: iconLogout, type: 'logout', isLogout: false }
];
const myteamList = ref([
  {
    img: lv1,
    name: 'LV1',
    fakeKey: 'team_level1_count',
    num: userInfo.value?.topData?.find((item: any) => item.generation === 1)?.vaildUserCount || 0
  },
  {
    img: lv2,
    name: 'LV2',
    fakeKey: 'team_level2_count',

    num: userInfo.value?.topData?.find((item: any) => item.generation === 2)?.vaildUserCount || 0

  },
  {
    img: lv3,
    fakeKey: 'team_level3_count',
    name: 'LV3',
    num: userInfo.value?.topData?.find((item: any) => item.generation === 3)?.vaildUserCount || 0
  },
])
// --- 事件处理 ---
const handleHerf = (type: number) => {
  // 1: Withdraw, 2: Deposit
  if (type === 2) {
    router.push("/wallet/exchange/cashierCenter");
  } else {
    router.push("/wallet/exchange/cashierCenter-withdraw");
  }
};
const toReceive = () => {
  router.push("/receive");
}
const handleClickMenu = (item: any) => {
  if (item.type === 'logout') {
    handleLogout();
  } else if (item.url) {
    router.push(item.url);
  }
};

const handleLogout = () => {
  userStore.logout();
  router.push({ path: "/login" });
};

// --- 头像上传逻辑 (保持原有逻辑) ---
const handleClickUploadAvatar = () => {
  uploadPopShow.value = true;
  canUpdateAvatar.value = true;
};

const handleAfterRead = async (file: any, type: any) => {
  file.status = "uploading";
  const formData = new FormData();
  formData.append("image", file.file);
  try {
    const { data, code } = await uploadFile(formData);
    if (code == 200) {
      userAvatar.value = data.url;
      pictureList.value = [{ url: data.url }];

      canUpdateAvatar.value = false;
    }
  } catch (error) {
    file.status = "failed";
    showFailToast(t("Upload failed"));
  }
};

const updateUserAvatar = async () => {
  if (!userAvatar.value) return;
  const res = await userUpdate({ avatar: userAvatar.value });
  if (res.code === 200) {
    showSuccessToast(t("Update successful"));
    userStore.info(); // 刷新用户信息
    uploadPopShow.value = false;
  }
};

onMounted(async () => {
  await userStore.setInfo({
    balance: 0,
    teamBalance: 0,
    allProfit: 0,
    rechargePrice:"0.00",
    seedBalance:"0.00",
    itemProfit: "0.00",
    todayProfit: "0.00",
  })
  await userStore.getInfo();
 
  await getUserFakeInfo().then(({ data }) => {
    console.log(data, 'fakeData')
    fakeData.value = data
  })
   await userStore.getWalletInfo();
  await userStore.fetchTeamInfoData();
  console.log(userInfo.value, 'userInfo')
});
</script>

<style scoped></style>

<route lang="json5">
{
  name: 'profile',
  meta: {
    title: 'My Profile',
    i18n: 'profile'
  },
}
</route>
