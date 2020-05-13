<template>
  <div>
    <v-card class="mr-1 pa-2 my-card" outlined tile>
      <v-card-title>Query Histo</v-card-title>
      <v-card-subtitle>HTTP</v-card-subtitle>

      <v-form ref="form">
        <v-text-field v-model="channel" label="Channel" required class="px-5"></v-text-field>
        <v-text-field v-model="name" label="Name" required class="px-5"></v-text-field>
        <v-text-field v-model="n" label="N" type="number" required class="px-5"></v-text-field>
        <v-text-field v-model="start" label="Start" type="number" required class="px-5"></v-text-field>
      </v-form>

      <v-card-actions>
        <v-btn outlined color="purple" text @click="request">Request</v-btn>
        <v-btn outlined text @click="random">Random</v-btn>
        <v-btn outlined text @click="reset">Reset</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>

      <json-display :obj="value" class="my-wrapper" />
    </v-card>
    <Functions ref="func" />
  </div>
</template>

<script>
const Functions = httpVueLoader("./functions.vue");
const JsonDisplay = httpVueLoader("./json-display.vue");

module.exports = {
  name: "QueryHisto",
  props: {
    server: { type: Object, require: true }
  },
  components: {
    JsonDisplay,
    Functions
  },

  data() {
    return {
      client: null,
      channel: "",
      name: "",
      n: 10,
      start: 0,
      value: null
    };
  },

  watch: {
    server: {
      handler() {
        this.client = this.jb.buildClient({ server: this.server });
      },
      immediate: false,
      deep: true
    }
  },
  created() {
    this.jb = jupyterBridge;
    this.client = this.jb.buildClient({ server: this.server });
  },
  methods: {
    async request() {
      this.value = await this.jb.actions.readHisto({
        client: this.client,
        variables: {
          channel: this.channel,
          name: this.name,
          n: this.n,
          start: this.start
        },
        opts: { fetchPolicy: "network-only" },
        raw: false
      });
    },
    random() {
      const arrChannel = ["channel-1"];
      const arrName = ["toto", "titi"];
      const c = this.$refs.func.randomChoice(arrChannel.length);
      const n = this.$refs.func.randomChoice(arrName.length);
      this.channel = arrChannel[c];
      this.name = arrName[n];
    },
    reset() {
      this.channel = "";
      this.name = "";
      this.value = null;
    }
  }
};
</script>
  
<style scoped>
.my-card {
  height: 950px;
}
</style>    


