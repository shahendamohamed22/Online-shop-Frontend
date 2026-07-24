import { useState, useRef, useEffect } from "react";
import { chat } from "../services/googleGemini";


const STORAGE_KEY = "chatbot_messages";

function Chatbot() {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to load saved chat:", error);
            return [];
        }
    });
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (error) {
            console.error("Failed to save chat:", error);
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMessage = input;

        setMessages((prev) => [
            ...prev,
            { role: "user", text: userMessage },
        ]);

        setInput("");
        setLoading(true);

        try {
            const response = await chat.sendMessage({
                message: userMessage,
            });

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: response.text,
                },
            ]);
        } catch (error) {
            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: "حدث خطأ، حاول مرة أخرى.",
                },
            ]);
        } finally {
            setLoading(false);
        };
    }
    return (
        <div className="container w-100 mx-auto d-flex flex-column" style={{ height: "calc(90vh - 140px - var(--bottom-nav-height))", maxWidth: "700px" }}>
            <div className="bg-main text-white rounded-3 p-3 mb-3 d-flex align-items-center gap-3  justify-content-between">
                <div className="d-flex align-items-center gap-2 gap-md-3">
                    <i className="fa-solid fa-robot fs-3"></i>
                    <div>
                        <h5 className="m-0">المساعد الذكي</h5>
                        <small>اسألني عن المنتجات والعروض والفروع</small>
                    </div>
                </div>
            </div>

            <div className="flex-grow-1 overflow-auto p-3 border border-2 rounded-3 mb-3">

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`d-flex mb-3 ${msg.role === "user"
                            ? "justify-content-start"
                            : "justify-content-end"
                            }`}
                    >
                        <div
                            className={`p-2 rounded-3 ${msg.role === "user"
                                ? "bg-success fw-semibold text-white"
                                : "bg-light fw-semibold"
                                }`}
                            style={{ maxWidth: "75%" }}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="d-flex justify-content-end">
                        <div className="bg-light fw-semibold rounded-3 p-2">
                            ...بيكتب
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="d-flex gap-2 mt-2">
                <button
                    className="btn btn-success p-3"
                    type="submit"
                    disabled={loading}
                >
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
                <input
                    className="form-control p-2 rounded-3 border-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتبي سؤالك..."
                    disabled={loading}
                />
            </form>
        </div>
    );

}

export default Chatbot;