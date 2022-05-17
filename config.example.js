module.exports = {
	"mqtt": {
		"host": "192.168.2.200",
		"protocol": "mqtt",
		"clientId": "",
		"username": "",
		"password": ""
	},
	"paths": [
		{
			"commandTopic": "smarthome/hvac/temperature/set",
			"stateTopic": "smarthome/hvac/temperature/value",
			"keyStroke": [{name: "uuid-temperature", ifState: {state: "smarthome/hvac/power/set", value: "ON"}}]
		},
		{
			"commandTopic": "smarthome/hvac/power/set",
			"stateTopic": "smarthome/hvac/power/value",
			"keyStroke": [{name: "uuid-power"}, {name: "uuid-temperature", if: "ON", ifnot: "OFF"}]
		},
		{
			"commandTopic": "smarthome/hvac/mode/set",
			"stateTopic": "smarthome/hvac/mode/value",
			"keyStroke": [{name:"uuid-mode", ifnot: "off"}, {name: "uuid-preset", ifnot: "off"}, {name:"uuid-temperature", ifnot: "off"}]
		},
	],
	"keyStrokes": {
		"uuid-power": {
			"valueTopic": "smarthome/hvac/power/set",
			"remote": "tcl-air-cond",
			"keyStroke": ["POWER_{value}_0", "POWER_{value}_1"],
			"valueTemplate": x => x.toUpperCase()
		},
		"uuid-preset": {
			"valueTopic": "smarthome/hvac/preset/set",
			"remote": "tcl-air-cond",
			"keyStroke": ["{value0}_0", "{value0}_1", "{value1}_0", "{value1}_1"],
			"valueTemplate": x => (x === "eco" ? ["TURBO_OFF", "ECO_ON"] : (x === "boost" ? ["ECO_OFF", "TURBO_ON"] : null)),
			"nullValueKeyStroke": ["TURBO_OFF_0", "TURBO_OFF_1", "ECO_OFF_0", "ECO_OFF_1"]
		},
		"uuid-mode": {
			"valueTopic": "smarthome/hvac/mode/set",
			"remote": "tcl-air-cond",
			"keyStroke": ["{value}_0", "{value}_1"],
			"valueTemplate": x => x === "off" ? null : x.toUpperCase(),
			"nullValueKeyStroke": []
		},
		"uuid-temperature": {
			"valueTopic": "smarthome/hvac/temperature/set",
			"remote": "tcl-air-cond",
			"keyStroke": ["C0{value}_0", "C0{value}_1"],
			"valueTemplate": x => x.replace(".", "")
		}
	}
}
