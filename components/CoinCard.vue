<script setup lang="ts">
  import CoinCardDownIcon from "@/components/CoinCardDownIcon.vue";
  import CoinCardUpIcon from "@/components/CoinCardUpIcon.vue";
  import type { ICoin } from "@/types";
  
  const props = defineProps({
    coin: {
      type: Object as () => ICoin,
      required: true,
    },
  });
  
  const icon = computed(() => {
    if (props.coin?.change) {
      return props.coin.change === "+" ? CoinCardUpIcon : CoinCardDownIcon;
    }
    return null;
  });
  
  const colorClass = computed(() => {
    if (props.coin?.color) {
      return props.coin.color;
    }
    return null;
  });
  
  </script>
  
  <template>
    <div class="relative">
      <Transition name="fade">
        <component class="shadow-xl z-10" :is="icon" />
      </Transition>
      <div class="card-glassmorphism group cursor-pointer">
        <div
          class="aspect-w-3 aspect-h-2 sm:aspect-none bg-slate-900 bg-opacity-25"
        >
          <img
            :src="props.coin.img"
            class="py-6 mx-auto object-contain max-w-[200px]"
          />
        </div>
        <div
          class="flex-1 flex flex-col text-center relative"
        >
          <h3 class="text-lg xs:text-xl py-4 px-5 font-medium text-slate-200">
            <div>
              {{ props.coin.name }}
            </div>
            <span
              class="inline-flex text-xs font-bold group-hover:text-amber-400 transition duration-150 ease-in-out"
              >weight : {{ props.coin.weight }}gr</span
            >
          </h3>
          <div class="flex items-center justify-center w-full text-base xs:text-sm sm:text-lg">
            <div
              class="inline-flex text-white shadow-md hover:shadow-lg focus:shadow-lg items-center w-full"
              :class="colorClass ? colorClass : 'bg-amber-400'"
              role="group"
            >
              <button
                type="button"
                class="btn-price-left w-full"
                :class="colorClass"
              >
              <span v-if="!props.coin.change">
                Best price
              </span>
              <span v-else class="animate-pulse">
                {{ props.coin.change }} {{ props.coin.diff }} €
              </span>
              </button>
              <button
                type="button"
                class="btn-price-right w-full"
                :class="colorClass"
              >
                {{ props.coin.price }} €
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style lang="scss">
  .fade-enter-active {
    transition: all 0.3s ease-in-out;
  }
  
  .fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .btn-price-left {
    border-bottom-left-radius: 16px;
    @apply px-4 py-5 shadow-lg z-10 bg-opacity-80 font-bold leading-tight focus:outline-none focus:ring-0 transition ease-in-out;
  }
  .btn-price-right {
    border-bottom-right-radius: 16px;
    @apply px-4 py-5 bg-opacity-80 font-medium leading-tight uppercase group-hover:bg-yellow-500 focus:bg-yellow-400 focus:outline-none focus:ring-0 active:bg-yellow-700 transition ease-in-out;
  }
  
  .price-up-color {
    @apply bg-red-500 group-hover:bg-red-500 focus:bg-red-400 focus:outline-none focus:ring-0 active:bg-red-700;
    transition: all 0.5s ease-in-out;
  }
  
  .price-down-color {
    @apply bg-green-500 group-hover:bg-green-500 focus:bg-green-400 focus:outline-none focus:ring-0 active:bg-green-700;
    transition: all 0.5s ease-in-out;
  }
  
  .card-glassmorphism {
    z-index: 1;
    background-image: radial-gradient(
      circle farthest-corner at 10% 20%,
      rgba(90, 92, 106, 1) 0%,
      rgba(32, 45, 58, 1) 81.3%
    );
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.293);
    backdrop-filter: blur(4.7px);
    -webkit-backdrop-filter: blur(4.7px);
    border: 1px solid rgba(199, 197, 188, 0.457);
    transition: all 0.3s, box-shadow 1s;
    @apply flex flex-col overflow-hidden;
  
    &::before {
      content: "";
      position: absolute;
      z-index: -1;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-image: radial-gradient(
        circle farthest-corner at -4% -12.9%,
        rgba(74, 98, 110, 1) 0.3%,
        rgba(30, 33, 48, 1) 90.2%
      );
      transition: all 0.2s linear;
      opacity: 0;
    }
  
    &:hover {
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.147);
      transform: scale(1.009) perspective(0px);
      transition: all 0.5s ease-in-out;
    }
  
    &:hover:before {
      opacity: 1;
    }
  }
  </style>
  