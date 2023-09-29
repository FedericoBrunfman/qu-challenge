<template>
  <v-dialog class="custom-dialog" v-model="onOpenDialog" width="800">
    <v-card>
      <v-card-title>Extra information:</v-card-title>
      <div
        v-if="loadingDialog"
        class="d-flex align-center justify-center my-10"
      >
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else>
        <v-card-text>
          <v-row align="center" class="custom-dialog__header">
            <v-col cols="3" v-for="header in headers" :key="header">
              <div>{{ header.toUpperCase() }}</div>
            </v-col>
          </v-row>
          <v-row
            align="center"
            v-for="(item, i) in content"
            :key="item.name"
            :class="{ 'custom-dialog__odd-row': i % 2 !== 0 }"
          >
            <v-col
              cols="3"
              v-for="characteristic in item"
              :key="characteristic"
            >
              <div>{{ characteristic }}</div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { PropType } from "vue";
interface ContentObject {
  name?: string;
  title?: string;
  height?: string;
  mass?: string;
  director?: string;
  producer?: string;
}
export default {
  name: "CustomDialog",
  props: {
    content: {
      type: Array as PropType<ContentObject[]>,
      required: true,
    },
    openDialog: {
      type: Boolean,
      default: false,
    },
    loadingDialog: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    onOpenDialog(): boolean {
      return this.openDialog;
    },
    headers(): string[] {
      if (this.content && this.content.length > 0 && this.content[0]) {
        return Object.keys(this.content[0]);
      }
      return [];
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:openDialog", false);
    },
  },
};
</script>
<style scoped lang="scss">
.custom-dialog {
  font-size: 13px;
  &__header {
    background-color: #eaeaea;
    font-weight: bold;
  }
  &__odd-row {
    background-color: #eaeaea;
  }
}
</style>
