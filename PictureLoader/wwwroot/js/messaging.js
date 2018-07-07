import * as Dom from "./dom.js"

document.addEventListener("DOMContentLoaded", () => {

    const messagesHub = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Trace)
        .withUrl("/messagehub")
        .build();

    const messages = [];
    
    messagesHub.on("receiveMessage", (user, message) => {
        messages.push(`${user}: ${message}`)
        if (messages.length > 10)
            messages.shift();
        Dom.setMessages(messages);
    });

    messagesHub.start();

    Dom.attachMessageInputListener((message) => {
        messagesHub.send("SendMessage", message);
    });
});