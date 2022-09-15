<script setup lang="ts">
import type { RealtimeSubscription } from "@supabase/supabase-js";
import type { ICoin } from "@/types";

const supabase = useSupabaseClient();
let subscription: RealtimeSubscription;

const coins = ref<ICoin[]>([]);

const { data } = await supabase.from<ICoin>("coins").select("*");
coins.value = data;

const onChangePrice = (currentCoinIndex: number, newCoin: ICoin) => {
  const isMoreOrLess = coins.value[currentCoinIndex].price > newCoin.price ? "-" : "+";
  coins.value[currentCoinIndex] = {
    ...coins.value[currentCoinIndex],
    price: newCoin.price,
    change: isMoreOrLess,
    color: isMoreOrLess === "+" ? "price-up-color" : "price-down-color",
    diff: parseFloat(
      Math.abs(newCoin.price - coins.value[currentCoinIndex].price).toFixed(2)
    ),
  };
  setTimeout(() => {
    coins.value[currentCoinIndex].change = null;
    coins.value[currentCoinIndex].color = null;
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
    className="bg-gray-800 min-h-screen flex flex-col items-center justify-center"
  >
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
