const messagesElement = document.getElementById("messages");
const messagesListElement = messagesElement.querySelector(".list");
const messagesInputElement = messagesElement.querySelector(".input");

function createDivWithContent(content) {
    const div = document.createElement("div");
    div.innerText = content;
    return div;
}

export function setMessages(messages) {

    while (messagesListElement.firstChild)
        messagesListElement.removeChild(messagesListElement.firstChild);

    messages
        .map(m => createDivWithContent(m))
        .forEach(m => messagesListElement.appendChild(m)); 
}

export function attachMessageInputListener(listener) {
    messagesInputElement.addEventListener("keypress", e => {
        if (e.key == "Enter") {
            e.preventDefault();

            const text = e.target.value.trim();
            if (text) {
                listener(e.target.value);
                e.target.value = "";
            }
        }
    });
}