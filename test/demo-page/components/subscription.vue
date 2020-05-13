<template>
  <div>
    <v-card class="mr-1 pa-2 my-card" outlined tile>
      <v-card-title>Subscription</v-card-title>
      <v-card-subtitle>WS</v-card-subtitle>

      <v-form ref="form">
        <v-text-field v-model="channel" label="Channel" required class="px-5"></v-text-field>
        <v-checkbox v-model="pattern" label="Pattern" required></v-checkbox>
      </v-form>

      <v-card-actions>
        <div class="d-flex flex-column">
          <div class="d-flex">
            <v-btn outlined text class="mx-1" @click="random">Random</v-btn>
            <v-btn outlined text class="mx-1" @click="reset">Reset</v-btn>
          </div>
          <div class="d-flex mt-2">
            <v-btn outlined color="purple" class="mx-1" text @click="start">Start</v-btn>
            <v-btn outlined color="purple" class="mx-1" text @click="stop">Stop</v-btn>
          </div>
        </div>

        <v-spacer></v-spacer>
      </v-card-actions>

      <json-display :obj="value" />
    </v-card>
    <Functions ref="func" />
  </div>
</template>

<script>
const Functions = httpVueLoader("./functions.vue");
const JsonDisplay = httpVueLoader("./json-display.vue");

module.exports = {
  name: "Subscription",
  props: {
    server: { type: Object, require: true }
  },
  components: {
    "json-display": JsonDisplay,
    Functions
  },

  data() {
    return {
      client: null,
      channel: "",
      pattern: false,
      value: null,
      sub: null
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
    async start() {
      if (this.channel !== "") {
        const that = this;
        this.sub = await this.jb.actions.subscribe({
          client: this.client,
          variables: {
            channel: this.channel,
            pattern: this.pattern
          },
          raw: false,
          observer: {
            next: data => {
              this.value = data;
            },
            error: error => {
              this.value = data;
            },
            complete: () => {
              this.value = "Subscription completed";
            }
          }
        });
        this.value = { status: "Subscription started" };
      } else {
        this.value = { status: "Missing channel" };
      }
    },
    stop() {
      this.sub.unsubscribe();
      this.value = { status: "Subscription stopped" };
    },
    random() {
      const arrChannel = ["channel-1"];
      const c = this.$refs.func.randomChoice(arrChannel.length);
      this.channel = arrChannel[c];
    },
    reset() {
      this.channel = "";
      this.pattern = false;
      this.value = null;
    }
  }
};
</script>
  
<style>
.my-card {
  height: 950px;
}
</style>    


