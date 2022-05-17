import Config, {KeyStroke, Path} from "./lib/config";
import {main} from "./index";
import * as lirc from "lirc-client";

class Lirc {
    private lircClient: lirc.Lirc;

    constructor() {
        this.lircClient = new lirc.Lirc({
            path: "/var/run/lirc/lircd",
            autoconnect: false
        });
        if (process.env.NODE_ENV !== "test") {
            this.lircClient.connect().catch(console.warn);
        }
    }

    async handleMessage(topic: string, value: string, opt: Path) {
        //console.log(topic);
        //console.log(value);

        for (let i in opt.keyStroke) {
            //console.log("if", value === opt.keyStroke[i].if || (opt.keyStroke[i].if === undefined &&
            // opt.keyStroke[i].ifnot === undefined && opt.keyStroke[i].ifState === undefined) || (opt.keyStroke[i].ifnot !== undefined && opt.keyStroke[i].ifnot !== value) || opt.keyStroke[i].ifState?.value === main.getTopicValues()[opt.keyStroke[i].ifState?.state], value, topic);
            if (value === opt.keyStroke[i].if || (opt.keyStroke[i].if === undefined && opt.keyStroke[i].ifnot === undefined && opt.keyStroke[i].ifState === undefined) || (opt.keyStroke[i].ifnot !== undefined && opt.keyStroke[i].ifnot !== value) || (opt.keyStroke[i].ifState !== undefined && opt.keyStroke[i].ifState?.value === main.getTopicValues()[opt.keyStroke[i].ifState?.state])) {
                const keyStrokeConfig = Config.getConfig().keyStrokes[opt.keyStroke[i].name];
                await this.handleKeyStroke(keyStrokeConfig);
            }
        }
        return value;
    }

    private async handleKeyStroke(keyStroke: KeyStroke) {
        //fetch value to use
        const u = main.getTopicValues()[keyStroke.valueTopic];
        const value = keyStroke.valueTemplate ? keyStroke.valueTemplate(u) : u;
        //check which keyStroke to be used
        const keys = value === null ? keyStroke.nullValueKeyStroke ? keyStroke.nullValueKeyStroke : keyStroke.keyStroke : keyStroke.keyStroke;
        for (const index in keys) {
            let key = keys[index];
            //replace placeholder
            //e. g. preset keystroke
            if (Array.isArray(value)) {
                value.forEach((v, i) => {
                    key = key.replace(`{value${i}}`, v);
                });
            } else key = key.replace("{value}", value);
            //send button if not in test mode
            if (process.env.NODE_ENV !== "test")
                await this.lircClient.sendOnce(keyStroke.remote, key);
        }

    }

}


export default new Lirc();
