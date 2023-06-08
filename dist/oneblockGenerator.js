"use strict";
var rows = [];
const Elements = {
    output: document.getElementById("output"),
    bottomTopColor: document.getElementById("bottom-top-color"),
    glassColor: document.getElementById("glass-color"),
    commandContainer: document.getElementById("command-container"),
    addRowButton: document.getElementById("add-row"),
    generateButton: document.getElementById("generate"),
    includeSign: document.getElementById("include-sign")
};
const commandBase = "/summon falling_block ~ ~3 ~ ";
function generate() {
    if (rows.length === 0) {
        Elements.output.value = "Please add at least 1 row";
        return;
    }
    var longestCommand = 0;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].commands.length > longestCommand) {
            longestCommand = rows[i].commands.length;
        }
    }
    var rowAmount = rows.length; // this is the same as currentColumns
    var output = {
        BlockState: { Name: "minecraft:redstone_block" },
        Time: -1000,
        DropItem: 0,
        HurtEntities: 0,
        Passengers: [
            {
                id: "minecraft:endermite",
                Silent: 1,
                NoAI: 1,
                Lifetime: 2395,
                Passengers: [
                    {
                        id: "minecraft:falling_block",
                        BlockState: { Name: "minecraft:activator_rail" },
                        Time: -1000,
                        DropItem: 0,
                        HurtEntities: 0,
                        Passengers: [
                            {
                                id: "minecraft:command_block_minecart",
                                Silent: 1,
                                Command: `/fill ~ ~3 ~3 ~2 ~3 ~${longestCommand + 4} ${Elements.bottomTopColor.value}_concrete`,
                                Passengers: [
                                    {
                                        id: "minecraft:command_block_minecart",
                                        Silent: 1,
                                        Command: `/fill ~ ~4 ~3 ~ ~${rowAmount + 4} ~${longestCommand + 4} ${Elements.glassColor.value}_stained_glass`,
                                        Passengers: [
                                            {
                                                id: "minecraft:command_block_minecart",
                                                Silent: 1,
                                                Command: `/fill ~2 ~4 ~3 ~2 ~${rowAmount + 3} ~${longestCommand + 4} ${Elements.glassColor.value}_stained_glass`,
                                                Passengers: [
                                                    {
                                                        id: "minecraft:command_block_minecart",
                                                        Silent: 1,
                                                        Command: `/fill ~ ~${rowAmount + 4} ~3 ~2 ~${rowAmount + 4} ~${longestCommand + 4} ${Elements.bottomTopColor.value}_concrete`,
                                                        Passengers: [
                                                            {
                                                                id: `minecraft:command_block_minecart`,
                                                                Silent: 1,
                                                                Command: `/fill ~ ~4 ~3 ~2 ~${rowAmount + 3} ~3 ${Elements.glassColor.value}_stained_glass`,
                                                                Passengers: [
                                                                    {
                                                                        id: "minecraft:command_block_minecart",
                                                                        Silent: 1,
                                                                        Command: `/fill ~ ~4 ~${longestCommand + 4} ~2 ~${rowAmount + 3} ~${longestCommand + 4} ${Elements.glassColor.value}_stained_glass`,
                                                                        Passengers: [
                                                                        // {
                                                                        //     id: "minecraft:command_block_minecart",
                                                                        //     Silent: 1,
                                                                        //     Command: `/setblock ~1 ~4 ~2 ${
                                                                        //         Elements.includeSign.value == "true"
                                                                        //             ? `oak_wall_sign{Text1:\\"[{'text':'','clickEvent':{'action':'run_command','value':'tellraw @p ['',{'text':'Generated with ''},{'text':'[mrdiamond.ml]','color':'blue','clickEvent':{'action':'open_url,'value':'https://mrdiamond.ml/generators/oneblock/'}}]'}},{'text':'[Created with ','bold':true,'color':'dark_green'},{'text':'mrdiamond.ml','bold':true,'color':'blue'},{'text':']','bold':true,'color':'dark_green'}]\\",Text2:\\"{'text':'','clickEvent':{'action':'run_command','value':'fill ~1 ~4 ~ ~-1 ~-1 ~4 air'}}\\",Text3:\\"{'text':''}\\",Text4:\\"{'text':'[Remove Box]','color':'dark_red'}\\"}`
                                                                        //             : "air"
                                                                        //     }`,
                                                                        //     Passengers: [] as any[]
                                                                        // }
                                                                        // TODO: add sign
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                ActiveEffects: [
                    {
                        Id: 14,
                        Amplifier: 1,
                        Duration: 999,
                        ShowParticles: 0
                    },
                    {
                        Id: 20,
                        Amplifier: 255,
                        Duration: 999,
                        ShowParticles: 0
                    }
                ]
            }
        ]
    };
    var passengersHolder = output.Passengers[0].Passengers[0].Passengers[0].Passengers[0].Passengers[0].Passengers[0].Passengers[0].Passengers[0].Passengers;
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        for (var j = 0; j < row.commands.length; j++) {
            var command = row.commands[j];
            var json = {
                id: "minecraft:command_block_minecart",
                Silent: 1,
                Command: `/setblock ~1 ~${row.id + 4} ~${j + 4} ${command.type != CommandType.IMPULSE ? command.type + "_" : ""}command_block[conditional=${command.conditional},facing=south]{Command:'${command.body}',auto:${command.activation === CommandActivation.ALWAYS_ACTIVE ? "1" : "0"}b}`
            };
            passengersHolder.push(json);
        }
    }
    var str = JSON.stringify(output).replace(/\\n/g, "").replace(/\\t/g, "").replace(/\\\\/g, "\\").replace(/\\"/g, '"');
    Elements.output.value = "";
    Elements.output.value = commandBase + str;
    if (Elements.output.value.length > 32767) {
        Elements.output.value = "Your command is too long! Please remove some rows or commands. (Error: " + Elements.output.value.length + " is over 32767 characters)";
    }
}
function render() {
    Elements.commandContainer.innerHTML = "";
    for (var i = 0; i < rows.length; i++) {
        const row = rows[i];
        Elements.commandContainer.appendChild(row.toElement());
        // add event listeners
        var addCommandButton = document.getElementById("add-command-" + i);
        var removeRowButton = document.getElementById("remove-row-" + i);
        if (addCommandButton != null) {
            addCommandButton.addEventListener("click", () => row.addCommand());
        }
        if (removeRowButton != null) {
            removeRowButton.addEventListener("click", () => removeRow(row));
        }
        for (var j = 0; j < row.commands.length; j++) {
            // add event listeners
            var commandId = i + "-" + j;
            const command = row.commands[j];
            var removeCommandButton = document.getElementById("remove-command-" + commandId);
            var commandType = document.getElementById("command-type-" + commandId);
            var commandActivation = document.getElementById("command-activation-" + commandId);
            var commandCondition = document.getElementById("command-conditional-" + commandId);
            var commandBody = document.getElementById("command-text-" + commandId);
            if (removeCommandButton != null)
                removeCommandButton.addEventListener("click", () => row.removeCommand(command));
            if (commandType != null) {
                commandType.value = command.type.toString();
                commandType.addEventListener("change", () => command.updateCommandType(commandType.value));
            }
            if (commandActivation != null) {
                commandActivation.value = command.activation.toString();
                commandActivation.addEventListener("change", () => command.updateCommandActivation(commandActivation.value));
            }
            if (commandCondition != null) {
                commandCondition.value = command.conditional.toString();
                commandCondition.addEventListener("change", () => command.updateCommandConditional(commandCondition.value));
            }
            if (commandBody != null) {
                commandBody.value = command.body;
                commandBody.addEventListener("input", () => command.updateCommandBody(commandBody.value));
            }
        }
    }
}
function addRow() {
    var row = new Row(rows.length);
    rows.push(row);
    render();
    console.log("Added row " + row.id);
}
function removeRow(row) {
    rows.splice(row.id, 1);
    for (var i = 0; i < rows.length; i++) {
        rows[i].id = i;
    }
    render();
    console.log("Removed row " + row.id);
}
class Row {
    constructor(id) {
        this.commands = [];
        this.id = id;
    }
    addCommand() {
        var command = new Command(this, this.commands.length);
        this.commands.push(command);
        render();
        console.log("Added command " + command.id + " to row " + this.id);
        return command;
    }
    getCommand(i) {
        return this.commands[i];
    }
    removeCommand(command) {
        console.log(command);
        this.commands.splice(command.id, 1);
        for (var i = 0; i < this.commands.length; i++) {
            this.commands[i].id = i;
        }
        render();
        console.log("Removed command " + command.id + " from row " + this.id);
    }
    removeCommandIndex(command) {
        this.commands.splice(command, 1);
        for (var i = 0; i < this.commands.length; i++) {
            this.commands[i].id = i;
        }
        render();
        console.log("Removed command " + command + " from row " + this.id);
    }
    toElement() {
        const elem = document.createElement("div");
        elem.className = "field";
        elem.id = "row-" + this.id;
        elem.innerHTML = `
            <h3>Row ${this.id + 1}</h3>
            <div class="commands" id="commands-${this.id}"></div>
            <button class="add-command" id="add-command-${this.id}">Add Command</button>
            <button class="remove-row" id="remove-row-${this.id}">Remove Row</button>
            `;
        const commandsHolder = elem.querySelector(`#commands-${this.id}`);
        for (var i = 0; i < this.commands.length; i++) {
            commandsHolder.appendChild(this.commands[i].toElement());
        }
        return elem;
    }
}
class Command {
    constructor(row, id) {
        this.type = CommandType.IMPULSE;
        this.activation = CommandActivation.POWER;
        this.conditional = false;
        this.body = "";
        this.parentRow = row;
        this.id = id;
    }
    updateCommandType(type) {
        this.type = CommandType[type.toUpperCase()];
    }
    updateCommandActivation(activation) {
        this.activation = CommandActivation[activation.toUpperCase()];
    }
    updateCommandConditional(conditional) {
        this.conditional = conditional == "true";
    }
    updateCommandBody(body) {
        this.body = body;
    }
    toElement() {
        const elem = document.createElement("div");
        elem.className = "field";
        elem.id = "command-" + this.id;
        elem.innerHTML = `
                <h4>Command ${this.id + 1}</h4>
                <select class="command-type" id="command-type-${this.parentRow.id}-${this.id}">
                    <option value="impulse">Impulse</option>
                    <option value="chain">Chain</option>
                    <option value="repeating">Repeating</option>
                </select>
                <select class="command-activation" id="command-activation-${this.parentRow.id}-${this.id}">
                    <option value="power">Needs Power</option>
                    <option value="always_active">Always Active</option>
                </select>
                <select class="command-conditional" id="command-conditional-${this.parentRow.id}-${this.id}">
                    <option value="false">Not Conditional</option>
                    <option value="true">Conditional</option>
                </select>
                <textarea class="command-text" id="command-text-${this.parentRow.id}-${this.id}" placeholder="Command"></textarea>
                <button class="remove-command" id="remove-command-${this.parentRow.id}-${this.id}">Remove Command</button>
        `;
        return elem;
    }
}
var CommandType;
(function (CommandType) {
    CommandType["IMPULSE"] = "impulse";
    CommandType["CHAIN"] = "chain";
    CommandType["REPEATING"] = "repeating";
})(CommandType || (CommandType = {}));
var CommandActivation;
(function (CommandActivation) {
    CommandActivation["POWER"] = "power";
    CommandActivation["ALWAYS_ACTIVE"] = "always_active";
})(CommandActivation || (CommandActivation = {}));
Elements.addRowButton.addEventListener("click", addRow);
Elements.generateButton.addEventListener("click", generate);
