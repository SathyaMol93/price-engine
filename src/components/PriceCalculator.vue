<template>
  <div
    class="bg-white w-full h-full rounded-md flex flex-col justify-center items-start p-5 space-y-10"
  >
    <div
      class="flex flex-col justify-center item-center w-full h-full space-y-2"
    >
      <div class="flex justify-between items-center space-x-2">
        <div class="flex flex-col w-full">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Item
          </label>
          <div class="relative">
            <select
              v-model="v$.itemId.$model"
              class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-state"
            >
              <option v-for="(item, idx) in items" :key="idx" :value="item.id">
                {{ item.itemName }}
              </option>
            </select>
          </div>
          <p v-if="v$.itemId.$error" class="text-red-600 font-semibold">
            Item is required
          </p>
        </div>
        <div class="flex flex-col w-full">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Quantity
          </label>
          <div class="relative">
            <input
              v-model="v$.quantity.$model"
              class="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="number"
            />
          </div>
          <p v-if="v$.quantity.$error" class="text-red-600 font-semibold">
            Quantity is required
          </p>
        </div>
      </div>
      <div class="flex justify-start items-center">
        <button
          @click="addItem"
          class="h-10 w-1/2 bg-green-500 text-white font-semibold rounded-md"
        >
          Add
        </button>
      </div>
      <div class="flex w-full"></div>
    </div>
    <div
      class="flex flex-col justify-center item-center w-full h-full space-y-2"
    >
      <div class="flex justify-start items-center w-full space-x-2">
        <h2 class="text-green-700 text-2xl italic font-semibold flex">
          Selected items
        </h2>
        <div
          class="w-full flex flex-grow h-0 border-b-4 border-green-700"
        ></div>
      </div>
      <div class="flex justify-start items-center w-full">
        <table class="table-auto w-full">
          <thead>
            <tr>
              <th class="text-column">Item</th>
              <th class="numeric-column">Quantity</th>
            </tr>
          </thead>
          <tbody v-if="priceItems.length === 0">
            <tr>
              <td colspan="2" class="text-center">No records to show</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(item, index) in priceItems" :key="index">
              <td class="text-column">{{ getItemName(item.itemId) }}</td>
              <td class="numeric-column">{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-start items-center">
        <p v-if="isEmpty" class="text-red-600 font-semibold">
          No item to calculate
        </p>
      </div>
      <div class="flex justify-between items-center space-x-1">
        <button
          @click="calculate"
          class="h-10 w-1/2 border-green-700 border-2 text-green-700 font-semibold rounded-md"
        >
          Calculate
        </button>
        <button
          v-if="priceItems.length > 0"
          @click="reset"
          class="h-10 w-1/2 bg-green-500 border-2 text-white font-semibold rounded-md"
        >
          Reset
        </button>
      </div>
    </div>
    <div class="flex justify-start items-center w-full space-x-2">
      <h2 class="text-green-700 text-2xl italic font-semibold flex">
        Item calculation
      </h2>
      <div class="w-full flex flex-grow h-0 border-b-4 border-green-700"></div>
    </div>
    <div class="flex justify-between item-center w-full h-full space-y-2">
      <table class="table-auto w-full">
        <thead>
          <tr>
            <th class="text-column">Item</th>
            <th class="numeric-column">Cartons</th>
            <th class="numeric-column">Single Units</th>
            <th class="numeric-column">Total</th>
          </tr>
        </thead>
        <tbody v-if="priceItems.length === 0">
          <tr>
            <td colspan="4" class="text-center">No records to show</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="(cal, index) in calculation" :key="index">
            <td class="text-column">{{ cal.itemName }}</td>
            <td class="numeric-column">{{ cal.totalCartons }}</td>
            <td class="numeric-column">{{ cal.totalItems }}</td>
            <td class="numeric-column">{{ cal.totalPrice }}</td>
          </tr>
          <tr>
            <td class="text-column" colspan="3">
              <span class="font-bold">Total</span>
            </td>
            <td
              class="numeric-column border-t-2 border-b-4 border-double numeric-column"
            >
              {{ total }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      itemId: null,
      quantity: null,
      priceItems: [],
      isEmpty: false,
      calculation: [],
      total: null,
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      itemId: { required },
      quantity: { required },
    };
  },
  methods: {
    async addItem() {
      const isFormCorrect = await this.v$.$validate();
      if (isFormCorrect) {
        this.priceItems.push({ itemId: this.itemId, quantity: this.quantity });
      }
    },

    getItemName(itemId) {
      return this.items.find((item) => item.id === itemId).itemName;
    },

    async calculate() {
      if (this.priceItems.length === 0) {
        this.isEmpty = true;
      } else {
        this.total = 0.0;
        this.isEmpty = false;
        const res = await this.axios.post("/prices/items", this.priceItems);
        this.calculation = res.data;
        res.data.forEach((element) => {
          this.total += element.totalPrice;
        });
      }
    },

    reset() {
      this.priceItems = [];
      this.calculation = [];
      this.total = null;
    },
  },
};
</script>

<style scoped></style>
