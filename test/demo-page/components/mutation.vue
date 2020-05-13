<template>
  <div>
    <v-card class="mr-1 pa-2 my-card" outlined tile>
      <v-card-title>Mutation</v-card-title>
      <v-card-subtitle>HTTP</v-card-subtitle>

      <v-form ref="form">
        <v-text-field v-model="channel" label="Channel" required class="px-5"></v-text-field>
        <v-text-field v-model="name" label="Name" required class="px-5"></v-text-field>
        <v-text-field v-model="value" label="Value" required class="px-5"></v-text-field>
        <v-checkbox v-model="add_histo" label="Add to Histo" required></v-checkbox>
      </v-form>

      <v-card-actions>
        <v-btn outlined color="purple" text @click="request">Request</v-btn>
        <v-btn outlined text @click="random">Random</v-btn>
        <v-btn outlined text @click="reset">Reset</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>

      <json-display :obj="ack" />
    </v-card>
    <Functions ref="func" />
  </div>
</template>

<script>
const Functions = httpVueLoader("./functions.vue");
const JsonDisplay = httpVueLoader("./json-display.vue");

module.exports = {
  name: "Mutation",
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
      value: "",
      add_histo: true,
      ack: null
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
      this.ack = await this.jb.actions.write({
        client: this.client,
        variables: {
          channel: this.channel,
          name: this.name,
          value: this.value,
          add_histo: this.add_histo
        },
        opts: { fetchPolicy: "no-cache" },
        raw: false
      });
    },
    random() {
      const arrChannel = ["channel-1"];
      const arrName = ["toto", "titi"];
      const arrGen = [
        this.$refs.func.rndString,
        this.$refs.func.rndInt,
        this.$refs.func.rndFloat,
        this.$refs.func.rndJson
      ];
      const c = this.$refs.func.randomChoice(arrChannel.length);
      const n = this.$refs.func.randomChoice(arrName.length);
      const g = this.$refs.func.randomChoice(arrGen.length);
      this.channel = arrChannel[c];
      this.name = arrName[n];
      this.value = JSON.stringify(arrGen[g]());
    },
    reset() {
      this.channel = "";
      this.name = "";
      this.value = "";
      this.add_histo = true;
    }
  }
};
</script>
  
<style>
.my-card {
  height: 950px;
}
</style>    


