import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User } from "lucide-react";
import { apiService } from "@/services/api";
import type { DBMessage } from "@/types/db";

const Index = () => {
  const [messages, setMessages] = useState<DBMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await apiService.getMessages();
        setMessages(savedMessages);
        console.log("Messages loaded successfully:", savedMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      }
    };
    loadMessages();
  }, [toast]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Save user message
      console.log("Attempting to send user message:", inputMessage);
      const userMessage = await apiService.saveMessage(inputMessage, false);
      console.log("User message saved successfully:", userMessage);
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");

      // Generate bot response based on user query
      const botResponse = await generateBotResponse(inputMessage);
      console.log("Bot response generated:", botResponse);
      
      // Save bot response
      console.log("Attempting to save bot response");
      const botMessage = await apiService.saveMessage(botResponse, true);
      console.log("Bot message saved successfully:", botMessage);
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Detailed error in message handling:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! How can I help you today?";
    } else if (lowerMessage.includes("help")) {
      return "I can help you with basic queries. Just type your question!";
    } else if (lowerMessage.includes("bye")) {
      return "Goodbye! Have a great day!";
    } else {
      return "I understand you said: " + userMessage + ". How can I assist you further?";
    }
  };

  return (
    <div className="min-h-screen p-4 bg-background">
      <Card className="max-w-2xl mx-auto h-[80vh] flex flex-col">
        <CardContent className="flex-1 p-4 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[80%] ${
                      message.isBot
                        ? "flex-row"
                        : "flex-row-reverse"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      message.isBot
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}>
                      {message.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.isBot
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;