<script setup lang="ts">
import type { RealtimeSubscription } from "@supabase/supabase-js";
import type { ICoin } from "@/types";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

const supabase = useSupabaseClient();
let subscription: RealtimeSubscription;

const coins = ref<ICoin[]>([]);
const loading = ref(false);

const { data } = await supabase.from<ICoin>("coins").select("*");
coins.value = data;

const onUpdate = () => {
  coins.value.forEach(async (coin) => {
    const newPrice = Math.floor(Math.random() * (800 - 300)) + 300;
    await supabase
      .from("coins")
      .update([{ id: coin.id, price: newPrice }])
      .eq("id", coin.id);
  });
};

const lastUpdated = computed(() => {
  return new Date(coins.value[0].updated_at).toLocaleString();
});

const onChangePrice = (currentCoinIndex: number, newCoin: ICoin) => {
  loading.value = true;
  const isMoreOrLess =
    coins.value[currentCoinIndex].price > newCoin.price ? "-" : "+";
  coins.value[currentCoinIndex] = {
    ...coins.value[currentCoinIndex],
    price: newCoin.price,
    updated_at: newCoin.updated_at,
    change: isMoreOrLess,
    color: isMoreOrLess === "+" ? "price-up-color" : "price-down-color",
    diff: parseFloat(
      Math.abs(newCoin.price - coins.value[currentCoinIndex].price).toFixed(2)
    ),
  };
  setTimeout(() => {
    coins.value[currentCoinIndex].change = null;
    coins.value[currentCoinIndex].color = null;
    coins.value[currentCoinIndex].diff = null;
    loading.value = false;
  }, 3000);
};

onMounted(() => {
  subscription = supabase
    .from("coins")
    .on("UPDATE", (payload) => {
      const currentCoinIndex = coins.value.findIndex(
        (coin) => coin.id === payload.new.id
      );
      const newCoin = payload.new;

      if (coins.value[currentCoinIndex].price !== newCoin.price) {
        onChangePrice(currentCoinIndex, newCoin);
      }
    })

    .subscribe();
});

onUnmounted(() => {
  supabase.removeSubscription(subscription);
});
</script>

<template>
  <main
    className="bg-gray-800 min-h-screen flex flex-col items-center justify-center py-20"
  >
    <div class="flex flex-col items-center mb-10 px-4">
      <button
        @click="onUpdate"
        :disabled="loading"
        :class="
          loading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-yellow-500 hover:bg-yellow-600'
        "
        class="my-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
      >
        <span>Update prices in database (with no refetch)</span>
        <ArrowPathIcon
          class="h-6 w-6 ml-2"
          :class="loading ? 'animate-spin' : ''"
        />
      </button>
      <span class="text-white">Last updated : {{ lastUpdated }}</span>
    </div>
    <div class="max-w-2xl mx-auto flex flex-wrap justify-center gap-8">
      <CoinCard
        v-for="coin in coins"
        :key="coin.id"
        :coin="coin"
        class="min-w-[300px]"
      />
    </div>
  </main>
</template>
