import { ChatbotInterface } from "@/components/ai/chatbot";

export default function ChatbotPage() {
  return (
    <div className="space-y-6 h-full">
       <div className="h-full flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">AI Chatbot</h2>
            <p className="text-muted-foreground mb-4">Your 24/7 AI assistant for doubt-solving and instant support.</p>
            <ChatbotInterface />
        </div>
    </div>
  );
}
