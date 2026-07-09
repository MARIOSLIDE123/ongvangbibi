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
import { 
  FLOWER_PARTS, 
  FLOWER_GAME_ITEMS, 
  LESSON_STAGES, 
  INITIAL_ACHIEVEMENTS,
  QUIZ_QUESTIONS_STAGE4,
  QUIZ_QUESTIONS_STAGE5
} from "./data";
import { Message, Achievement, FlowerGameItem, StudentInfo, Attempt, QuizQuestion } from "./types";

export default function App() {
  // Current active learning stage (1, 2, or 3)
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

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

  // Onboarding & attempts states
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(() => {
    const saved = localStorage.getItem("bibi_student_info");
    return saved ? JSON.parse(saved) : null;
  });
  const [attempts, setAttempts] = useState<Attempt[]>(() => {
    const saved = localStorage.getItem("bibi_attempts");
    return saved ? JSON.parse(saved) : [];
  });
  const [stage4Score, setStage4Score] = useState<number | null>(null);

  // Stage 4 & 5 Quiz States
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [filledAnswer, setFilledAnswer] = useState<string>("");
  const [showQuizFeedback, setShowQuizFeedback] = useState<boolean>(false);
  const [quizFeedbackCorrect, setQuizFeedbackCorrect] = useState<boolean>(false);

  // Stage 3 pre-simulation question states
  const [stage3PreQuestionAnswered, setStage3PreQuestionAnswered] = useState<boolean>(false);
  const [stage3PreQuestionSolved, setStage3PreQuestionSolved] = useState<boolean>(false);
  const [stage3PreQuestionChoice, setStage3PreQuestionChoice] = useState<string | null>(null);

  // LocalStorage Effects
  useEffect(() => {
    if (studentInfo) {
      localStorage.setItem("bibi_student_info", JSON.stringify(studentInfo));
    } else {
      localStorage.removeItem("bibi_student_info");
    }
  }, [studentInfo]);

  useEffect(() => {
    localStorage.setItem("bibi_attempts", JSON.stringify(attempts));
  }, [attempts]);

  // Audio synthesizer helper
  const playSynthSound = (type: 'correct' | 'wrong' | 'complete') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (type === 'correct') {
        // High-pitched double beep chime (C5 to E5)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
        
        // Second beep
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        gain2.gain.setValueAtTime(0, ctx.currentTime);
        gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
        osc2.start(ctx.currentTime + 0.08);
        osc2.stop(ctx.currentTime + 0.22);
      } else if (type === 'wrong') {
        // Low buzzy double drop tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'complete') {
        // Short upbeat fanfare (C5, E5, G5)
        const notes = [523.25, 659.25, 784.00]; // C5, E5, G5
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.25);
          
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.25);
        });
      }
    } catch (e) {
      console.warn("Web Audio API error:", e);
    }
  };

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
      playSynthSound("correct");
      const updatedSolved = [...solvedParts, chosenId];
      setSolvedParts(updatedSolved);
      setBeeExpression("happy");
      setStage1Feedback(`Chính xác luôn! 🎉 ${part?.vietnameseName}: ${part?.kidsExplanation}`);
      setActiveHotspotId(null);
      setWrongGuessId(null);

      if (updatedSolved.length === FLOWER_PARTS.length) {
        unlockAchievement("explorer");
        playSynthSound("complete");
      }
    } else {
      playSynthSound("wrong");
      setWrongGuessId(chosenId);
      setBeeExpression("thinking");
      setStage1Feedback(`Chưa chính xác rồi ${studentInfo ? studentInfo.name : "bạn nhỏ"} ơi! Hãy nhớ lại gợi ý: ${part?.kidsExplanation}`);
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
      playSynthSound("correct");
      setGameScore((prev) => prev + 1);
      setStreakCount((prev) => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
      setBeeExpression("happy");
      setCurrentFeedback({
        isCorrect: true,
        text: `Đúng rồi! Tuyệt vời quá ${studentInfo ? studentInfo.name : "bạn nhỏ"} ơi! 🎉 ${currentItem.explanation}`,
      });
    } else {
      playSynthSound("wrong");
      setStreakCount(0);
      setBeeExpression("thinking");
      setCurrentFeedback({
        isCorrect: false,
        text: `Ôi chưa chính xác rồi nè! ${studentInfo ? studentInfo.name : "Bạn nhỏ"} thử suy nghĩ lại xem nhé: ${currentItem.description}. ${currentItem.explanation}`,
      });
    }

    setGameAnswers((prev) => [...prev, { item: currentItem, isCorrect, userChoice: choice }]);
  };

  const handleNextGameItem = () => {
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
      playSynthSound("complete");
    }
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
      playSynthSound("correct");
      setBeeExpression("happy");
      setSequencingFeedback(`Tuyệt cú mèo! 🌟 ${studentInfo ? studentInfo.name : "Bé"} đã sắp xếp quy trình thụ phấn - thụ tinh - tạo quả hoàn toàn chính xác! Bây giờ, hãy trả lời câu hỏi phụ dưới đây để kích hoạt Ong BiBi bay đi thụ phấn nhé!`);
      setTimeout(() => {
        setStage3PreQuestionAnswered(false);
        setStage3PreQuestionSolved(false);
        setStage3PreQuestionChoice(null);
        setStage3SubStage("simulation");
        setSequencingFeedback(null);
      }, 3500);
    } else {
      playSynthSound("wrong");
      setBeeExpression("thinking");
      setSequencingFeedback(`Chưa chính xác rồi ${studentInfo ? studentInfo.name : "bé"} ơi! Hãy nhớ trình tự chuẩn: Hạt phấn tiếp xúc đầu nhụy (Thụ phấn) ➔ Thụ tinh tạo hợp tử (Thụ tinh) ➔ Noãn phát triển thành hạt (Tạo hạt) ➔ Bầu nhụy lớn thành quả (Tạo quả). Thử sắp xếp lại xem!`);
    }
  };

  // Stage 3 Pre-Simulation question handler
  const handleStage3PreQuestionAnswer = (choice: string) => {
    setStage3PreQuestionChoice(choice);
    setStage3PreQuestionAnswered(true);
    const isCorrect = choice === "Côn trùng (ong, bướm)";
    setStage3PreQuestionSolved(isCorrect);
    if (isCorrect) {
      playSynthSound("correct");
      setBeeExpression("happy");
    } else {
      playSynthSound("wrong");
      setBeeExpression("thinking");
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
        playSynthSound("complete");
      }, 1200);
    }
  };

  const restartSimulation = () => {
    setBeePosition("center");
    setHasPollen(false);
    setIsFruitGrown(false);
    setSimulationStep(1);
    setStage3SubStage("sequencing");
    // Re-shuffle steps (4 steps)
    const shuffled = [...STAGE3_STEPS_DATA].sort(() => Math.random() - 0.5);
    if (shuffled.every((step, idx) => step.id === idx + 1)) {
      const tmp = shuffled[0];
      shuffled[0] = shuffled[1];
      shuffled[1] = tmp;
    }
    setScrambledSteps(shuffled);
    setSequencingFeedback(null);
  };

  // Stage 4 & 5 Quiz handlers
  const handleQuizSubmit = (questions: QuizQuestion[]) => {
    if (showQuizFeedback) return;
    
    const currentQ = questions[quizIndex];
    let isCorrect = false;
    
    if (currentQ.type === "single" || currentQ.type === "select") {
      const ans = selectedOptions[0] || "";
      isCorrect = ans.trim().toLowerCase() === (currentQ.correctAnswer as string).trim().toLowerCase();
    } else if (currentQ.type === "multiple") {
      const userAns = [...selectedOptions].sort();
      const correctAns = [...(currentQ.correctAnswer as string[])].sort();
      isCorrect = userAns.length === correctAns.length && userAns.every((val, idx) => val.trim().toLowerCase() === correctAns[idx].trim().toLowerCase());
    } else if (currentQ.type === "fill") {
      isCorrect = filledAnswer.trim().toLowerCase() === (currentQ.correctAnswer as string).trim().toLowerCase();
    }
    
    setQuizFeedbackCorrect(isCorrect);
    setShowQuizFeedback(true);
    setQuizAnswers(prev => [...prev, isCorrect]);
    
    if (isCorrect) {
      playSynthSound("correct");
      setBeeExpression("happy");
    } else {
      playSynthSound("wrong");
      setBeeExpression("thinking");
    }
  };

  const handleNextQuizQuestion = (questions: QuizQuestion[], stageId: number) => {
    setShowQuizFeedback(false);
    setSelectedOptions([]);
    setFilledAnswer("");
    setBeeExpression("normal");
    
    if (quizIndex < questions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      // Completed the quiz stage!
      playSynthSound("complete");
      const stageScore = quizAnswers.filter(Boolean).length;
      
      if (stageId === 4) {
        setStage4Score(stageScore);
        setCurrentStage(5);
        setQuizIndex(0);
        setQuizAnswers([]);
      } else if (stageId === 5) {
        saveAttempt(stageScore);
      }
    }
  };

  const saveAttempt = (stage5Score: number) => {
    if (!studentInfo) return;
    
    const newAttempt: Attempt = {
      id: `attempt-${Date.now()}`,
      timestamp: new Date().toLocaleString("vi-VN"),
      studentInfo: studentInfo,
      scores: {
        stage1: 100, // Anatomy completed
        stage2: gameScore, // out of 8
        stage3: 100, // Pollination simulation completed
        stage4: stage4Score || 0, // out of 10
        stage5: stage5Score // out of 10
      },
      totalScore: 100 + (gameScore * 10) + 100 + ((stage4Score || 0) * 10) + (stage5Score * 10)
    };
    
    setAttempts(prev => [newAttempt, ...prev]);
    setCurrentStage(6); // Show the final report card / history screen
  };

  const restartAllCurriculum = () => {
    // Reset all states to do it again
    setSolvedParts([]);
    setActiveHotspotId(null);
    setWrongGuessId(null);
    setStage1Feedback(null);
    
    setGameIndex(0);
    setGameScore(0);
    setGameFinished(false);
    setGameAnswers([]);
    setCurrentFeedback(null);
    setStreakCount(0);
    setTossingTo(null);
    setBasketBounce(null);
    
    setStage3SubStage("sequencing");
    setBeePosition("center");
    setHasPollen(false);
    setIsFruitGrown(false);
    setSimulationStep(1);
    setStage3PreQuestionAnswered(false);
    setStage3PreQuestionSolved(false);
    setStage3PreQuestionChoice(null);
    
    setStage4Score(null);
    setQuizIndex(0);
    setQuizAnswers([]);
    setSelectedOptions([]);
    setFilledAnswer("");
    setShowQuizFeedback(false);
    
    setBeeExpression("normal");
    setCurrentStage(1);
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
    <div className="min-h-screen bg-[#fcfbf7] text-[#2c251e] flex flex-col selection:bg-[#fef08a] text-sm" id="app-root-container">
      {/* Header Bar */}
      <header className="bg-white border-b-2 border-[#eae4cd] px-6 py-4 sticky top-0 z-40" id="app-header">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo Brand */}
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-[#fef08a] rounded-full border-2 border-[#d49a2a] animate-bounce-slow">
              <span className="text-3xl">🐝</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-[#1e293b] flex items-center gap-2">
                Chú Ong Vàng BiBi
                <span className="text-sm bg-amber-100 text-amber-800 border border-amber-300 font-bold px-3 py-1 rounded-full">
                  Khoa học Lớp 5
                </span>
              </h1>
              <p className="text-sm text-slate-500 font-semibold mt-0.5">
                Sách Kết nối tri thức - Bài 13: Sinh sản của thực vật có hoa (Tiết 1)
              </p>
            </div>
          </div>

          {/* Quick Learning Stats / Milestones */}
          {studentInfo && (
            <div className="flex items-center gap-3">
              <div className="bg-[#fefcbf] border border-[#fef08a] rounded-xl px-4 py-2 flex items-center gap-2.5 text-sm font-bold text-amber-800 shadow-sm">
                <Sparkles className="w-4.5 h-4.5 text-amber-600 animate-spin-slow" />
                <span>Chặng {currentStage <= 5 ? `${currentStage}/5` : "Hoàn thành"}</span>
              </div>
              <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl px-4 py-2 flex items-center gap-2.5 text-sm font-bold text-emerald-800 shadow-sm">
                <Trophy className="w-4.5 h-4.5 text-emerald-600" />
                <span>
                  Thành tích: {achievements.filter((a) => a.unlocked).length}/{achievements.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {!studentInfo ? (
        /* ONBOARDING SCREEN: Welcome student form */
        <main className="flex-1 w-full px-6 md:px-8 py-10 flex items-center justify-center animate-fade-in" id="onboarding-root">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-[#eae4cd] play-card shadow-lg text-center space-y-6">
            <div className="inline-block p-4 bg-[#fef08a] rounded-full border-4 border-[#d49a2a] animate-bounce-slow">
              <span className="text-5xl">🐝</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">Chào Mừng Học Sinh Đến Với BiBi!</h2>
              <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                Để bắt đầu học tập và thực hành các hoạt động tương tác, em hãy điền thông tin dưới đây nhé!
              </p>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                const name = (formData.get("studentName") as string) || "";
                const className = (formData.get("studentClass") as string) || "";
                const school = (formData.get("studentSchool") as string) || "";
                if (name.trim() && className.trim() && school.trim()) {
                  setStudentInfo({ name: name.trim(), className: className.trim(), school: school.trim() });
                  playSynthSound("complete");
                }
              }}
              className="space-y-4 text-left"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Tên học sinh:</label>
                <input 
                  name="studentName" 
                  required 
                  type="text" 
                  placeholder="Nhập họ và tên học sinh..."
                  className="w-full bg-white border-2 border-[#eae4cd] focus:border-[#fbbf24] focus:outline-none rounded-xl px-4 py-2.5 text-sm font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Lớp:</label>
                  <input 
                    name="studentClass" 
                    required 
                    type="text" 
                    placeholder="Ví dụ: 5A1..."
                    className="w-full bg-white border-2 border-[#eae4cd] focus:border-[#fbbf24] focus:outline-none rounded-xl px-4 py-2.5 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Trường:</label>
                  <input 
                    name="studentSchool" 
                    required 
                    type="text" 
                    placeholder="Trường tiểu học..."
                    className="w-full bg-white border-2 border-[#eae4cd] focus:border-[#fbbf24] focus:outline-none rounded-xl px-4 py-2.5 text-sm font-semibold"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl border-2 border-amber-500 hover:border-amber-600 shadow-md cursor-pointer transition-all duration-200 uppercase tracking-wider text-sm mt-2"
              >
                Bắt đầu học 🚀
              </button>
            </form>
          </div>
        </main>
      ) : (
        /* 3-COLUMN LMS DASHBOARD GRID */
        <main className="flex-1 w-full px-6 md:px-8 py-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch" id="main-content-layout">
          
          {/* COLUMN 1: LEFT ROADMAP (xl:col-span-3) */}
          <section className="xl:col-span-3 lg:col-span-4 col-span-1 flex flex-col gap-5" id="left-roadmap-column">
            <div className="bg-white rounded-2xl p-5 border-2 border-[#eae4cd] play-card flex flex-col gap-4 h-full" id="lesson-roadmap">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#fbbf24]" />
                Lộ trình học tập
              </h2>
              
              <div className="flex flex-col gap-3">
                {LESSON_STAGES.map((stage) => {
                  const isActive = currentStage === stage.id;
                  const isCompleted = currentStage > stage.id;
                  const isUnlocked = stage.id <= (attempts.length > 0 ? 5 : Math.max(currentStage, solvedParts.length === FLOWER_PARTS.length ? 2 : 1));
                  
                  return (
                    <button
                      key={stage.id}
                      disabled={!isUnlocked}
                      onClick={() => {
                        setCurrentStage(stage.id);
                        setBeeExpression("happy");
                        setTimeout(() => setBeeExpression("normal"), 1500);
                      }}
                      className={`relative p-3.5 rounded-xl border-2 text-left transition-all duration-300 group flex items-center gap-3 ${
                        isActive
                          ? "border-[#fbbf24] bg-amber-50/70 shadow-sm ring-2 ring-amber-300"
                          : isCompleted
                          ? "border-emerald-300 bg-emerald-50/50"
                          : isUnlocked
                          ? "border-[#eae4cd] bg-white hover:bg-slate-50 cursor-pointer"
                          : "border-[#f1ece1] bg-slate-50 opacity-60 cursor-not-allowed"
                      }`}
                      id={`roadmap-stage-btn-${stage.id}`}
                    >
                      {isCompleted && (
                        <span className="bg-emerald-500 text-white rounded-full p-0.5 flex-shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                      {!isCompleted && !isActive && !isUnlocked && (
                        <span className="text-slate-400 flex-shrink-0">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <div className="flex-1">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Chặng {stage.id}
                        </span>
                        <span className={`block text-sm font-bold leading-tight mt-0.5 ${isActive ? "text-amber-900" : isCompleted ? "text-emerald-950" : "text-slate-655"}`}>
                          {stage.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Active Stage Detail info banner */}
              {currentStage <= 5 && (
                <div className="mt-auto p-4 bg-[#faf9f3] rounded-xl border border-[#ece7d5] flex items-start gap-3">
                  <div className="p-1.5 bg-white rounded-lg border border-[#e5dfc3] shadow-sm text-2xl mt-0.5">
                    {currentStage === 1 ? "🔬" : currentStage === 2 ? "🧺" : currentStage === 3 ? "🐝" : currentStage === 4 ? "⚔️" : "🎓"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#453c30]">
                      {LESSON_STAGES[currentStage - 1].title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {LESSON_STAGES[currentStage - 1].description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* COLUMN 2: CENTER ACTIVE WORKSPACE (xl:col-span-6) */}
          <section className="xl:col-span-6 lg:col-span-8 col-span-1 flex flex-col" id="center-workspace-column">
            <div className="flex-1 bg-white rounded-2xl p-6 border-2 border-[#eae4cd] play-card flex flex-col justify-between min-h-[500px]" id="interactive-workspace-container">
              
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
                      <div className="p-4 rounded-xl border-2 border-amber-300 bg-amber-50/50 flex flex-col gap-3.5 animate-fade-in shadow-sm">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          Bé đoán xem đây là bộ phận nào?
                        </h4>
                        <p className="text-xs sm:text-sm text-[#453c30] leading-relaxed italic">
                          "Gợi ý của BiBi: {FLOWER_PARTS.find(p => p.id === activeHotspotId)?.kidsExplanation}"
                        </p>

                        <div className="grid grid-cols-2 gap-3 mt-1">
                          {FLOWER_PARTS.map((part) => {
                            const isWrong = wrongGuessId === part.id;
                            return (
                              <button
                                key={part.id}
                                onClick={() => handleStage1Guess(part.id)}
                                className={`p-3 rounded-xl border-2 text-sm font-bold transition-all duration-200 text-center ${
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
                      <div className="flex flex-col gap-3.5">
                        <div className="p-4 bg-slate-50 rounded-xl border border-[#eae4cd] text-sm text-slate-600 leading-normal">
                          <strong className="text-amber-700 block mb-1">Nhiệm vụ thiết kế:</strong>
                          Click vào các dấu hỏi <strong className="text-amber-600 font-bold">?</strong> trên mô hình bông hoa để bắt đầu ghép tên đúng.
                        </div>

                        {stage1Feedback && (
                          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-xs sm:text-sm text-emerald-800 font-bold leading-relaxed animate-fade-in">
                            {stage1Feedback}
                          </div>
                        )}

                        <div className="flex flex-col gap-2">
                          {FLOWER_PARTS.map((part) => {
                            const isSolved = solvedParts.includes(part.id);
                            return (
                              <div
                                key={part.id}
                                className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all duration-200 ${
                                  isSolved
                                    ? "bg-emerald-50/40 border-emerald-300 text-emerald-950"
                                    : "border-slate-100 bg-slate-50 opacity-60 text-slate-400"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold bg-slate-300 ${isSolved ? "bg-emerald-500" : ""}`}>
                                    {isSolved ? "✓" : "🔒"}
                                  </span>
                                  <span className="text-sm font-bold">{part.vietnameseName}</span>
                                </div>
                                <span className="text-xs font-semibold text-slate-400 font-mono">{part.name}</span>
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

                    {/* Sorting action buttons or Next Button */}
                    {currentFeedback ? (
                      <button
                        onClick={handleNextGameItem}
                        className="w-full max-w-sm py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl border-2 border-emerald-600 shadow-md cursor-pointer text-center text-sm uppercase tracking-wider animate-pulse active:translate-y-0.5"
                        id="stage2-next-item-btn"
                      >
                        Tiếp theo ➔
                      </button>
                    ) : (
                      <div className="flex gap-4 w-full max-w-sm mt-1">
                        <button
                          onClick={() => handleGameChoice("luong_tinh")}
                          disabled={!!tossingTo}
                          className={`flex-1 py-2.5 px-3 rounded-xl border-2 font-bold text-xs transition-all duration-200 flex flex-col items-center justify-center gap-0.5 bg-amber-100 border-[#fbbf24] text-amber-950 hover:bg-amber-200 cursor-pointer shadow-sm active:translate-y-0.5`}
                          id="choose-luong-tinh-btn"
                        >
                          <span className="text-base">🌸 Lưỡng Tính</span>
                          <span className="text-[9px] text-amber-800 uppercase tracking-wide">Ném vào giỏ trái</span>
                        </button>

                        <button
                          onClick={() => handleGameChoice("don_tinh")}
                          disabled={!!tossingTo}
                          className={`flex-1 py-2.5 px-3 rounded-xl border-2 font-bold text-xs transition-all duration-200 flex flex-col items-center justify-center gap-0.5 bg-sky-100 border-sky-300 text-sky-950 hover:bg-sky-200 cursor-pointer shadow-sm active:translate-y-0.5`}
                          id="choose-don-tinh-btn"
                        >
                          <span className="text-base">🌼 Đơn Tính</span>
                          <span className="text-[9px] text-sky-800 uppercase tracking-wide">Ném vào giỏ phải</span>
                        </button>
                      </div>
                    )}
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
                            <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">
                              {step.description}
                            </p>
                          </div>

                          {/* Swap Control Buttons */}
                          <div className="flex flex-col gap-1">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveStep(idx, "up")}
                              className={`p-1.5 rounded border ${
                                idx === 0 
                                  ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed" 
                                  : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer"
                              }`}
                              title="Di chuyển lên"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={idx === scrambledSteps.length - 1}
                              onClick={() => handleMoveStep(idx, "down")}
                              className={`p-1.5 rounded border ${
                                idx === scrambledSteps.length - 1 
                                  ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed" 
                                  : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer"
                              }`}
                              title="Di chuyển xuống"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {sequencingFeedback && (
                        <div className={`p-4 rounded-xl border text-sm font-semibold leading-relaxed animate-fade-in ${
                          sequencingFeedback.includes("Tuyệt")
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-amber-50 border-amber-200 text-amber-800"
                        }`}>
                          {sequencingFeedback}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[#f1ece1] pt-4 mt-3 flex justify-end">
                      <button
                        onClick={handleCheckSequencing}
                        className="px-6 py-3 rounded-xl border-2 border-emerald-600 bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-all cursor-pointer shadow-md active:translate-y-0.5"
                      >
                        Kiểm Tra Quy Trình 🔍
                      </button>
                    </div>
                  </div>
                )}

                {/* SUB-STAGE 3B: INTERACTIVE POLLINATION SIMULATION WITH PRE-QUESTION */}
                {stage3SubStage === "simulation" && (
                  <div className="flex-1 flex flex-col justify-between animate-fade-in" id="stage3-simulation-view">
                    
                    {!stage3PreQuestionSolved ? (
                      /* Pre-simulation question box */
                      <div className="my-auto max-w-md mx-auto w-full p-5 bg-white border-2 border-amber-300 bg-amber-50/10 rounded-2xl shadow-sm space-y-4">
                        <h4 className="text-sm font-bold text-amber-855 uppercase tracking-wider flex items-center gap-1.5">
                          <span>🐝</span> Câu hỏi kích hoạt BiBi:
                        </h4>
                        <p className="text-sm sm:text-base font-bold text-[#2c251e] leading-relaxed">
                          Hoa mướp thụ phấn chủ yếu nhờ tác nhân nào trong tự nhiên?
                        </p>
                        
                        <div className="flex flex-col gap-2 pt-1.5">
                          {["Gió", "Côn trùng (ong, bướm)", "Nước mưa", "Tự thụ phấn"].map((opt, oIdx) => {
                            const isSelected = stage3PreQuestionChoice === opt;
                            const isCorrect = opt === "Côn trùng (ong, bướm)";
                            return (
                              <button
                                key={oIdx}
                                disabled={stage3PreQuestionAnswered && stage3PreQuestionSolved}
                                onClick={() => handleStage3PreQuestionAnswer(opt)}
                                className={`p-3 rounded-xl border-2 text-sm font-semibold text-left transition-all duration-200 flex items-center justify-between ${
                                  isSelected
                                    ? isCorrect
                                      ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                                      : "border-rose-400 bg-rose-50 text-rose-950 animate-shake"
                                    : "bg-white border-slate-200 text-slate-705 hover:bg-slate-50 cursor-pointer"
                                }`}
                              >
                                <span>{opt}</span>
                                {stage3PreQuestionAnswered && isSelected && (
                                  <span className="font-bold text-xs">
                                    {isCorrect ? "Đúng rồi! ✓" : "Sai rồi! ✗"}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {stage3PreQuestionAnswered && (
                          <div className={`p-3 rounded-xl border text-xs sm:text-sm font-medium leading-relaxed animate-fade-in ${
                            stage3PreQuestionSolved
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                              : "bg-rose-50 border-rose-200 text-rose-800"
                          }`}>
                            {stage3PreQuestionSolved
                              ? "Hoàn toàn chính xác! Bông hoa mướp cái có nhụy tiết ra mật ngọt thơm lừng để thu hút ong bướm đến truyền hạt phấn chéo từ bông mướp đực sang bông mướp cái."
                              : "Chưa chính xác rồi em ơi! Gợi ý: Hoa mướp có màu vàng rực rỡ, cánh hoa to và có tuyến mật ngọt. Loài vật nào rất thích hút mật ngọt?"}
                          </div>
                        )}

                        {stage3PreQuestionAnswered && (
                          <div className="pt-2 text-right">
                            {stage3PreQuestionSolved ? (
                              <button
                                onClick={() => {
                                  // Lock in solved state
                                  setStage3PreQuestionSolved(true);
                                }}
                                className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl border border-amber-500 cursor-pointer text-xs uppercase"
                              >
                                Bắt đầu bay 🐝➔
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setStage3PreQuestionAnswered(false);
                                  setStage3PreQuestionChoice(null);
                                }}
                                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-350 cursor-pointer text-xs uppercase"
                              >
                                Thử lại 🔄
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Actual simulation container */
                      <div className="flex-1 flex flex-col justify-between" id="actual-simulation-stage">
                        <div className="text-center mb-3">
                          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Trò Chơi Thực Hành 🐝
                          </span>
                          <h3 className="text-lg font-bold text-[#1e293b] mt-1.5">
                            Mô Phỏng: Giúp BiBi Thụ Phấn Cho Hoa
                          </h3>
                          <p className="text-xs text-slate-505 mt-0.5">
                            Bé hãy điều khiển giúp BiBi bay đến Nhị hoa đực lấy phấn, rồi mang sang đầu Nhụy hoa cái nhé!
                          </p>
                        </div>

                        {/* Interactive simulation stage map */}
                        <div className="h-56 w-full border-2 border-[#eae4cd] bg-[#fbfbfa] rounded-2xl relative overflow-hidden flex justify-between items-end pb-8 px-6 shadow-inner my-auto">
                          <span className="absolute top-4 left-6 text-xl opacity-20">☁️</span>
                          <span className="absolute top-8 right-16 text-2xl opacity-10">☁️</span>
                          <span className="absolute top-3 right-8 text-3xl opacity-25 text-amber-400">☀️</span>

                          {/* Male Flower (Nhị) */}
                          <div className="flex flex-col items-center relative z-10 w-24">
                            {!hasPollen && !isFruitGrown && (
                              <div className="absolute top-[-30px] flex gap-1 justify-center animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-300"></span>
                                <span className="w-2 h-2 rounded-full bg-yellow-400 border border-amber-300 mt-2"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-300 mt-1"></span>
                              </div>
                            )}
                            
                            <div className="text-5xl select-none relative">
                              🌼
                              <span className="absolute top-1 left-4 text-base animate-bounce">⚡</span>
                            </div>
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200 mt-2">
                              Nhị (Hoa đực)
                            </span>
                          </div>

                          {/* BiBi character */}
                          <div 
                            className="absolute bottom-[40px] z-20 transition-all duration-1000 ease-in-out"
                            style={{
                              left: beePosition === "stamen" ? "12%" : beePosition === "pistil" ? "74%" : "44%",
                              transform: "translateY(-50%)"
                            }}
                          >
                            <div className="relative">
                              {hasPollen && (
                                <div className="animate-pollen-aura" />
                              )}
                              
                              <BiBiBee expression={beeExpression} size={70} />
                              
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
                              <div className="flex flex-col items-center animate-fruit-grow">
                                <span className="text-6xl select-none filter drop-shadow">🥒</span>
                                <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 mt-2 animate-pulse">
                                  Quả mướp ngọt!
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <div className="relative select-none text-5xl">
                                  🌺
                                  <span className="absolute bottom-[-10px] left-3.5 w-6 h-5 bg-green-500 rounded-full border-2 border-emerald-700 opacity-80" />
                                </div>
                                <span className="text-[10px] font-bold text-[#453c30] bg-[#faf9f3] px-2 py-0.5 rounded-full border border-slate-200 mt-2">
                                  Nhụy (Hoa cái)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Simulation controls */}
                        <div className="bg-[#faf9f3] p-3 rounded-xl border border-[#eae4cd] flex flex-col items-center gap-2 mt-3 text-center">
                          {simulationStep === 1 && (
                            <div className="flex flex-col items-center gap-1.5 w-full">
                              <p className="text-sm text-[#453c30] font-bold">
                                💬 BiBi: "Bé hãy bấm nút dưới đây để tớ bay sang Nhị đực lấy phấn hoa nhé!"
                              </p>
                              <button
                                onClick={() => handleBeeAction("collect")}
                                className="w-full max-w-xs py-2.5 px-6 rounded-xl border-2 border-amber-500 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-sm shadow-md cursor-pointer active:translate-y-0.5"
                              >
                                🐝 Bay lấy phấn hoa ➔
                              </button>
                            </div>
                          )}

                          {simulationStep === 2 && (
                            <div className="flex flex-col items-center gap-1.5 w-full">
                              <p className="text-sm text-emerald-850 font-bold animate-pulse">
                                ✨ BiBi: "Đã bám đầy hạt phấn vàng rồi! Hãy dẫn tớ sang bông hoa cái nào!"
                              </p>
                              <button
                                onClick={() => handleBeeAction("pollinate")}
                                className="w-full max-w-xs py-2.5 px-6 rounded-xl border-2 border-emerald-600 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-md cursor-pointer active:translate-y-0.5"
                              >
                                🐝 Bay thụ phấn hoa cái ➔
                              </button>
                            </div>
                          )}

                          {simulationStep === 3 && (
                            <div className="flex flex-col items-center gap-3 w-full animate-fade-in">
                              <p className="text-sm text-emerald-800 font-bold leading-normal px-4">
                                🎉 Quá kỳ diệu! Cánh hoa cái héo rụng đi, bầu nhụy của hoa mướp đã thụ tinh thành công và phình to phát triển thành một quả mướp căng đầy chứa đầy hạt giống!
                              </p>
                              <div className="flex gap-3 w-full max-w-md">
                                <button
                                  onClick={restartSimulation}
                                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-350 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer active:translate-y-0.5"
                                >
                                  🔄 Chơi lại
                                </button>
                                <button
                                  onClick={() => {
                                    setCurrentStage(4);
                                    setBeeExpression("happy");
                                  }}
                                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 border-2 border-amber-500 hover:border-amber-600 text-amber-950 font-bold text-xs shadow-sm cursor-pointer active:translate-y-0.5 animate-pulse"
                                >
                                  Bài tập luyện tập ➔
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
            )}

            {/* CHẶNG 4 & CHẶNG 5: BÀI TẬP TRẮC NGHIỆM TƯƠNG TÁC ĐA DẠNG */}
            {(currentStage === 4 || currentStage === 5) && (
              <div className="flex-1 flex flex-col justify-between" id="stage-quiz-workspace">
                {(() => {
                  const questions = currentStage === 4 ? QUIZ_QUESTIONS_STAGE4 : QUIZ_QUESTIONS_STAGE5;
                  const currentQ = questions[quizIndex];
                  
                  return (
                    <div className="flex-1 flex flex-col justify-between h-full">
                      {/* Quiz Header info */}
                      <div className="text-center mb-4">
                        <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {currentStage === 4 ? "Chặng 4: Luyện Tập Cơ Bản" : "Chặng 5: Bác Học Nâng Cao"} ⚔️
                        </span>
                        <h3 className="text-lg font-bold text-slate-800 mt-2">
                          Câu hỏi {quizIndex + 1} trên {questions.length}
                        </h3>
                        
                        {/* Progress indicators */}
                        <div className="flex items-center justify-center gap-1.5 mt-2">
                          {questions.map((_, qIdx) => {
                            const isAnswered = qIdx < quizAnswers.length;
                            const isCorrect = isAnswered && quizAnswers[qIdx];
                            const isCurrent = qIdx === quizIndex;
                            return (
                              <span 
                                key={qIdx}
                                className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                                  isCurrent 
                                    ? "bg-indigo-400 border-indigo-600 scale-125 ring-2 ring-indigo-200"
                                    : isAnswered
                                    ? isCorrect
                                      ? "bg-emerald-500 border-emerald-600"
                                      : "bg-rose-500 border-rose-600"
                                    : "bg-slate-100 border-slate-300"
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Question Text block */}
                      <div className="my-auto space-y-4 max-w-lg mx-auto w-full">
                        <div className="p-4 bg-[#faf9f3] rounded-2xl border border-[#eae4cd] shadow-sm">
                          <p className="text-sm sm:text-base font-bold text-[#2c251e] leading-relaxed">
                            {currentQ.question}
                          </p>
                        </div>

                        {/* Render Question Inputs dynamically */}
                        <div className="space-y-2.5">
                          {currentQ.type === "single" && (
                            <div className="grid grid-cols-1 gap-2.5">
                              {currentQ.options?.map((opt, oIdx) => {
                                const isSelected = selectedOptions.includes(opt);
                                return (
                                  <button
                                    key={oIdx}
                                    disabled={showQuizFeedback}
                                    onClick={() => setSelectedOptions([opt])}
                                    className={`p-3 rounded-xl border-2 text-sm font-bold text-left transition-all duration-200 flex items-center gap-3.5 ${
                                      isSelected
                                        ? "border-amber-400 bg-amber-50/70"
                                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                                    }`}
                                  >
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-bold text-xs ${isSelected ? "bg-amber-400 border-amber-500 text-amber-950" : "border-slate-300 bg-slate-50 text-slate-500"}`}>
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {currentQ.type === "multiple" && (
                            <div className="grid grid-cols-1 gap-2.5">
                              <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider mb-1">
                                💡 Nhấp chọn tất cả câu trả lời đúng (có thể chọn nhiều):
                              </p>
                              {currentQ.options?.map((opt, oIdx) => {
                                const isSelected = selectedOptions.includes(opt);
                                return (
                                  <button
                                    key={oIdx}
                                    disabled={showQuizFeedback}
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedOptions(prev => prev.filter(o => o !== opt));
                                      } else {
                                        setSelectedOptions(prev => [...prev, opt]);
                                      }
                                    }}
                                    className={`p-3 rounded-xl border-2 text-sm font-bold text-left transition-all duration-200 flex items-center gap-3.5 ${
                                      isSelected
                                        ? "border-indigo-400 bg-indigo-50/40"
                                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                                    }`}
                                  >
                                    <input 
                                      type="checkbox" 
                                      checked={isSelected}
                                      readOnly
                                      disabled={showQuizFeedback}
                                      className="w-4.5 h-4.5 rounded text-indigo-605 border-slate-350 focus:ring-indigo-505"
                                    />
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {currentQ.type === "fill" && (
                            <div className="flex flex-col gap-2 max-w-md mx-auto w-full">
                              <input 
                                type="text"
                                value={filledAnswer}
                                disabled={showQuizFeedback}
                                onChange={(e) => setFilledAnswer(e.target.value)}
                                placeholder={currentQ.placeholder || "Ví dụ: thụ phấn..."}
                                className="w-full bg-white border-2 border-[#eae4cd] focus:border-[#fbbf24] focus:outline-none rounded-xl px-4 py-3 text-sm font-semibold"
                              />
                              <p className="text-[10px] text-slate-400 italic mt-0.5 text-center">
                                Gõ từ/cụm từ thích hợp vào ô trống rồi nộp bài.
                              </p>
                            </div>
                          )}

                          {currentQ.type === "select" && (
                            <div className="flex flex-col gap-2 max-w-md mx-auto w-full">
                              <select
                                value={selectedOptions[0] || ""}
                                disabled={showQuizFeedback}
                                onChange={(e) => setSelectedOptions([e.target.value])}
                                className="w-full bg-white border-2 border-[#eae4cd] focus:border-[#fbbf24] focus:outline-none rounded-xl px-4 py-3 text-sm font-bold text-slate-750"
                              >
                                <option value="">-- Click để chọn đáp án đúng --</option>
                                {currentQ.options?.map((opt, oIdx) => (
                                  <option key={oIdx} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Answer Feedback Banner */}
                        {showQuizFeedback && (
                          <div className={`p-4 rounded-xl border text-xs sm:text-sm font-medium leading-relaxed animate-fade-in ${
                            quizFeedbackCorrect
                              ? "bg-emerald-50 border-emerald-250 text-emerald-800"
                              : "bg-rose-50 border-rose-250 text-rose-800"
                          }`}>
                            <p className="font-bold mb-1 text-sm">
                              {quizFeedbackCorrect ? "🎉 Trả lời chính xác!" : "⚠️ Chưa đúng rồi!"}
                            </p>
                            {!quizFeedbackCorrect && (
                              <p className="mb-1 font-semibold">
                                Đáp án chính xác: <span className="underline">{Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer.join(", ") : currentQ.correctAnswer}</span>
                              </p>
                            )}
                            <p className="text-slate-655">{currentQ.explanation}</p>
                          </div>
                        )}
                      </div>

                      {/* Bottom action controls */}
                      <div className="border-t border-[#f1ece1] pt-4 mt-4 text-right">
                        {showQuizFeedback ? (
                          <button
                            onClick={() => handleNextQuizQuestion(questions, currentStage)}
                            className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl border border-indigo-700 cursor-pointer text-xs uppercase tracking-wider flex items-center gap-1.5 ml-auto active:translate-y-0.5 shadow-sm"
                          >
                            {quizIndex < questions.length - 1 ? "Câu tiếp theo" : "Hoàn thành chặng"} <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            disabled={
                              (currentQ.type === "fill" && !filledAnswer.trim()) ||
                              (currentQ.type !== "fill" && selectedOptions.length === 0)
                            }
                            onClick={() => handleQuizSubmit(questions)}
                            className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-650 text-white font-bold rounded-xl border border-indigo-600 disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed text-xs uppercase tracking-wider shadow-sm ml-auto active:translate-y-0.5"
                          >
                            Nộp câu trả lời 🔍
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* CHẶNG 6: BÀI TẬP BẢNG TỔNG KẾT ĐIỂM SỐ & THỐNG KÊ LƯỢT LÀM */}
            {currentStage === 6 && (
              <div className="flex-1 flex flex-col justify-between animate-fade-in" id="stage6-report-workspace">
                <div className="text-center space-y-3 py-6">
                  <div className="inline-block p-4 bg-[#ecfdf5] rounded-full border-4 border-emerald-500 animate-bounce">
                    <span className="text-5xl">🎓🌟</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#1e293b]">Bảng Vàng Học Tập Của Bạn</h3>
                  <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                    Xin chúc mừng học sinh <strong className="text-amber-600 font-bold">{studentInfo?.name}</strong> của tập thể lớp <strong className="text-slate-800">{studentInfo?.className}</strong>, trường <strong className="text-slate-800">{studentInfo?.school}</strong> đã xuất sắc tốt nghiệp khóa học sinh sản thực vật có hoa!
                  </p>
                </div>

                <div className="bg-[#faf9f3] rounded-2xl p-5 border border-[#eae4cd] space-y-4 max-w-md mx-auto w-full shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 text-center border-b border-amber-250 pb-2">
                    Chi tiết điểm số lượt thi vừa xong:
                  </h4>
                  <div className="space-y-2.5 text-sm font-medium">
                    <div className="flex justify-between">
                      <span>Chặng 1: Nhận diện cấu tạo hoa</span>
                      <span className="text-emerald-600 font-bold">100 / 100đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chặng 2: Phân loại hoa (Đơn/Lưỡng tính)</span>
                      <span className="text-emerald-600 font-bold">{gameScore * 10} / 80đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chặng 3: Sắp xếp & Mô phỏng thụ phấn</span>
                      <span className="text-emerald-600 font-bold">100 / 100đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chặng 4: Luyện tập cơ bản (Trắc nghiệm)</span>
                      <span className="text-emerald-600 font-bold">{(stage4Score || 0) * 10} / 100đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chặng 5: Thử thách nâng cao</span>
                      <span className="text-emerald-600 font-bold">{(attempts[0]?.scores.stage5 || 0) * 10} / 100đ</span>
                    </div>
                    <div className="flex justify-between border-t border-[#eae4cd] pt-2 font-bold text-base mt-2">
                      <span className="text-slate-800">TỔNG ĐIỂM ĐẠT ĐƯỢC:</span>
                      <span className="text-amber-600">{attempts[0]?.totalScore || 0} / 480 điểm</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto w-full mt-6">
                  <button
                    onClick={restartAllCurriculum}
                    className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl border-2 border-amber-500 hover:border-amber-600 shadow-md cursor-pointer transition-all duration-200 text-center uppercase tracking-wider text-xs active:translate-y-0.5"
                  >
                    🔄 Làm lại từ đầu
                  </button>
                  <button
                    onClick={() => {
                      setStudentInfo(null);
                      restartAllCurriculum();
                    }}
                    className="flex-1 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border-2 border-slate-300 shadow-sm cursor-pointer transition-all duration-200 text-center uppercase tracking-wider text-xs active:translate-y-0.5"
                  >
                    👤 Đổi học sinh khác
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* COLUMN 3: RIGHT PANEL - PROFILE, ACHIEVEMENTS & ATTEMPTS HISTORY (xl:col-span-3) */}
        <section className="xl:col-span-3 lg:col-span-12 col-span-1 flex flex-col gap-5" id="right-dashboard-column">
          
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-5 border-2 border-[#eae4cd] play-card flex flex-col gap-3 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>👤</span> Góc học tập của em
            </h3>
            <div className="p-3 bg-[#faf9f3] rounded-xl border border-amber-100 flex flex-col gap-1">
              <p className="text-sm font-bold text-amber-955 truncate">{studentInfo?.name}</p>
              <p className="text-xs text-slate-500 truncate">Lớp: {studentInfo?.className}</p>
              <p className="text-xs text-slate-500 truncate">Trường: {studentInfo?.school}</p>
            </div>
            <button
              onClick={() => {
                setStudentInfo(null);
                restartAllCurriculum();
              }}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-650 border border-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
            >
              Đổi học sinh 👤
            </button>
          </div>

          {/* Bảng thành tích (Moved from Footer!) */}
          <div className="bg-white rounded-2xl p-5 border-2 border-[#eae4cd] play-card flex flex-col gap-3 shadow-sm animate-fade-in">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Trophy className="w-4.5 h-4.5 text-amber-500" />
              Thành tích đạt được
            </h3>
            <div className="flex flex-col gap-2.5">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all duration-300 ${
                    ach.unlocked
                      ? "bg-[#faf9f3] border-[#fbbf24] text-[#2c251e] shadow-xs"
                      : "bg-slate-50/50 border-[#f1ece1] text-slate-400 opacity-60"
                  }`}
                >
                  <div className="text-2xl p-1 bg-white rounded-lg border flex-shrink-0">
                    {ach.unlocked ? ach.emoji : "🔒"}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold leading-tight truncate">{ach.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-normal truncate" title={ach.description}>
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attempts History */}
          <div className="bg-white rounded-2xl p-5 border-2 border-[#eae4cd] play-card flex flex-col gap-3 shadow-sm flex-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-505 flex items-center gap-1.5">
              <span>📊</span> Lịch sử các lượt học
            </h3>
            {attempts.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <p className="text-xs text-slate-400 italic">Chưa thực hiện xong lượt học nào. Hãy hoàn thành 5 Chặng để ghi danh nhé!</p>
              </div>
            ) : (
              <div className="space-y-3.5 overflow-y-auto max-h-[350px]">
                {attempts.map((att, idx) => (
                  <div key={att.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1 text-xs shadow-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-amber-800">Lượt học {attempts.length - idx}</span>
                      <span className="text-emerald-600">{att.totalScore}đ / 480đ</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>{att.timestamp}</span>
                      <span className="truncate max-w-[120px]">{att.studentInfo.name}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 text-[9px] text-slate-500 mt-2 border-t border-slate-250 pt-2 text-center">
                      <div>C1: 100</div>
                      <div>C2: {att.scores.stage2 * 10}</div>
                      <div>C3: 100</div>
                      <div>C4: {att.scores.stage4 * 10}</div>
                      <div>C5: {att.scores.stage5 * 10}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
      )}

      {/* Floating Hỏi BiBi Chat Toggle Drawer Button */}
      {studentInfo && !isChatOpen && (
        <button
          onClick={() => {
            setIsChatOpen(true);
            setBeeExpression("happy");
          }}
          className="fixed bottom-6 right-6 z-40 bg-amber-400 hover:bg-amber-500 text-amber-955 font-bold py-3.5 px-6 rounded-full border-2 border-amber-500 hover:border-amber-600 shadow-xl flex items-center gap-2.5 animate-bounce cursor-pointer transition-all duration-200 active:scale-95"
          id="floating-chat-toggle-btn"
        >
          <span className="text-2xl animate-float">🐝</span>
          <span className="text-sm font-bold uppercase tracking-wider">Hỏi BiBi 💬</span>
        </button>
      )}

      {/* Chat sliding drawer viewport */}
      {isChatOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-all duration-300"
            onClick={() => setIsChatOpen(false)}
          />
          <section 
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white z-50 flex flex-col shadow-2xl animate-slide-in-right border-l-2 border-[#eae4cd]"
            id="chat-workspace-section"
          >
            <div className="bg-[#faf9f3] p-4 border-b border-[#eae4cd] flex items-center justify-between gap-3" id="chat-header-panel">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-full p-1.5 border border-[#e5dfc3] shadow-sm">
                  <BiBiBee expression={beeExpression} size={65} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                    Trợ lý Ong Vàng BiBi 🐝
                  </h3>
                  <span className="text-xs inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Sẵn sàng giải đáp
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMessages([
                      {
                        id: "welcome-reset",
                        role: "assistant",
                        content: `BiBi đã dọn dẹp bàn học sạch sẽ rồi nè! ${studentInfo ? studentInfo.name : "Bạn nhỏ"} có câu hỏi nào mới về nhị, nhụy hay bài học khoa học lớp 5 không? Hãy trò chuyện cùng BiBi nhé! 🐝🌻`,
                        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                      },
                    ]);
                  }}
                  title="Xóa lịch sử chat"
                  className="p-1.5 text-slate-400 hover:text-slate-650 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  id="clear-chat-history-btn"
                >
                  <RotateCcw className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  title="Đóng cửa sổ chat"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors font-bold text-base cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

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
                      <div className="w-8 h-8 bg-amber-105 rounded-full flex items-center justify-center text-base border border-amber-300 mt-1 flex-shrink-0">
                        🐝
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                        isAssistant
                          ? "bg-white border border-[#eae4cd] text-[#2c251e] rounded-tl-sm shadow-sm"
                          : "bg-amber-400 text-amber-950 font-semibold rounded-tr-sm self-end"
                      }`}
                    >
                      <div className="whitespace-pre-line prose max-w-none">
                        {msg.content}
                      </div>
                      <span className="block text-[9px] text-slate-400 mt-1 text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex items-start gap-2.5 justify-start animate-pulse" id="bibi-typing-loader">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-base border border-amber-300 mt-1">
                    🐝
                  </div>
                  <div className="bg-white border border-[#eae4cd] rounded-2xl rounded-tl-sm p-3.5 text-sm text-slate-450">
                    BiBi đang tìm mật hoa tri thức để trả lời bạn... 🐝✨
                  </div>
                </div>
              )}
            </div>

            {apiKeyError && (
              <div className="px-4 py-2 bg-amber-50 border-y border-amber-200 text-xs text-amber-900 flex items-start gap-2" id="api-key-warning-card">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-xs">Chế độ Học Offline kích hoạt!</p>
                  <p className="text-[11px] text-amber-800 leading-normal">
                    Chưa cài đặt bí mật <strong>GEMINI_API_KEY</strong> nên BiBi đang dùng bộ câu trả lời thông minh được biên soạn sẵn từ SGK. {studentInfo ? studentInfo.name : "Bạn nhỏ"} vẫn thỏa sức hỏi đáp nhé!
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 bg-[#faf9f3] border-t border-[#eae4cd] space-y-2.5" id="chat-controls-area">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none" id="quick-questions-panel">
                <span className="text-xs text-slate-400 font-bold flex-shrink-0 flex items-center gap-1 uppercase">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Đố BiBi:
                </span>
                
                {currentStage === 1 && (
                  <>
                    <button
                      onClick={() => handleQuickQuestion("Nhị hoa và nhụy hoa khác nhau thế nào BiBi ơi?")}
                      className="text-xs bg-white hover:bg-amber-100 border border-[#eae4cd] rounded-full px-3 py-1 text-slate-650 font-semibold whitespace-nowrap cursor-pointer"
                    >
                      Nhị vs Nhụy khác nhau gì? 🤔
                    </button>
                    <button
                      onClick={() => handleQuickQuestion("Cánh hoa có vai trò gì trong sinh sản vậy BiBi?")}
                      className="text-xs bg-white hover:bg-amber-100 border border-[#eae4cd] rounded-full px-3 py-1 text-slate-650 font-semibold whitespace-nowrap cursor-pointer"
                    >
                      Vai trò của Cánh hoa 🌸
                    </button>
                  </>
                )}

                {currentStage === 2 && (
                  <>
                    <button
                      onClick={() => handleQuickQuestion("Tại sao hoa mướp lại là hoa đơn tính vậy BiBi?")}
                      className="text-xs bg-white hover:bg-amber-100 border border-[#eae4cd] rounded-full px-3 py-1 text-slate-650 font-semibold whitespace-nowrap cursor-pointer"
                    >
                      Tại sao mướp là hoa đơn tính? 🥒
                    </button>
                    <button
                      onClick={() => handleQuickQuestion("Cho tớ 3 ví dụ về hoa lưỡng tính phổ biến với!")}
                      className="text-xs bg-white hover:bg-amber-100 border border-[#eae4cd] rounded-full px-3 py-1 text-slate-650 font-semibold whitespace-nowrap cursor-pointer"
                    >
                      3 ví dụ hoa lưỡng tính 🌺
                    </button>
                  </>
                )}

                {currentStage === 3 && (
                  <>
                    <button
                      onClick={() => handleQuickQuestion("Quá trình thụ phấn diễn ra nhờ những gì hả BiBi?")}
                      className="text-xs bg-white hover:bg-amber-100 border border-[#eae4cd] rounded-full px-3 py-1 text-slate-650 font-semibold whitespace-nowrap cursor-pointer"
                    >
                      Thụ phấn nhờ những ai? 💨
                    </button>
                    <button
                      onClick={() => handleQuickQuestion("Sau khi thụ tinh thì hoa bưởi sẽ biến đổi thế nào?")}
                      className="text-xs bg-white hover:bg-amber-100 border border-[#eae4cd] rounded-full px-3 py-1 text-slate-650 font-semibold whitespace-nowrap cursor-pointer"
                    >
                      Sự biến đổi sau thụ tinh 🍊
                    </button>
                  </>
                )}
              </div>

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
                  placeholder="Nhập câu hỏi về bài học khoa học..."
                  disabled={isSending}
                  className="flex-1 bg-white border-2 border-[#eae4cd] focus:border-[#fbbf24] focus:outline-none rounded-xl px-3.5 py-2.5 text-sm"
                />
                <button
                  type="submit"
                  disabled={isSending || !inputValue.trim()}
                  className="bg-amber-400 hover:bg-amber-500 disabled:bg-slate-100 disabled:text-slate-400 text-amber-955 font-bold p-3 rounded-xl border-2 border-transparent disabled:border-transparent hover:border-amber-500 transition-colors cursor-pointer"
                  id="submit-chat-button"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
