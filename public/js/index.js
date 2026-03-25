    const form = document.getElementById("askForm");
    const outputDiv = document.querySelector(".output");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // 🚫 stop page reload

        const text = document.getElementById("comments").value;

        // show loading
        outputDiv.innerText = "Thinking... 🤔";

        try {
            const res = await fetch("/api/ask-ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ comments: text })
            });

            const data = await res.json();

            // show answer
            outputDiv.innerText = data.answer;

        } catch (err) {
            outputDiv.innerText = "Error ❌";
            console.log(err);
        }
    });
