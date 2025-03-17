<template>
  <template v-if="Device.isDesktop.value">
    <div v-loading="loading" class="flex h-full">
      <div class="flex-1 flex items-center justify-center h-full flex-col">
        <el-image :src="chatLogoSrc" class="h-[120px] w-[120px] mb-[48px]" lazy></el-image>
        <el-button type="primary" class="!h-[48px] !w-[144px]" @click="goChatRoom">开始聊天</el-button>
      </div>
      <!-- Info -->
      <LayoutSidebar v-if="isShowSidebar" class="w-[360px]">
        <router-view class="w-full h-full bg-background border-l border-light flex flex-col"></router-view>
      </LayoutSidebar>
    </div>
  </template>
  <template v-else-if="Device.isMobile.value">
    <router-view class="bg-background border-l border-light flex flex-col overflow-y-auto"></router-view>
  </template>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

definePage({
  name: 'DirectoryInfo',
});

const Device = useDevice();
const { getSpecificParamValue } = useRouteInfo();
const loading = ref<boolean>(false);
const route = useRoute();
const router = useRouter();

const chatLogoSrc = `${import.meta.env.BASE_URL}/images/chat-logo.png`;

const targetId = computed(() => {
  return getSpecificParamValue.value('id');
});

const isShowSidebar = computed(() => {
  // check the router-view have the component or not
  return route.fullPath.includes('info');
});

function goChatRoom() {
  router.push(`/message/group/${targetId.value}/chat`);
}
</script>







