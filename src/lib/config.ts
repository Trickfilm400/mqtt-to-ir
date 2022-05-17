import config from "../../config.js";
import {IClientOptions} from "mqtt";

export interface Path {
    commandTopic: string;
    stateTopic: string;
    keyStroke: { name: string, if?: string, ifnot?: string, ifState?: {state: string, value: string} }[];
}

export interface KeyStroke {
    valueTopic: string;
    remote: string
    keyStroke: string[]
    valueTemplate: (x: string) => string | string[],
    nullValueKeyStroke: string[]
}

export interface IConfig {
    mqtt: MqttConfig;
    paths: Path[];
    keyStrokes: { [key: string]: KeyStroke };
}

export type MqttConfig = Pick<IClientOptions, "username" | "password" | "protocol" | "host" | "clientId">;

export interface MappedConfigPaths {
    [commandTopic: string]: Path;
}

class Config {
    private readonly config: IConfig;
    private readonly mappedConfigPaths: MappedConfigPaths = {};
    private readonly MQTTSubscriptionPaths: string[];

    constructor(config: IConfig) {
        this.config = config;
        this.config.paths.forEach(path => this.mappedConfigPaths[path.commandTopic] = path);
        //this.config.paths.forEach(console.log);
        this.MQTTSubscriptionPaths = this.config.paths.map(path => path.commandTopic);
    }

    getConfig() {
        return this.config;
    }

    getMappedConfigPaths() {
        return this.mappedConfigPaths;
    }

    getMQTTSubscriptionPaths() {
        return this.MQTTSubscriptionPaths;
    }

    getMqttConfig() {
        return this.config.mqtt;
    }
}


export default new Config(config);
