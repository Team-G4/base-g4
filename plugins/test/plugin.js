// Just shove a message into the console at launch
plugin.log("Hello, G4!")

plugin.popNotification({
    text: "Hello from plugin land!",

    buttons: [
        {
            text: "Pop another one!",
            callback: () => {
                plugin.popNotification({
                    text: "Hell yeah!"
                })
            }
        }
    ]
})