import { useState, useRef, useEffect } from "react";

// ==== الجزء الوحيد اللي هيتغير بعدين حسب رد الباك اند ====
// دلوقتي شكلها "وهمية" (mock) عشان تقدري تجربي الصفحة وهي شغالة
// وبعدين لما الباك يرد، هنعدّل جوه الدالة دي بس ونحط axios.post أو fetch الحقيقي
// كل باقي الصفحة (الرسائل، العرض، الـ state) مش هيتلمس خالص
async function sendMessageToBot(userMessage) {
  // مثال لما تيجي تربطيها بالباك اند لاحقًا:
  // const res = await axios.post(`${baseUrl}/api/chatbot`, { message: userMessage });
  // return res.data.reply;

  // رد وهمي مؤقت عشان نجرب الواجهة
  await new Promise((resolve) => setTimeout(resolve, 800)); // محاكاة وقت الرد
  return `استلمت رسالتك: "${userMessage}" (رد تجريبي لحد ما نربط الموديل)`;
}
// ==========================================================

function Chatbot() {
  // كل رسالة عبارة عن { sender: "user" | "bot", text: "..." }
  const [messages, setMessages] = useState([
    { sender: "bot", text: "أهلًا! أنا المساعد الذكي بتاع الغول، اسأليني عن أي حاجة." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ref عشان نعمل scroll تلقائي لآخر رسالة كل ما رسالة جديدة تتضاف
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return; // منع إرسال رسالة فاضية أو إرسال مزدوج وقت التحميل

    // نضيف رسالة اليوزر فورًا في الواجهة
    const userMessage = { sender: "user", text: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const botReply = await sendMessageToBot(trimmedInput);
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "حصل خطأ، حاولي تاني." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4 d-flex flex-column" style={{ height: "80vh" }}>
      <h2 className="text-center mb-3">
        <i className="fa-solid fa-robot main-color"></i> المساعد الذكي
      </h2>

      {/* منطقة الرسائل */}
      <div className="flex-grow-1 overflow-auto p-2 border rounded-3 mb-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-2 ${
              msg.sender === "user" ? "justify-content-start" : "justify-content-end"
            }`}
          >
            <div
              className={`p-2 rounded-3 ${
                msg.sender === "user" ? "bg-main text-white" : "bg-light"
              }`}
              style={{ maxWidth: "75%" }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="d-flex justify-content-end mb-2">
            <div className="p-2 rounded-3 bg-light">...بيكتب</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* فورم إرسال الرسالة */}
      <form onSubmit={handleSend} className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="اكتبي سؤالك هنا..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="btn btn-main" disabled={isLoading}>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
