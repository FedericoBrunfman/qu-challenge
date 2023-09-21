<template>
  <v-dialog v-model="onOpenDialog" width="800">
    <v-card>
      <v-card-title>Extra information:</v-card-title>
      <v-card-text>
        <v-list :items="content"></v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="openDialog = false"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "CustomDialog",
  props: {
    content: {
      type: Array,
      required: true
    },
    openDialog: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    onOpenDialog() {
      return this.openDialog;
    }
  }
}
</script>