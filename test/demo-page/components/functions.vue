
  
<script>
module.exports = {
  render: () => null,
  data() {
    return {};
  },
  methods: {
    randomChoice(n) {
      return parseInt(Math.random() * n);
    },

    rndInt() {
      const min = 100;
      const max = 200;
      const value = parseInt(Math.random() * (max - min) + min);
      return value;
    },

    rndFloat() {
      const min = 100;
      const max = 200;
      const value = Math.random() * (max - min) + min;
      return value;
    },

    rndJson() {
      return {
        a: this.rndInt(),
        b: this.rndFloat(),
        c: this.rndString(),
        d: {
          aa: this.rndInt(),
          bb: this.rndFloat(),
          cc: this.rndString()
        }
      };
    },

    rndString() {
      const c =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const value = [...Array(10)]
        .map(() => c[~~(Math.random() * c.length)])
        .join("");
      return value;
    },

    runTestsInConsole({ server, debug = false }) {
      console.log("start test");

      const b = jupyterBridge;
      console.log("module jupyterBride loaded, accessible as b");
      console.log(b);

      // WARNING CLIENT BOOST DOES NOT WORK WITH SUBSCRIPTIONS
      const clientA = b.buildClient({ server, debug });

      const runQM = async () => {
        const variablesQ = { channel: "channel-1", name: "toto" };
        console.log("\n--- query\n");
        console.log(JSON.stringify(variablesQ));

        const variablesH = {
          channel: "channel-1",
          name: "toto",
          n: 10,
          start: 0
        };
        console.log("\n--- query histo\n");
        console.log(JSON.stringify(variablesH));

        const variablesM = {
          channel: "channel-1",
          name: "toto",
          value: "123",
          add_histo: true
        };
        console.log("\n--- mutation\n");
        console.log(JSON.stringify(variablesM));

        const optsQ = { fetchPolicy: "network-only" };
        const optsM = { fetchPolicy: "no-cache" };

        const resAQ = await b.actions.read({
          client: clientA,
          variables: variablesQ,
          raw: false,
          opts: optsQ
        });

        const resAH = await b.actions.readHisto({
          client: clientA,
          variables: variablesH,
          raw: false,
          opts: optsQ
        });

        const resAM = await b.actions.write({
          client: clientA,
          variables: variablesM,
          raw: false,
          opts: optsM
        });

        console.log("\n--- requests sent\n");
        console.log("*".repeat(50));

        console.log("\n--- awnswer query for client");
        console.log(resAQ);

        console.log("\n--- awnswer query histo");
        console.log(JSON.stringify(resAH, null, 2));

        console.log("\n--- awnswer mutation histo");
        console.log(resAM);
      };

      runQM();

      const runS = async () => {
        const variablesS = { channel: "channel-1", pattern: true };
        console.log("\n--- subscription\n");
        console.log(JSON.stringify(variablesS));

        const subscription = b.actions.subscribe({
          client: clientA,
          variables: variablesS,
          raw: false,
          observer: {
            next: data => {
              const sep = "-->";
              console.log(`${sep} data:\n${JSON.stringify(data, null, 2)}`);
            },
            error: error => {
              const sep = "*".repeat(50);
              console.log(`\n${sep}\nsubscription error:\n${error}`);
            },
            complete: () => {
              const sep = "*".repeat(50);
              console.log(`\n${sep}\nsubscription complete\n`);
            }
          }
        });

        console.log("\n--- subscription done\n");
        console.log("*".repeat(50));

        window.setTimeout(() => subscription.unsubscribe(), 4000);
        const timer = window.setInterval(
          () => console.log("--- TIC ---"),
          1000
        );
        window.setTimeout(() => {
          window.clearInterval(timer);
          console.log("--- done");
        }, 4000);
      };

      runS();

      console.log("done");
    }
  }
};
</script>
  



