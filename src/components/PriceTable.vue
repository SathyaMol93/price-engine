<template>
  <div
    class="bg-white w-full h-full rounded-md flex justify-center items-start p-5"
  >
    <table class="table-auto w-full">
      <thead>
        <tr>
          <th class="text-column">Item Name</th>
          <th class="numeric-column">Units</th>
          <th class="numeric-column">Units Per Carton</th>
          <th class="numeric-column">Unit Price</th>
          <th class="numeric-column">Carton Price</th>
        </tr>
      </thead>
      <tbody v-if="calculatedItems.length === 0">
        <tr>
          <td colspan="5" class="text-center">No records to show</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="(item, index) in calculatedItems" :key="index">
          <td class="text-column">{{ item.itemName }}</td>
          <td class="numeric-column">{{ item.units }}</td>
          <td class="numeric-column">{{ item.itemsPerCarton }}</td>
          <td class="numeric-column">{{ item.actualPrice }}</td>
          <td class="numeric-column">{{ item.cartonPrice }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    calculatedItems: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped></style>
