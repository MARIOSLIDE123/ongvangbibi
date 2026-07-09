import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Sparkles,
  BookOpen,
  Compass,
  Trophy,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Volume2,
  Lock,
  ChevronRight,
  AlertCircle,
  Check,
  Send,
  Info,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { BiBiBee } from "./components/BiBiBee";
import { FLOWER_PARTS, FLOWER_GAME_ITEMS, LESSON_STAGES, INITIAL_ACHIEVEMENTS } from "./data";
import { Message, Achievement, FlowerGameItem } from "./types";

export default function App() {
  // Current active learning stage (1, 2, or 3)
  const [currentStage, setCurrentStage] = useState<number>(1);

  // Stage 1: Matching Game State
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [solvedParts, setSolvedParts] = useState<string[]>([]);
  const [wrongGuessId, setWrongGuessId] = useState<string | null>(null);
  const [stage1Feedback, setStage1Feedback] = useState<string | null>(null);

  // Stage 2: Classification Game State (Enhanced)
  const [gameItems, setGameItems] = useState<FlowerGameItem[]>(FLOWER_GAME_ITEMS);
  const [gameIndex, setGameIndex] = useState<number>(0);
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [gameAnswers, setGameAnswers] = useState<Array<{ item: FlowerGameItem; isCorrect: boolean; userChoice: "luong_tinh" | "don_tinh" }>>([]);
  const [currentFeedback, setCurrentFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [tossingTo, setTossingTo] = useState<"luong_tinh" | "don_tinh" | null>(null);
  const [basketBounce, setBasketBounce] = useState<"luong_tinh" | "don_tinh" | null>(null);

  // Stage 3: Pollination Game State (Sequencing & Simulation)
  const [stage3SubStage, setStage3SubStage] = useState<"sequencing" | "simulation">("sequencing");
  const [scrambledSteps, setScrambledSteps] = useState<Array<{ id: number; title: string; short: string; description: string }>>([]);
  const [sequencingFeedback, setSequencingFeedback] = useState<string | null>(null);
  
  // Simulation states
  const [beePosition, setBeePosition] = useState<"center" | "stamen" | "pistil">("center");
  const [hasPollen, setHasPollen] = useState<boolean>(false);
  const [isFruitGrown, setIsFruitGrown] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(1);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  // Chatbot State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Chào mừng bạn nhỏ đến với Vườn Hoa Khoa Học của BiBi! 🐝🌸 Hôm nay, chúng mình sẽ cùng nhau khám phá một bí mật cực kỳ kỳ diệu: **'Sinh sản của thực vật có hoa'** qua các trò chơi tương tác thú vị.\n\nBiBi sẽ đồng hành cùng bạn nhỏ vượt qua **3 Chặng thử thách** đầy bất ngờ. Bạn có muốn đố BiBi điều gì không nè? ✨",
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [beeExpression, setBeeExpression] = useState<"happy" | "thinking" | "speaking" | "normal">("normal");
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Define Stage 3 steps data
  const STAGE3_STEPS_DATA = [
    {
      id: 1,
      title: "1. Sự thụ phấn",
      short: "Hạt phấn từ nhị dính vào đầu nhụy",
      description: "Hạt phấn vàng chín rơi từ bao phấn của nhị bay theo gió, hoặc bám vào cơ thể ong BiBi mang sang dính trên đầu nhụy cái dính dính.",
    },
    {
      id: 2,
      title: "2. Sự thụ tinh",
      short: "Nảy mầm tạo thành hợp tử ở noãn",
      description: "Tại đầu nhụy, hạt phấn nảy mầm vươn ra ống phấn dài đi xuyên qua vòi nhụy đi sâu vào bầu nhụy để kết hợp với noãn tạo thành Hợp tử.",
    },
    {
      id: 3,
      title: "3. Tạo hạt và quả",
      short: "Hoa tàn nhường chỗ quả ngọt",
      description: "Sau khi thụ tinh, các cánh hoa héo rụng đi. Bầu nhụy lớn nhanh như thổi phát triển thành Quả, còn noãn thành Hạt chứa phôi mầm cây con.",
    },
  ];

  // Stage 3 Initialization and scrambler
  useEffect(() => {
    if (currentStage === 3) {
      const shuffled = [...STAGE3_STEPS_DATA].sort(() => Math.random() - 0.5);
      // Ensure it is actually shuffled
      if (shuffled[0].id === 1 && shuffled[1].id === 2 && shuffled[2].id === 3) {
        const tmp = shuffled[0];
        shuffled[0] = shuffled[1];
        shuffled[1] = tmp;
      }
      setScrambledSteps(shuffled);
      setSequencingFeedback(null);
      setStage3SubStage("sequencing");
      setBeePosition("center");
      setHasPollen(false);
      setIsFruitGrown(false);
      setSimulationStep(1);
    }
  }, [currentStage]);

  // Scroll to bottom on chat messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Unlock achievements helper
  const unlockAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === id && !ach.unlocked) {
          // Speak / trigger expression
          setBeeExpression("happy");
          setTimeout(() => setBeeExpression("normal"), 4000);
          return { ...ach, unlocked: true };
        }
        return ach;
      })
    );
  };

  // Stage 1 hotspot click handler
  const handleHotspotClick = (id: string) => {
    if (solvedParts.includes(id)) {
      const part = FLOWER_PARTS.find(p => p.id === id);
      setStage1Feedback(`Đây là ${part?.vietnameseName}! Bạn đã giải đúng bộ phận này rồi: ${part?.kidsExplanation}`);
      setBeeExpression("speaking");
      setTimeout(() => setBeeExpression("normal"), 2000);
      return;
    }
    setActiveHotspotId(id);
    setWrongGuessId(null);
    setStage1Feedback(null);
    setBeeExpression("thinking");
    setTimeout(() => setBeeExpression("normal"), 1000);
  };

  // Stage 1 guess submission handler
  const handleStage1Guess = (chosenId: string) => {
    if (!activeHotspotId) return;

    const isCorrect = chosenId === activeHotspotId;
    const part = FLOWER_PARTS.find((p) => p.id === activeHotspotId);

    if (isCorrect) {
      const updatedSolved = [...solvedParts, chosenId];
      setSolvedParts(updatedSolved);
      setBeeExpression("happy");
      setStage1Feedback(`Chính xác luôn! 🎉 ${part?.vietnameseName}: ${part?.kidsExplanation}`);
      setActiveHotspotId(null);
      setWrongGuessId(null);

      if (updatedSolved.length === FLOWER_PARTS.length) {
        unlockAchievement("explorer");
      }
    } else {
      setWrongGuessId(chosenId);
      setBeeExpression("thinking");
      setStage1Feedback(`Chưa chính xác rồi bé ơi! Hãy nhớ lại gợi ý: ${part?.kidsExplanation}`);
      setTimeout(() => {
        setWrongGuessId(null);
      }, 1000);
    }
  };

  // Stage 2 game choice handler
  const handleGameChoice = (choice: "luong_tinh" | "don_tinh") => {
    if (currentFeedback || tossingTo) return; 

    const currentItem = gameItems[gameIndex];
    const isCorrect = currentItem.type === choice;

    // Trigger tossing and bounce animation
    setTossingTo(choice);
    setBasketBounce(choice);

    if (isCorrect) {
      setGameScore((prev) => prev + 1);
      setStreakCount((prev) => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
      setBeeExpression("happy");
      setCurrentFeedback({
        isCorrect: true,
        text: `Đúng rồi! Tuyệt vời quá bạn ơi! 🎉 ${currentItem.explanation}`,
      });
    } else {
      setStreakCount(0);
      setBeeExpression("thinking");
      setCurrentFeedback({
        isCorrect: false,
        text: `Ôi gần đúng rồi nè! Bạn nhỏ thử suy nghĩ lại xem nhé: ${currentItem.description}. ${currentItem.explanation}`,
      });
    }

    setGameAnswers((prev) => [...prev, { item: currentItem, isCorrect, userChoice: choice }]);

    // Move to next item after 3.5 seconds (snappier transition)
    setTimeout(() => {
      setCurrentFeedback(null);
      setTossingTo(null);
      setBasketBounce(null);
      if (gameIndex < gameItems.length - 1) {
        setGameIndex((prev) => prev + 1);
        setBeeExpression("normal");
      } else {
        setGameFinished(true);
        unlockAchievement("sorter");
        setBeeExpression("happy");
      }
    }, 3800);
  };

  const restartGame = () => {
    setGameIndex(0);
    setGameScore(0);
    setGameFinished(false);
    setGameAnswers([]);
    setCurrentFeedback(null);
    setStreakCount(0);
    setTossingTo(null);
    setBasketBounce(null);
    setBeeExpression("normal");
  };

  // Stage 3 Sequencing mechanics
  const handleMoveStep = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= scrambledSteps.length) return;
    const newSteps = [...scrambledSteps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[nextIndex];
    newSteps[nextIndex] = temp;
    setScrambledSteps(newSteps);
    setSequencingFeedback(null);
  };

  const handleCheckSequencing = () => {
    const isCorrect = scrambledSteps.every((step, index) => step.id === index + 1);
    if (isCorrect) {
      setBeeExpression("happy");
      setSequencingFeedback("Tuyệt cú mèo! 🌟 Bé đã sắp xếp quy trình thụ phấn - thụ tinh - tạo quả hoàn toàn chính xác! Bây giờ, hãy giúp chú ong BiBi thực hiện một chuyến thụ phấn thực tế nhé!");
      setTimeout(() => {
        setStage3SubStage("simulation");
        setSequencingFeedback(null);
      }, 3500);
    } else {
      setBeeExpression("thinking");
      setSequencingFeedback("Chưa chính xác rồi bé ơi! Hãy nhớ trình tự chuẩn: Hạt phấn phải bay đến nhụy trước (Thụ phấn), rồi chui sâu thụ tinh tạo hợp tử (Thụ tinh), rồi mới thành quả ngọt mọng nước (Tạo hạt & quả). Bé thử hoán đổi lại xem!");
    }
  };

  // Stage 3 Simulation mechanics
  const handleBeeAction = (action: "collect" | "pollinate") => {
    if (action === "collect") {
      setBeePosition("stamen");
      setBeeExpression("happy");
      setTimeout(() => {
        setHasPollen(true);
        setSimulationStep(2);
        setBeeExpression("normal");
      }, 1200);
    } else if (action === "pollinate" && hasPollen) {
      setBeePosition("pistil");
      setBeeExpression("happy");
      setTimeout(() => {
        setHasPollen(false);
        setIsFruitGrown(true);
        setSimulationStep(3);
        unlockAchievement("graduated");
        setBeeExpression("happy");
      }, 1200);
    }
  };

  const restartSimulation = () => {
    setBeePosition("center");
    setHasPollen(false);
    setIsFruitGrown(false);
    setSimulationStep(1);
    setStage3SubStage("sequencing");
    // Re-shuffle steps
    const shuffled = [...STAGE3_STEPS_DATA].sort(() => Math.random() - 0.5);
    if (shuffled[0].id === 1 && shuffled[1].id === 2 && shuffled[2].id === 3) {
      const tmp = shuffled[0];
      shuffled[0] = shuffled[1];
      shuffled[1] = tmp;
    }
    setScrambledSteps(shuffled);
    setSequencingFeedback(null);
  };

  // Handle chat submission to server
  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim() || isSending) return;

    // Track chatter achievement
    unlockAchievement("chatter");

    const userMessageId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMessageId,
      role: "user",
      content: messageText,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsSending(true);
    setBeeExpression("thinking");
    setApiKeyError(null);

    try {
      const historyToSend = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyToSend,
          currentStage: currentStage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "API_KEY_MISSING") {
          setApiKeyError(data.message);
          // Fallback static intelligent answer so the student is not blocked!
          generateFallbackResponse(messageText);
          return;
        }
        throw new Error(data.message || "Failed to call chat API");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bibi-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setBeeExpression("speaking");
      setTimeout(() => setBeeExpression("normal"), 2000);
    } catch (err: any) {
      console.error("Error communicating with BiBi:", err);
      // Generate standard kid-friendly answer offline if connection or server fails
      generateFallbackResponse(messageText);
    } finally {
      setIsSending(false);
    }
  };

  // Local fallback response engine based on Grade 5 curriculum & prompt rules
  const generateFallbackResponse = (userQuery: string) => {
    const query = userQuery.toLowerCase();
    let reply = "";

    if (query.includes("nhị") || query.includes("stamen")) {
      reply = `Chào bạn nhỏ! 🐝 Bạn đang thắc mắc về **Nhị hoa** đúng không nào?

Hãy tưởng tượng nhé:
* **Nhị:** Là bộ phận chứa các hạt phấn vàng li ti dính trên bao phấn (giống như các chàng trai mang đầy những món quà bụi vàng lấp lánh vậy).
* **Nhiệm vụ:** Khi hạt phấn chín, chúng sẽ bay theo gió hoặc nhờ BiBi đem sang gõ cửa nhà Nhụy hoa đấy!

Đố bạn nhỏ biết, hạt phấn chín thì có màu gì lấp lánh nhỉ? 🌸
Cùng BiBi học vui mỗi ngày! 🐝`;
    } else if (query.includes("nhụy") || query.includes("pistil")) {
      reply = `Ôi tuyệt quá, bạn nhỏ quan tâm đến **Nhụy hoa** xinh xắn này! 🌸

Nhụy hoa rất đặc biệt:
* **Nhụy:** Thường nằm kiêu hãnh ở chính giữa bông hoa, có chất dính ở đầu để giữ hạt phấn rơi vào.
* **Bên trong nhụy:** Có bầu nhụy ấm áp chứa các noãn nhỏ xíu. Sau khi được thụ tinh, bầu nhụy sẽ lớn thành quả ngọt, còn noãn sẽ biến thành những hạt giống bé nhỏ để mọc lên cây mới đấy!

Đố bạn nhụy hoa bưởi nằm ở vị trí nào của bông hoa nhỉ? 🌻
Cùng BiBi bay cao, học mau nhớ lâu! 🐝`;
    } else if (query.includes("lưỡng tính") || query.includes("lưỡng")) {
      reply = `Đúng rồi bạn nhỏ ơi! 🌸 **Hoa lưỡng tính** là những bông hoa cực kỳ đầy đủ và tự lập!

* **Đặc điểm:** Trên cùng một bông hoa có cả **nhị (đực)** và **nhụy (cái)** luôn đó!
* **Ví dụ:** Hoa bưởi thơm ngát, hoa dâm bụt đỏ rực, hoa cải vàng hay hoa phượng đỏ thắm dưới sân trường.

Đố bạn nhỏ tìm thêm xung quanh nhà một loài hoa lưỡng tính nào khác nữa xem sao? 🐝
Cùng BiBi bay cao, học mau nhớ lâu! 🐝`;
    } else if (query.includes("đơn tính") || query.includes("đơn")) {
      reply = `A! Một kiến thức rất thú vị đây! 🌼 **Hoa đơn tính** là những bông hoa thích chia sẻ nhiệm vụ cho nhau!

* **Đặc điểm:** Một bông hoa chỉ có thể là **hoa đực (chỉ có nhị)** hoặc **hoa cái (chỉ có nhụy)** chứ không có cả hai đâu nha!
* **Ví dụ điển hình:** Hoa mướp, hoa bí ngô, hoa bầu, hoa dưa chuột.

Bạn nhỏ có biết bông hoa cái ở cuống hoa thường dính kèm một quả nhỏ xíu xinh xắn không? Đó là bầu nhụy đang chờ thụ phấn đấy! 🥒
Cùng BiBi bay cao, học mau nhớ lâu! 🐝`;
    } else if (query.includes("thụ phấn") || query.includes("thụ tinh") || query.includes("sinh sản")) {
      reply = `Ồ, bạn nhỏ đang hỏi về **Quá trình sinh sản kỳ diệu** của cây xanh! 🌟

Quá trình này diễn ra như thế này nè:
1. **Sự thụ phấn:** Hạt phấn từ bao phấn của nhị bay sang đậu trên đầu nhụy nhờ gió thổi hoặc nhờ các bạn ong như BiBi mang đi.
2. **Sự thụ tinh:** Hạt phấn nảy mầm, mọc ra ống phấn đi sâu vào bầu nhụy để gặp tế bào noãn.
3. **Tạo quả và hạt:** Sau khi thụ tinh xong, hoa sẽ héo, cánh hoa rụng đi. Bầu nhụy lớn dần lên thành quả ngon, còn noãn thành hạt giống!

Đố nhà khoa học nhí, quả mướp chúng mình ăn hàng ngày được phát triển từ bộ phận nào của hoa mướp cái nhỉ? 🐝
Cùng BiBi bay cao, học mau nhớ lâu! 🐝`;
    } else {
      reply = `Ôi tuyệt quá! 🐝 Câu hỏi của bạn nhỏ thật sự khiến BiBi vô cùng hào hứng!

Về chủ đề **Sinh sản của thực vật có hoa**:
* Bạn nhỏ có thể thử nhấp vào mô hình hoa ở bên trái để khám phá các bộ phận Nhị, Nhụy, Cánh hoa và Đài hoa nhé!
* Hoặc chuyển sang **Chặng 2** để cùng BiBi chơi trò chơi phân loại các loài hoa cực vui nha!

Đố bạn biết loài hoa nào thường mang hương thơm dịu mát gọi Ong vàng đến lấy mật nhiều nhất nhỉ? 🌻
Cùng BiBi bay cao, học mau nhớ lâu! 🐝`;
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bibi-local-${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setBeeExpression("speaking");
      setTimeout(() => setBeeExpression("normal"), 2000);
    }, 800);
  };

  const handleQuickQuestion = (questionText: string) => {
    handleSendMessage(questionText);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#2c251e] flex flex-col selection:bg-[#fef08a]" id="app-root-container">
      {/* Header Bar */}
      <header className="bg-white border-b-2 border-[#eae4cd] px-4 py-3 sticky top-0 z-40" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#fef08a] rounded-full border-2 border-[#d49a2a] animate-bounce-slow">
              <span className="text-2xl">🐝</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-[#1e293b] flex items-center gap-1.5">
                Chú Ong Vàng BiBi
                <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 font-medium px-2 py-0.5 rounded-full">
                  Khoa học Lớp 5
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Sách Kết nối tri thức - Bài 13: Sinh sản của thực vật có hoa (Tiết 1)
              </p>
            </div>
          </div>

          {/* Quick Learning Stats / Milestones */}
          <div className="flex items-center gap-2">
            <div className="bg-[#fefcbf] border border-[#fef08a] rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-amber-800">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" />
              <span>Chặng {currentStage}/3</span>
            </div>
            <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Trophy className="w-4 h-4 text-emerald-600" />
              <span>
                Thành tích: {achievements.filter((a) => a.unlocked).length}/{achievements.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5" id="main-content-layout">
        
        {/* LEFT COLUMN: Learn & Interact Interactive Area (7 columns) */}
        <section className="lg:col-span-7 flex flex-col gap-4" id="learning-workspace-section">
          
          {/* Top Roadmap / Stage Selector */}
          <div className="bg-white rounded-2xl p-4 border-2 border-[#eae4cd] play-card" id="lesson-roadmap">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#fbbf24]" />
              Lộ trình bài học Khoa học của bé
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {LESSON_STAGES.map((stage) => {
                const isActive = currentStage === stage.id;
                const isCompleted = currentStage > stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => {
                      setCurrentStage(stage.id);
                      setBeeExpression("happy");
                      setTimeout(() => setBeeExpression("normal"), 1500);
                    }}
                    className={`relative p-2.5 rounded-xl border-2 text-left transition-all duration-300 group ${
                      isActive
                        ? "border-[#fbbf24] bg-amber-50/70 shadow-sm"
                        : isCompleted
                        ? "border-emerald-300 bg-emerald-50/50"
                        : "border-[#f1ece1] bg-slate-50 opacity-70 hover:opacity-100"
                    }`}
                    id={`roadmap-stage-btn-${stage.id}`}
                  >
                    {isCompleted && (
                      <span className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Chặng {stage.id}
                    </span>
                    <span className={`block text-xs font-bold leading-tight mt-0.5 ${isActive ? "text-amber-900" : isCompleted ? "text-emerald-950" : "text-slate-600"}`}>
                      {stage.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Active Stage Quick Info banner */}
            <div className="mt-3 p-3 bg-[#faf9f3] rounded-xl border border-[#ece7d5] flex items-start gap-2.5">
              <div className="p-1 bg-white rounded-lg border border-[#e5dfc3] shadow-sm text-lg mt-0.5">
                {currentStage === 1 ? "🔬" : currentStage === 2 ? "🐝" : "🌱"}
              </div>
              <div>
                <p className="text-xs font-bold text-[#453c30]">
                  {LESSON_STAGES[currentStage - 1].title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {LESSON_STAGES[currentStage - 1].description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl p-4 sm:p-6 border-2 border-[#eae4cd] play-card flex flex-col justify-between min-h-[460px]" id="interactive-workspace-container">
            
            {/* CHẶNG 1: THỬ THÁCH GHÉP TÊN BỘ PHẬN HOA */}
            {currentStage === 1 && (
              <div className="flex-1 flex flex-col justify-between" id="stage1-anatomy-workspace">
                <div className="text-center mb-4">
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Ghép Nhãn Bộ Phận 🔬
                  </span>
                  <h3 className="text-lg font-bold text-[#1e293b] mt-1.5">
                    Thử Thách: Thiết Kế Hoa Học Nhí
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click vào các vòng tròn dấu hỏi <strong className="text-amber-600 font-bold">?</strong> trên hoa và đoán xem đó là bộ phận nào nhé!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-auto">
                  
                  {/* Left Column: Visual Flower drawing with interactive hotspots */}
                  <div className="md:col-span-6 flex justify-center relative select-none">
                    <div className="relative w-64 h-64 bg-[#fbfbfa] rounded-full border border-dashed border-[#e3dac1] flex items-center justify-center">
                      
                      {/* SVG Vector Flower drawing */}
                      <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-sm">
                        {/* Pedicel / Cuống hoa */}
                        <path d="M50,75 L50,95" stroke="#22c55e" strokeWidth="5.5" strokeLinecap="round" />
                        <path d="M50,78 Q42,88 35,90" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                        {/* Sepal / Đài hoa */}
                        <path d="M38,72 Q50,82 62,72 C58,78 42,78 38,72 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
                        <path d="M47,74 L40,65 Q50,72 60,65 L53,74 Z" fill="#4ade80" />

                        {/* Petals / Cánh hoa (5 petals) */}
                        <g fill="#c084fc" stroke="#8b5cf6" strokeWidth="1.5">
                          {/* Bottom Left Petal */}
                          <path d="M50,65 C32,68 25,50 40,42 C45,48 48,58 50,65 Z" fill="#d8b4fe" />
                          {/* Bottom Right Petal */}
                          <path d="M50,65 C68,68 75,50 60,42 C55,48 52,58 50,65 Z" fill="#d8b4fe" />
                          {/* Top Left Petal */}
                          <path d="M50,65 C30,42 42,24 50,42 C48,48 48,58 50,65 Z" fill="#e9d5ff" />
                          {/* Top Right Petal */}
                          <path d="M50,65 C70,42 58,24 50,42 C52,48 52,58 50,65 Z" fill="#e9d5ff" />
                          {/* Central bottom petal */}
                          <path d="M50,65 C38,82 62,82 50,65 Z" fill="#f3e8ff" />
                        </g>

                        {/* Pistil / Nhụy hoa (Central) */}
                        <g>
                          {/* Ovary / Bầu nhụy */}
                          <ellipse cx="50" cy="62" rx="8" ry="10" fill="#86efac" stroke="#15803d" strokeWidth="1.5" />
                          {/* Ovules / Noãn */}
                          <circle cx="48" cy="60" r="1.5" fill="#fef08a" />
                          <circle cx="52" cy="60" r="1.5" fill="#fef08a" />
                          <circle cx="49" cy="64" r="1.5" fill="#fef08a" />
                          <circle cx="53" cy="63" r="1.5" fill="#fef08a" />
                          
                          {/* Style / Vòi nhụy */}
                          <path d="M50,52 L50,32" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Stigma / Đầu nhụy sticky top */}
                          <circle cx="50" cy="30" r="3.5" fill="#f43f5e" stroke="#be123c" strokeWidth="1.5" />
                        </g>

                        {/* Stamens / Nhị hoa (Left & Right) */}
                        <g stroke="#b45309" strokeWidth="1.5" fill="none">
                          {/* Filament / Chỉ nhị left 1 */}
                          <path d="M44,62 Q35,50 38,36" />
                          {/* Filament / Chỉ nhị left 2 */}
                          <path d="M46,62 Q30,58 32,46" />
                          
                          {/* Filament / Chỉ nhị right 1 */}
                          <path d="M56,62 Q65,50 62,36" />
                          {/* Filament / Chỉ nhị right 2 */}
                          <path d="M54,62 Q70,58 68,46" />
                        </g>
                        
                        {/* Anthers / Bao phấn containing pollen grains */}
                        <g fill="#f59e0b" stroke="#b45309" strokeWidth="1">
                          <ellipse cx="38" cy="35" rx="2" ry="3" transform="rotate(-15, 38, 35)" />
                          <ellipse cx="32" cy="45" rx="2" ry="3" transform="rotate(-35, 32, 45)" />
                          <ellipse cx="62" cy="35" rx="2" ry="3" transform="rotate(15, 62, 35)" />
                          <ellipse cx="68" cy="45" rx="2" ry="3" transform="rotate(35, 68, 45)" />
                        </g>
                      </svg>

                      {/* Interactive HOTSPOTS (Click to guess) */}
                      {/* 1. Nhụy hoa (Middle) */}
                      <button
                        onClick={() => handleHotspotClick("nhuy")}
                        className="absolute top-[24%] left-[49%] transform -translate-x-1/2 -translate-y-1/2 group z-10 transition-all duration-300"
                        title="Đoán Nhụy hoa"
                      >
                        {solvedParts.includes("nhuy") ? (
                          <div className="relative flex items-center justify-center">
                            <span className="relative inline-flex rounded-full h-6 w-6 border-2 border-white items-center justify-center text-xs font-bold text-white shadow-md bg-rose-500 animate-pulse">
                              ✓
                            </span>
                            <span className="absolute left-8 bg-rose-50 border border-rose-200 text-rose-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                              Nhụy hoa
                            </span>
                          </div>
                        ) : (
                          <>
                            <span className={`absolute inline-flex h-6 w-6 rounded-full bg-rose-400 opacity-75 ${activeHotspotId === "nhuy" ? "animate-ping" : "animate-pulse"}`}></span>
                            <span className={`relative inline-flex rounded-full h-5 w-5 border-2 border-white items-center justify-center text-xs font-bold text-white shadow-md ${activeHotspotId === "nhuy" ? "bg-rose-600 scale-125 ring-2 ring-rose-400" : "bg-slate-400 hover:bg-rose-400"}`}>
                              ?
                            </span>
                          </>
                        )}
                      </button>

                      {/* 2. Nhị hoa (Amber) */}
                      <button
                        onClick={() => handleHotspotClick("nhi")}
                        className="absolute top-[28%] left-[34%] transform -translate-x-1/2 -translate-y-1/2 group z-10 transition-all duration-300"
                        title="Đoán Nhị hoa"
                      >
                        {solvedParts.includes("nhi") ? (
                          <div className="relative flex items-center justify-center">
                            <span className="relative inline-flex rounded-full h-6 w-6 border-2 border-white items-center justify-center text-xs font-bold text-white shadow-md bg-amber-500 animate-pulse">
                              ✓
                            </span>
                            <span className="absolute right-8 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                              Nhị hoa
                            </span>
                          </div>
                        ) : (
                          <>
                            <span className={`absolute inline-flex h-6 w-6 rounded-full bg-amber-400 opacity-75 ${activeHotspotId === "nhi" ? "animate-ping" : "animate-pulse"}`}></span>
                            <span className={`relative inline-flex rounded-full h-5 w-5 border-2 border-white items-center justify-center text-xs font-bold text-white shadow-md ${activeHotspotId === "nhi" ? "bg-amber-600 scale-125 ring-2 ring-amber-400" : "bg-slate-400 hover:bg-amber-400"}`}>
                              ?
                            </span>
                          </>
                        )}
                      </button>

                      {/* 3. Cánh hoa (Purple) */}
                      <button
                        onClick={() => handleHotspotClick("canh_hoa")}
                        className="absolute top-[48%] left-[22%] transform -translate-x-1/2 -translate-y-1/2 group z-10 transition-all duration-300"
                        title="Đoán Cánh hoa"
                      >
                        {solvedParts.includes("canh_hoa") ? (
                          <div className="relative flex items-center justify-center">
                            <span className="relative inline-flex rounded-full h-6 w-6 border-2 border-white items-center justify-center text-xs font-bold text-white shadow-md bg-purple-500 animate-pulse">
                              ✓
                            </span>
                            <span className="absolute right-8 bg-purple-50 border border-purple-200 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                              Cánh hoa
                            </span>
                          </div>
                        ) : (
                          <>
                            <span className={`absolute inline-flex h-6 w-6 rounded-full bg-purple-400 opacity-75 ${activeHotspotId === "canh_hoa" ? "animate-ping" : "animate-pulse"}`}></span>
                            <span className={`relative inline-flex rounded-full h-5 w-5 border-2 border-white items-center justify-center text-xs font-bold text-white shadow-md ${activeHotspotId === "canh_hoa" ? "bg-purple-600 scale-125 ring-2 ring-purple-400" : "bg-slate-400 hover:bg-purple-400"}`}>
                              ?
                            </span>
                          </>
                        )}
                      </button>

                      {/* 4. Đài hoa (Green) */}
                      <button
                        onClick={() => handleHotspotClick("dai_hoa")}
                        className="absolute bottom-[24%] left-[49%] transform -translate-x-1/2 -translate-y-1/2 group z-10 transition-all duration-300"
                        title="Đoán Đài hoa"
                      >
                        {solvedParts.includes("dai_hoa") ? (
                          <div className="relative flex items-center justify-center">
                            <span className="relative inline-flex rounded-full h-6 w-6 border-2 border-white items-center justify-center text-xs font-bold text-white shadow-md bg-green-500 animate-pulse">
                              ✓
                            </span>
                            <span className="absolute left-8 bg-green-50 border border-green-200 text-green-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                              Đài hoa
                            </span>
                          </div>
                        ) : (
                          <>
                            <span className={`absolute inline-flex h-6 w-6 rounded-full bg-green-400 opacity-75 ${activeHotspotId === "dai_hoa" ? "animate-ping" : "animate-pulse"}`}></span>
                            <span className={`relative inline-flex rounded-full h-5 w-5 border-2 border-white items-center justify-center text-xs font-bold text-white shadow-md ${activeHotspotId === "dai_hoa" ? "bg-green-600 scale-125 ring-2 ring-green-400" : "bg-slate-400 hover:bg-green-400"}`}>
                              ?
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Game Interactive Choices / Progress lists */}
                  <div className="md:col-span-6 flex flex-col gap-3">
                    
                    {activeHotspotId ? (
                      /* Active Question Card overlay when a hotspot is clicked */
                      <div className="p-4 rounded-xl border-2 border-amber-300 bg-amber-50/50 flex flex-col gap-3 animate-fade-in shadow-sm">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          Bé đoán xem đây là bộ phận nào?
                        </h4>
                        <p className="text-[11px] text-[#453c30] leading-relaxed italic">
                          "Gợi ý của BiBi: {FLOWER_PARTS.find(p => p.id === activeHotspotId)?.kidsExplanation}"
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {FLOWER_PARTS.map((part) => {
                            const isWrong = wrongGuessId === part.id;
                            return (
                              <button
                                key={part.id}
                                onClick={() => handleStage1Guess(part.id)}
                                className={`p-2.5 rounded-xl border-2 text-xs font-bold transition-all duration-200 text-center ${
                                  isWrong
                                    ? "bg-rose-100 border-rose-400 text-rose-800 animate-shake"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-400 cursor-pointer active:translate-y-0.5"
                                }`}
                              >
                                {part.vietnameseName}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      /* Static guidance or correct feedback */
                      <div className="flex flex-col gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-[#eae4cd] text-xs text-slate-600 leading-normal">
                          <strong className="text-amber-700 block mb-0.5">Nhiệm vụ thiết kế:</strong>
                          Click vào các dấu hỏi <strong className="text-amber-600 font-bold">?</strong> trên mô hình bông hoa để bắt đầu ghép tên đúng.
                        </div>

                        {stage1Feedback && (
                          <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-[11px] text-emerald-800 font-medium leading-relaxed animate-fade-in">
                            {stage1Feedback}
                          </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                          {FLOWER_PARTS.map((part) => {
                            const isSolved = solvedParts.includes(part.id);
                            return (
                              <div
                                key={part.id}
                                className={`flex items-center justify-between p-2 rounded-xl border-2 transition-all duration-200 ${
                                  isSolved
                                    ? "bg-emerald-50/40 border-emerald-300 text-emerald-950"
                                    : "border-slate-100 bg-slate-50 opacity-60 text-slate-400"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-bold bg-slate-300 ${isSolved ? "bg-emerald-500" : ""}`}>
                                    {isSolved ? "✓" : "🔒"}
                                  </span>
                                  <span className="text-xs font-bold">{part.vietnameseName}</span>
                                </div>
                                <span className="text-[9px] font-semibold text-slate-400 font-mono">{part.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar and Stage Graduation */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#f1ece1] pt-3.5 mt-3 gap-2">
                  <div className="w-full sm:w-auto flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
                      Tiến độ:
                    </span>
                    <div className="w-24 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-500" 
                        style={{ width: `${(solvedParts.length / FLOWER_PARTS.length) * 100}%` }}
                      />
                    </div>
                    <strong className="text-xs text-slate-700 font-bold">{solvedParts.length}/{FLOWER_PARTS.length} bộ phận</strong>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentStage(2);
                      setBeeExpression("happy");
                    }}
                    disabled={solvedParts.length < FLOWER_PARTS.length}
                    className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all duration-300 ${
                      solvedParts.length === FLOWER_PARTS.length
                        ? "bg-[#fbbf24] border-[#d49a2a] text-amber-950 hover:bg-amber-400 cursor-pointer shadow-sm active:translate-y-0.5"
                        : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                    id="finish-stage1-next-btn"
                  >
                    Vượt Chặng 1: Qua Chặng 2 ➔
                  </button>
                </div>
              </div>
            )}

            {/* CHẶNG 2: ĐƯỜNG ĐUA PHÂN LOẠI HOA ĐƠN TÍNH & LƯỠNG TÍNH */}
            {currentStage === 2 && (
              <div className="flex-1 flex flex-col justify-between" id="stage2-game-workspace">
                <div className="text-center mb-4">
                  <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Thử Thách Phân Loại 🏆
                  </span>
                  <h3 className="text-lg font-bold text-[#1e293b] mt-1.5">
                    Đường Đua Phân Loại Hoa Vào Giỏ
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bé đoán xem bông hoa này thuộc loại nào và ném nó vào giỏ tương ứng nhé!
                  </p>
                </div>

                {!gameFinished ? (
                  <div className="my-auto flex flex-col items-center justify-center gap-4" id="game-card-view">
                    
                    {/* Flower Question Card with toss animation classes */}
                    <div 
                      className={`w-full max-w-xs bg-[#faf9f3] border-2 border-[#eae4cd] rounded-2xl p-4 relative overflow-hidden flex flex-col items-center text-center shadow-sm transition-toss duration-800 ${
                        tossingTo === "luong_tinh" 
                          ? "translate-x-[-140px] translate-y-[100px] scale-50 opacity-0"
                          : tossingTo === "don_tinh"
                          ? "translate-x-[140px] translate-y-[100px] scale-50 opacity-0"
                          : "translate-x-0 translate-y-0 scale-100"
                      }`}
                    >
                      <span className="absolute top-2 left-2 bg-white px-2 py-0.5 rounded-full text-[9px] font-bold border border-[#eae4cd] text-slate-500">
                        Bông {gameIndex + 1}/{gameItems.length}
                      </span>
                      
                      {/* Current Answer Streak count indicator */}
                      {streakCount > 0 && (
                        <span className="absolute top-2 right-2 bg-rose-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5 animate-bounce">
                          🔥 Chuỗi: {streakCount}
                        </span>
                      )}

                      {/* Giant Flower Emoji with float animation */}
                      <div className="text-5xl my-3 select-none animate-float">
                        {gameItems[gameIndex].emoji}
                      </div>

                      <h4 className="text-sm font-bold text-slate-800">{gameItems[gameIndex].name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal px-2">
                        {gameItems[gameIndex].description}
                      </p>

                      {/* Feedback overlays */}
                      {currentFeedback && (
                        <div
                          className={`mt-3 p-2.5 rounded-xl border text-[10px] font-semibold leading-relaxed animate-fade-in ${
                            currentFeedback.isCorrect
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                              : "bg-amber-50 border-amber-200 text-amber-800"
                          }`}
                          id="game-feedback-box"
                        >
                          <p>{currentFeedback.text}</p>
                        </div>
                      )}
                    </div>

                    {/* Dual Baskets Visual */}
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm" id="game-baskets-container">
                      {/* Left Basket: Lưỡng Tính */}
                      <div 
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center bg-amber-50/50 transition-all duration-300 ${
                          basketBounce === "luong_tinh"
                            ? "animate-basket-bounce border-amber-500 bg-amber-100/70"
                            : "border-amber-200"
                        }`}
                      >
                        <span className="text-3xl">🧺🌸</span>
                        <span className="text-xs font-bold text-amber-900 mt-1">Giỏ Lưỡng Tính</span>
                        <span className="text-[9px] text-amber-600 font-semibold">(Có nhị & nhụy)</span>
                      </div>

                      {/* Right Basket: Đơn Tính */}
                      <div 
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center bg-sky-50/50 transition-all duration-300 ${
                          basketBounce === "don_tinh"
                            ? "animate-basket-bounce border-sky-500 bg-sky-100/70"
                            : "border-sky-200"
                        }`}
                      >
                        <span className="text-3xl">🧺🌼</span>
                        <span className="text-xs font-bold text-sky-900 mt-1">Giỏ Đơn Tính</span>
                        <span className="text-[9px] text-sky-600 font-semibold">(Chỉ nhị hoặc nhụy)</span>
                      </div>
                    </div>

                    {/* Sorting action buttons */}
                    <div className="flex gap-4 w-full max-w-sm mt-1">
                      <button
                        onClick={() => handleGameChoice("luong_tinh")}
                        disabled={!!currentFeedback || !!tossingTo}
                        className={`flex-1 py-2.5 px-3 rounded-xl border-2 font-bold text-xs transition-all duration-200 flex flex-col items-center justify-center gap-0.5 ${
                          currentFeedback || tossingTo
                            ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-amber-100 border-[#fbbf24] text-amber-950 hover:bg-amber-200 cursor-pointer shadow-sm active:translate-y-0.5"
                        }`}
                        id="choose-luong-tinh-btn"
                      >
                        <span className="text-base">🌸 Lưỡng Tính</span>
                        <span className="text-[9px] text-amber-800 uppercase tracking-wide">Ném vào giỏ trái</span>
                      </button>

                      <button
                        onClick={() => handleGameChoice("don_tinh")}
                        disabled={!!currentFeedback || !!tossingTo}
                        className={`flex-1 py-2.5 px-3 rounded-xl border-2 font-bold text-xs transition-all duration-200 flex flex-col items-center justify-center gap-0.5 ${
                          currentFeedback || tossingTo
                            ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-sky-100 border-sky-300 text-sky-950 hover:bg-sky-200 cursor-pointer shadow-sm active:translate-y-0.5"
                        }`}
                        id="choose-don-tinh-btn"
                      >
                        <span className="text-base">🌼 Đơn Tính</span>
                        <span className="text-[9px] text-sky-800 uppercase tracking-wide">Ném vào giỏ phải</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Game complete / summary screen
                  <div className="my-auto text-center flex flex-col items-center max-w-sm mx-auto" id="game-finished-summary">
                    <div className="text-5xl mb-2">🏆🎓</div>
                    <h4 className="text-base font-bold text-[#1e293b]">Xuất Sắc Hoàn Thành!</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Bé đã giúp ong BiBi phân loại toàn bộ 8 loài hoa vào giỏ.
                      Đạt kết quả chính xác: <strong className="text-amber-600 text-sm">{gameScore}/{gameItems.length} bông hoa!</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Kỷ lục chuỗi thắng liên tục tốt nhất của bé: <strong className="text-rose-500 font-bold">{maxStreak} 🔥</strong>
                    </p>

                    {/* Show quick grid of answers with feedback checkmarks */}
                    <div className="grid grid-cols-4 gap-2 w-full mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {gameAnswers.map((ans, idx) => (
                        <div
                          key={idx}
                          className={`p-1.5 rounded-lg border text-center relative flex flex-col items-center justify-between ${
                            ans.isCorrect ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50/50 border-rose-200"
                          }`}
                          title={ans.item.explanation}
                        >
                          <span className="text-xl">{ans.item.emoji}</span>
                          <span className="text-[8px] font-bold text-slate-600 block truncate w-full">
                            {ans.item.name}
                          </span>
                          <span className="absolute bottom-0.5 right-0.5">
                            {ans.isCorrect ? (
                              <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                            ) : (
                              <span className="text-[8px] font-bold text-rose-600">✗</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action controls */}
                    <div className="flex gap-3 w-full mt-4">
                      <button
                        onClick={restartGame}
                        className="flex-1 border-2 border-slate-300 bg-white text-slate-700 py-2 px-3 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer active:translate-y-0.5"
                        id="restart-game-btn"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Chơi lại
                      </button>
                      <button
                        onClick={() => {
                          setCurrentStage(3);
                          setBeeExpression("happy");
                        }}
                        className="flex-1 border-2 border-amber-600 bg-amber-500 text-amber-950 py-2 px-3 rounded-xl text-xs font-bold hover:bg-amber-400 shadow-sm flex items-center justify-center gap-1 cursor-pointer active:translate-y-0.5"
                        id="go-to-stage3-btn"
                      >
                        Qua Chặng 3 <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer status help */}
                <div className="border-t border-[#f1ece1] pt-3 mt-3 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Trò chơi khoa học lớp 5 - Phân loại Hoa</span>
                  <span>Kỷ lục chuỗi: {maxStreak} 🔥</span>
                </div>
              </div>
            )}

            {/* CHẶNG 3: CUỘC PHIÊU LƯU THỤ PHẤN CỦA BIBI */}
            {currentStage === 3 && (
              <div className="flex-1 flex flex-col justify-between" id="stage3-process-workspace">
                
                {/* SUB-STAGE 3A: SEQUENCING GAME */}
                {stage3SubStage === "sequencing" && (
                  <div className="flex-1 flex flex-col justify-between" id="stage3-sequencing-view">
                    <div className="text-center mb-3">
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Sắp Xếp Quy Trình 🌱
                      </span>
                      <h3 className="text-lg font-bold text-[#1e293b] mt-1.5">
                        Đường Đua Sinh Sản: Xếp Đúng Trình Tự
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Dùng các nút mũi tên để hoán đổi vị trí của các giai đoạn sao cho đúng thứ tự từ 1 đến 3 nhé!
                      </p>
                    </div>

                    <div className="my-auto space-y-2 max-w-md mx-auto w-full">
                      {scrambledSteps.map((step, idx) => (
                        <div 
                          key={step.id} 
                          className="flex items-center gap-2 p-3 bg-[#faf9f3] border-2 border-[#eae4cd] rounded-xl relative shadow-sm"
                        >
                          {/* Position Badge based on current layout order */}
                          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
                            {idx + 1}
                          </span>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800">{step.title}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                              {step.description}
                            </p>
                          </div>

                          {/* Swap Control Buttons */}
                          <div className="flex flex-col gap-1">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveStep(idx, "up")}
                              className={`p-1 rounded border ${
                                idx === 0 
                                  ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed" 
                                  : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer"
                              }`}
                              title="Di chuyển lên"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              disabled={idx === scrambledSteps.length - 1}
                              onClick={() => handleMoveStep(idx, "down")}
                              className={`p-1 rounded border ${
                                idx === scrambledSteps.length - 1 
                                  ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed" 
                                  : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer"
                              }`}
                              title="Di chuyển xuống"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {sequencingFeedback && (
                        <div className={`p-3 rounded-xl border text-xs font-medium leading-relaxed animate-fade-in ${
                          sequencingFeedback.includes("Tuyệt")
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-amber-50 border-amber-200 text-amber-800"
                        }`}>
                          {sequencingFeedback}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[#f1ece1] pt-3.5 mt-3 flex justify-end">
                      <button
                        onClick={handleCheckSequencing}
                        className="px-5 py-2.5 rounded-xl border-2 border-emerald-600 bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-all cursor-pointer shadow-sm active:translate-y-0.5"
                      >
                        Kiểm Tra Quy Trình 🔍
                      </button>
                    </div>
                  </div>
                )}

                {/* SUB-STAGE 3B: INTERACTIVE POLLINATION SIMULATION */}
                {stage3SubStage === "simulation" && (
                  <div className="flex-1 flex flex-col justify-between" id="stage3-simulation-view">
                    <div className="text-center mb-3">
                      <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Trò Chơi Thực Hành 🐝
                      </span>
                      <h3 className="text-lg font-bold text-[#1e293b] mt-1.5">
                        Mô Phỏng: Bé Giúp BiBi Thụ Phấn Cho Hoa
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Bé hãy ra lệnh giúp BiBi bay đến Nhị hoa đực lấy phấn, rồi mang sang đầu Nhụy hoa cái nhé!
                      </p>
                    </div>

                    {/* Interactive simulation stage map */}
                    <div className="h-56 w-full border-2 border-[#eae4cd] bg-[#fbfbfa] rounded-2xl relative overflow-hidden flex justify-between items-end pb-8 px-6 shadow-inner my-auto">
                      
                      {/* Sky element decorations */}
                      <span className="absolute top-4 left-6 text-xl opacity-20">☁️</span>
                      <span className="absolute top-8 right-16 text-2xl opacity-10">☁️</span>
                      <span className="absolute top-3 right-8 text-3xl opacity-25 text-amber-400">☀️</span>

                      {/* Male Flower (Nhị) */}
                      <div className="flex flex-col items-center relative z-10 w-24">
                        {/* Pollen particles surrounding male flower when pollen is still present */}
                        {!hasPollen && !isFruitGrown && (
                          <div className="absolute top-[-30px] flex gap-1 justify-center animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-300"></span>
                            <span className="w-2 h-2 rounded-full bg-yellow-400 border border-amber-300 mt-2"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-300 mt-1"></span>
                          </div>
                        )}
                        
                        {/* Flower Body */}
                        <div className="text-5xl select-none relative">
                          🌼
                          {/* Stamen extension */}
                          <span className="absolute top-1 left-4 text-base animate-bounce">⚡</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200 mt-2">
                          Nhị (Hoa đực)
                        </span>
                      </div>

                      {/* BiBi character sliding smoothly between targets */}
                      <div 
                        className="absolute bottom-[40px] z-20 transition-all duration-1000 ease-in-out"
                        style={{
                          left: beePosition === "stamen" ? "12%" : beePosition === "pistil" ? "74%" : "44%",
                          transform: "translateY(-50%)"
                        }}
                      >
                        <div className="relative">
                          {/* Glowing Pollen aura around bee body */}
                          {hasPollen && (
                            <div className="animate-pollen-aura" />
                          )}
                          
                          <BiBiBee expression={beeExpression} size={70} />
                          
                          {/* Pollen carrying visual indicator */}
                          {hasPollen && (
                            <span className="absolute top-[-10px] right-0 bg-yellow-400 text-yellow-950 border border-yellow-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold animate-bounce shadow-sm">
                              ✨
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Female Flower (Nhụy) */}
                      <div className="flex flex-col items-center relative z-10 w-24">
                        
                        {isFruitGrown ? (
                          /* Ripe fruit growth simulation with grow animation */
                          <div className="flex flex-col items-center animate-fruit-grow">
                            {/* Growing fruit emoji */}
                            <span className="text-6xl select-none filter drop-shadow">🥒</span>
                            <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 mt-2">
                              Quả mướp (Hạt giống!)
                            </span>
                          </div>
                        ) : (
                          /* Initial waiting female flower */
                          <div className="flex flex-col items-center">
                            <div className="relative select-none text-5xl">
                              🌺
                              {/* Ovary swelling base */}
                              <span className="absolute bottom-[-10px] left-3.5 w-6 h-5 bg-green-500 rounded-full border-2 border-emerald-700 opacity-80" title="Bầu nhụy noãn" />
                            </div>
                            <span className="text-[10px] font-bold text-[#453c30] bg-[#faf9f3] px-2 py-0.5 rounded-full border border-slate-200 mt-2">
                              Nhụy (Hoa cái)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Simulation action button control panel */}
                    <div className="bg-[#faf9f3] p-3 rounded-xl border border-[#eae4cd] flex flex-col items-center gap-2 mt-3 text-center">
                      
                      {simulationStep === 1 && (
                        <div className="flex flex-col items-center gap-1.5 w-full">
                          <p className="text-[11px] text-slate-600 font-semibold">
                            💬 BiBi: "Bé ơi, giúp tớ bay sang Nhị hoa đực lấy phấn vàng đi nhé!"
                          </p>
                          <button
                            onClick={() => handleBeeAction("collect")}
                            className="w-full max-w-xs py-2 px-4 rounded-xl border-2 border-amber-500 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-sm cursor-pointer active:translate-y-0.5"
                          >
                            🐝 Bay đi lấy phấn hoa ➔
                          </button>
                        </div>
                      )}

                      {simulationStep === 2 && (
                        <div className="flex flex-col items-center gap-1.5 w-full">
                          <p className="text-[11px] text-emerald-800 font-semibold animate-pulse">
                            ✨ BiBi: "Phấn hoa đã dính đầy mình rồi! Giờ bay sang đầu Nhụy hoa cái thôi!"
                          </p>
                          <button
                            onClick={() => handleBeeAction("pollinate")}
                            className="w-full max-w-xs py-2 px-4 rounded-xl border-2 border-emerald-600 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-sm cursor-pointer active:translate-y-0.5"
                          >
                            🐝 Bay sang Nhụy hoa cái để thụ phấn ➔
                          </button>
                        </div>
                      )}

                      {simulationStep === 3 && (
                        <div className="flex flex-col items-center gap-2 w-full animate-fade-in">
                          <p className="text-xs text-emerald-800 font-bold leading-normal">
                            🎉 Quá kỳ diệu! Cánh hoa cái héo rụng đi, bầu nhụy của hoa mướp đã thụ tinh thành công và phình to phát triển thành một quả mướp căng đầy chứa đầy hạt giống!
                          </p>
                          <div className="flex gap-2 w-full max-w-xs">
                            <button
                              onClick={restartSimulation}
                              className="flex-1 py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold text-[10px] hover:bg-slate-50 cursor-pointer"
                            >
                              🔄 Chơi lại cuộc phiêu lưu
                            </button>
                            <button
                              onClick={() => {
                                handleQuickQuestion("BiBi ơi, tớ đã giúp cậu thụ phấn và tạo ra quả mướp rồi nè! Khen tớ đi!");
                              }}
                              className="flex-1 py-2 px-3 rounded-lg bg-amber-400 border border-amber-500 text-amber-950 font-bold text-[10px] hover:bg-amber-300 shadow-sm cursor-pointer"
                            >
                              🏆 Báo công với BiBi
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Chat With BiBi Educational Chatbot (5 columns) */}
        <section className="lg:col-span-5 flex flex-col bg-white rounded-2xl border-2 border-[#eae4cd] play-card overflow-hidden h-[630px] lg:h-auto min-h-[500px]" id="chat-workspace-section">
          
          {/* Chat Header containing active BiBi character representation */}
          <div className="bg-[#faf9f3] p-4 border-b border-[#eae4cd] flex items-center justify-between gap-3" id="chat-header-panel">
            <div className="flex items-center gap-3">
              {/* Animated BiBi Character */}
              <div className="bg-white rounded-full p-1.5 border border-[#e5dfc3] shadow-sm">
                <BiBiBee expression={beeExpression} size={65} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  Trợ lý Ong Vàng BiBi 🐝
                </h3>
                <span className="text-[10px] inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium px-2 py-0.5 rounded-full mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Sẵn sàng giải đáp
                </span>
              </div>
            </div>

            {/* Clear Chat Button */}
            <button
              onClick={() => {
                setMessages([
                  {
                    id: "welcome-reset",
                    role: "assistant",
                    content: "BiBi đã dọn dẹp bàn học sạch sẽ rồi nè! Bạn nhỏ có câu hỏi nào mới về nhị, nhụy hay bài học khoa học lớp 5 không? Hãy trò chuyện cùng BiBi nhé! 🐝🌻",
                    timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                  },
                ]);
              }}
              title="Xóa lịch sử chat để học lại"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              id="clear-chat-history-btn"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Chat bubbles viewport */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#fdfdfc]"
            id="chat-messages-viewport"
          >
            {messages.map((msg) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}
                  id={`chat-msg-row-${msg.id}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-sm border border-amber-300 mt-1 flex-shrink-0">
                      🐝
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isAssistant
                        ? "bg-white border border-[#eae4cd] text-[#2c251e] rounded-tl-sm shadow-sm"
                        : "bg-amber-400 text-amber-950 font-medium rounded-tr-sm self-end"
                    }`}
                  >
                    {/* Preserve markdown style spacing and bold texts */}
                    <div className="whitespace-pre-line prose max-w-none">
                      {msg.content}
                    </div>
                    <span className="block text-[8px] text-slate-400 mt-1 text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Simulated Typings Indicator */}
            {isSending && (
              <div className="flex items-start gap-2.5 justify-start animate-pulse" id="bibi-typing-loader">
                <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-sm border border-amber-300 mt-1">
                  🐝
                </div>
                <div className="bg-white border border-[#eae4cd] rounded-2xl rounded-tl-sm p-3 text-xs text-slate-400">
                  BiBi đang tìm mật hoa tri thức để trả lời bạn... 🐝✨
                </div>
              </div>
            )}
          </div>

          {/* Missing API KEY guidance widget */}
          {apiKeyError && (
            <div className="px-4 py-2 bg-amber-50 border-y border-amber-200 text-xs text-amber-900 flex items-start gap-2" id="api-key-warning-card">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">Chế độ Học Offline kích hoạt!</p>
                <p className="text-[10px] text-amber-800 leading-normal">
                  Chưa cài đặt bí mật <strong>GEMINI_API_KEY</strong> nên BiBi đang dùng bộ câu trả lời thông minh được biên soạn sẵn từ SGK. Bạn nhỏ vẫn thỏa sức hỏi đáp nhé!
                </p>
              </div>
            </div>
          )}

          {/* Bottom input area and quick questions helper */}
          <div className="p-3 bg-[#faf9f3] border-t border-[#eae4cd] space-y-2" id="chat-controls-area">
            
            {/* Quick helper question chips based on the active stage */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none" id="quick-questions-panel">
              <span className="text-[10px] text-slate-400 font-bold flex-shrink-0 flex items-center gap-1 uppercase">
                <HelpCircle className="w-3 h-3 text-amber-500" /> Đố BiBi:
              </span>
              
              {currentStage === 1 && (
                <>
                  <button
                    onClick={() => handleQuickQuestion("Nhị hoa và nhụy hoa khác nhau thế nào BiBi ơi?")}
                    className="text-[10px] bg-white hover:bg-amber-100 border border-[#eae4cd] rounded-full px-2.5 py-1 text-slate-600 font-semibold whitespace-nowrap"
                  >
                    Nhị vs Nhụy khác nhau gì? 🤔
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("Cánh hoa có vai trò gì trong sinh sản vậy BiBi?")}
                    className="text-[10px] bg-white hover:bg-amber-100 border border-[#eae4cd] rounded-full px-2.5 py-1 text-slate-600 font-semibold whitespace-nowrap"
                  >
                    Vai trò của Cánh hoa 🌸
                  </button>
                </>
              )}

              {currentStage === 2 && (
                <>
                  <button
                    onClick={() => handleQuickQuestion("Tại sao hoa mướp lại là hoa đơn tính vậy BiBi?")}
                    className="text-[10px] bg-white hover:bg-amber-100 border border-[#eae4cd] rounded-full px-2.5 py-1 text-slate-600 font-semibold whitespace-nowrap"
                  >
                    Tại sao mướp là hoa đơn tính? 🥒
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("Cho tớ 3 ví dụ về hoa lưỡng tính phổ biến với!")}
                    className="text-[10px] bg-white hover:bg-amber-100 border border-[#eae4cd] rounded-full px-2.5 py-1 text-slate-600 font-semibold whitespace-nowrap"
                  >
                    3 ví dụ hoa lưỡng tính 🌺
                  </button>
                </>
              )}

              {currentStage === 3 && (
                <>
                  <button
                    onClick={() => handleQuickQuestion("Quá trình thụ phấn diễn ra nhờ những gì hả BiBi?")}
                    className="text-[10px] bg-white hover:bg-amber-100 border border-[#eae4cd] rounded-full px-2.5 py-1 text-slate-600 font-semibold whitespace-nowrap"
                  >
                    Thụ phấn nhờ những ai? 💨
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("Sau khi thụ tinh thì hoa bưởi sẽ biến đổi thế nào?")}
                    className="text-[10px] bg-white hover:bg-amber-100 border border-[#eae4cd] rounded-full px-2.5 py-1 text-slate-600 font-semibold whitespace-nowrap"
                  >
                    Sự biến đổi sau thụ tinh 🍊
                  </button>
                </>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
              id="bibi-chat-input-form"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập câu hỏi về bài học khoa học của bé..."
                disabled={isSending}
                className="flex-1 bg-white border-2 border-[#eae4cd] focus:border-[#fbbf24] focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
              <button
                type="submit"
                disabled={isSending || !inputValue.trim()}
                className="bg-amber-400 hover:bg-amber-500 disabled:bg-slate-100 disabled:text-slate-400 text-amber-950 font-bold p-2.5 rounded-xl border-2 border-transparent disabled:border-transparent hover:border-amber-500 transition-colors cursor-pointer"
                id="submit-chat-button"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>

      </main>

      {/* Achievements Bảng Thành Tích Row footer panel */}
      <footer className="bg-white border-t-2 border-[#eae4cd] py-4 px-4 mt-auto" id="app-footer-achievements">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Bảng thành tích huy hiệu học tập của bé
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 transition-all duration-300 ${
                  ach.unlocked
                    ? "bg-[#faf9f3] border-[#fbbf24] text-[#2c251e] shadow-sm"
                    : "bg-slate-50/50 border-[#f1ece1] text-slate-400"
                }`}
                id={`achievement-card-${ach.id}`}
              >
                <div className={`text-2xl p-1 bg-white rounded-lg border shadow-sm ${ach.unlocked ? "border-[#fbbf24]" : "border-slate-200"}`}>
                  {ach.unlocked ? ach.emoji : "🔒"}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold leading-tight truncate">
                    {ach.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal truncate" title={ach.description}>
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
