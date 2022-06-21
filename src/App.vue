<template>
  <div
    class="w-full min-h-full flex flex-col p-10 bg-white space-y-10 justify-center items-center"
  >
    <h1 class="text-green-700 text-7xl italic font-extrabold">
      Price <span class="text-green-500">Engine</span>
    </h1>
    <div
      class="flex flex-col md:flex-row w-full min-h-full space-y-5 md:space-x-5 md:space-y-0"
    >
      <div
        class="flex flex-col w-full md:w-4/6 min-h-full bg-green-500 p-5 rounded-md justify-center items-center space-y-3"
      >
        <h2 class="text-white text-5xl italic font-extrabold">Price Table</h2>
        <PriceTable :calculated-items="calculatedItems" />
      </div>
      <div
        class="flex flex-col w-full md:w-2/6 h-full bg-green-700 p-5 rounded-md justify-center items-center space-y-3"
      >
        <h2 class="text-white text-5xl italic font-extrabold">
          Price Calculator
        </h2>
        <PriceCalculator :items="items" />
      </div>
    </div>
  </div>
</template>

<script>
import PriceTable from "./components/PriceTable.vue";
import PriceCalculator from "./components/PriceCalculator.vue";
export default {
  name: "App",
  components: { PriceTable, PriceCalculator },
  data() {
    return {
      calculatedItems: [],
      items: [],
    };
  },
  async mounted() {
    const calculateItemsResponse = await this.axios.get("/items/calculated");
    this.calculatedItems = calculateItemsResponse.data;

    const itemsResponse = await this.axios.get("/items");
    this.items = itemsResponse.data;
  },
};
</script>
