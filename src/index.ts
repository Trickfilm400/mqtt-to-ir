console.log(`[${process.uptime()}] - Starting...`);
import {connect, MqttClient} from "mqtt";
import lirc from "./lirc";
import Config, {MappedConfigPaths} from "./lib/config";


class Main {
    private client: MqttClient;
    private topicValues: Record<string, string>;
    private readonly config: MappedConfigPaths;

    constructor() {
        this.client = connect(Config.getMqttConfig());
        this.client.on("connect", () => this.onConnect());
        this.client.on("error", (e) => console.error(e));
        this.client.on("message", (topic, message) => this.onMessage(topic, message));
        this.topicValues = {};
        this.config = Config.getMappedConfigPaths();
    }

    onConnect() {
        console.log(`[${process.uptime()}] - Connected to MQT Broker....`);
        this.client.subscribe(Config.getMQTTSubscriptionPaths(), function (err) {
            if (err) console.warn(err);
        });
    }

    async onMessage(topic: string, message: Buffer) {
        //region save value to topicValues if not set and exit code -> to prevent sending on application boot
        if (!this.topicValues[topic]) {
            this.topicValues[topic] = message.toString();
            return;
        }
        this.topicValues[topic] = message.toString();
        //endregion
        let t = Date.now();
        // message is Buffer
        const val = await lirc.handleMessage(topic, message.toString(), this.config[topic]);
        console.log(val);
        this.client.publish(this.config[topic].stateTopic, val, {retain: true}, (e) => {
            console.log("ERR: ", this.config[topic].stateTopic, e, Date.now() - t);
        });
    }

    getTopicValues() {
        return this.topicValues;
    }

    end() {
        this.client.end();
    }
}

const main = new Main();


function end() {
    console.log(`[${process.uptime()}] - Stopping...`);
    main.end();
    console.log(`[${process.uptime()}] - Exit program now!`);
    process.exit(0);
}

process.on("SIGINT", () => end());
process.on("SIGTERM", () => end());


export {
    main
};
