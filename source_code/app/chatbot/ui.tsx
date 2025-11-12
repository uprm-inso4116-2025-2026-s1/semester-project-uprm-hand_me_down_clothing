"use client";
import { useState } from "react";
import Image from "next/image";
import icon from "./sleevy-chat-icon.jpg";
import ChatBox from "./chatbox-behavior";

export default function ChatWidget() {
	const [open, setOpen] = useState(false);

	return (
		<div className="fixed bottom-6 right-6 z-50">
			<button
				aria-label={open ? "Close chat" : "Open chat"}
				onClick={() => setOpen((s) => !s)}
				className="w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-white bg-white flex items-center justify-center"
			>
				<Image src={icon} alt="Chat icon" className="object-cover" width={56} height={56} />
			</button>

			{open && <ChatBox onClose={() => setOpen(false)} />}
		</div>
	);
}
