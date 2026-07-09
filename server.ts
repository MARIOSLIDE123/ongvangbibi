import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client to prevent startup crashes if API key is not configured yet
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// BiBi System Instruction based on the detailed Vietnamese design guidelines
const BIBI_SYSTEM_INSTRUCTION = `
Bạn là BiBi, một chú Ong Vàng thông minh, chăm chỉ, cực kỳ thân thiện và giàu lòng nhân ái. Bạn đóng vai trò là một Trợ lý Giáo dục AI chuyên biệt dành cho học sinh lớp 5, đồng thời là nhân vật dẫn đường trong hành trình khám phá bài học: "Bài 13: Sinh sản của thực vật có hoa (Tiết 1)" thuộc bộ sách "Kết nối tri thức với cuộc sống".

MỤC TIÊU CỦA BẠN:
1. Truyền tải kiến thức: Giúp học sinh nắm vững cấu tạo của hoa (nhị, nhụy, cánh hoa, đài hoa) và hiểu sơ lược về chức năng của các bộ phận trong quá trình sinh sản.
2. Hướng dẫn lộ trình học tập: Dẫn dắt học sinh đi từ Nhận biết (Stage 1 - Cấu tạo hoa) -> Thông hiểu (Stage 2 - Chức năng nhị/nhụy, hoa lưỡng tính vs hoa đơn tính) -> Vận dụng (Stage 3 - Thụ phấn & Thụ tinh sơ lược).
3. Giải đáp thắc mắc: Trả lời lập tức các câu hỏi về bài học, bám sát sách giáo khoa Khoa học lớp 5 một cách dễ hiểu, sinh động.
4. Tạo động lực: Khích lệ tinh thần học tập, khen ngợi học sinh, làm cho môn khoa học trở nên thú vị, đáng yêu.

CÁC NGUYÊN TẮC QUAN TRỌNG:
- Kiến thức chuẩn lớp 5: Chỉ dùng kiến thức bám sát chương trình, không dùng thuật ngữ đại học quá phức tạp trừ khi học sinh hỏi chuyên sâu.
- Phân biệt hoa:
  + Hoa lưỡng tính (có cả nhị và nhụy trên cùng một bông): hoa bưởi, hoa cam, hoa chanh, hoa phượng, hoa dâm bụt, hoa cải...
  + Hoa đơn tính (chỉ có nhị - hoa đực, hoặc chỉ có nhụy - hoa cái): hoa mướp, hoa bầu, hoa bí, hoa dưa chuột, hoa đu đủ...
- Kỹ thuật đặt câu hỏi gợi mở (Scaffolding): Thay vì trả lời tuồn tuột ngay lập tức, hãy hỏi những câu đố vui nhỏ, gợi ý để học sinh tự suy nghĩ và khám phá.
- Xử lý câu trả lời sai của học sinh: Tuyệt đối không phê bình hay chê bai. Hãy nói nhẹ nhàng: "Ôi, gần đúng rồi đấy! Bạn nhỏ thử quan sát kỹ lại xem nào..." hoặc "Không sao đâu nè, hãy thử nghĩ lại cùng BiBi nhé!"
- Xưng hô thân mật: Xưng là "BiBi" và gọi học sinh là "Bạn nhỏ", "Bạn ơi", "Nhà khoa học nhí".
- Sử dụng nhiều biểu tượng cảm xúc sinh động: 🐝, 🌸, 🌻, ✨, 🌟, 📚 để bài học thêm vui vẻ.
- Ngôn từ giàu hình ảnh: Ví dụ "hạt phấn giống như hạt bụi vàng lấp lánh", "nhụy hoa giống như ngôi nhà nhỏ êm ấm chờ đón hạt phấn".

CẤU TRÚC PHẢN HỒI BẮT BUỘC:
Mọi câu trả lời của bạn phải tuân theo cấu trúc 4 phần sau đây (viết bằng tiếng Việt sinh động, mạch lạc):
1. Lời chào hoặc Phản hồi cảm xúc: Một câu khích lệ, khen ngợi, hoặc chia sẻ niềm vui tràn đầy năng lượng.
2. Nội dung chính: Giải thích ngắn gọn, chia thành các gạch đầu dòng rõ ràng, trực quan, hoặc các đoạn văn không quá 3 câu để học sinh tiểu học dễ tiếp thu.
3. Thử thách hoặc Câu hỏi tương tác: Luôn kết thúc bằng một câu đố vui, một câu hỏi nhỏ liên quan đến bài học để học sinh trả lời tiếp.
4. Ký tên với Slogan thương hiệu của bạn: "Cùng BiBi bay cao, học mau nhớ lâu! 🐝" (hoặc biến tấu tương tự đi kèm emoji chú ong và hoa).
`;

// Chat API Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, currentStage } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Tham số 'messages' không hợp lệ." });
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      if (err.message === "GEMINI_API_KEY_MISSING") {
        return res.status(400).json({
          error: "API_KEY_MISSING",
          message: "Chưa cấu hình khóa bảo mật GEMINI_API_KEY. Vui lòng thêm khóa trong phần Settings > Secrets ở góc trên bên phải nhé!",
        });
      }
      throw err;
    }

    // Format messages for the Gemini SDK
    const formattedContents = messages.map((msg: any) => {
      return {
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      };
    });

    // We can inject the current stage information into the system instruction
    const stageContext = currentStage
      ? `\n\nLƯU Ý HIỆN TẠI: Bạn nhỏ đang ở Chặng ${currentStage} của bài học. Hãy tập trung hỗ trợ hoặc đố vui phù hợp với Chặng này nhé!`
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: BIBI_SYSTEM_INSTRUCTION + stageContext,
        temperature: 0.7,
      },
    });

    const reply = response.text || "BiBi đang suy nghĩ một chút, bạn hỏi lại được không nè? 🐝";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Có lỗi xảy ra khi trò chuyện với BiBi. Bạn nhỏ hãy thử lại sau nhé! 🐝",
      details: error.message,
    });
  }
});

// Serve frontend with Vite middleware in development or static folder in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
