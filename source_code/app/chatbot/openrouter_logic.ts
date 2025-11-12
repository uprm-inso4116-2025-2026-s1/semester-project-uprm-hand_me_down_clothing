import fetch from "node-fetch";
import { stdout } from "process";
import readline from "readline";

const rl= readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

interface ChatResponse {
  response?: string;
  error?: string;
  details?: any;
}

async function sendMessage(message: string){

  try{
    const res= await fetch("https://dev2604.pythonanywhere.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = (await res.json()) as ChatResponse;

    if (data.response) {

      console.log(`🤖 AI: ${data.response}`);
    }

    else{
      console.log(`⚠️ Error: ${JSON.stringify(data)}`);
    }

  } catch (err){
    console.error("Error sending message:", err);
  }

}

function askQuestion(): void {
  rl.question("🧑 You: ", async (input: string) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }
    await sendMessage(input);
    askQuestion();
  });
}


console.log("💬 Chat started! Type 'exit' to quit.");
askQuestion();