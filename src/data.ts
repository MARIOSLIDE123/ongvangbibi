import { FlowerPart, FlowerGameItem, LessonStage, Achievement, QuizQuestion } from "./types";

export const FLOWER_PARTS: FlowerPart[] = [
  {
    id: "nhi",
    name: "Stamen",
    vietnameseName: "Nhị hoa (Nhị)",
    description: "Cơ quan sinh sản đực của hoa.",
    kidsExplanation: "Là bộ phận chứa các hạt phấn vàng li ti giống như những chàng trai mang quà lấp lánh đi gõ cửa.",
    roleInReproduction: "Gồm có chỉ nhị và bao phấn chứa hạt phấn. Khi hạt phấn chín sẽ được giải phóng ra ngoài để thụ phấn.",
    color: "#fbbf24", // yellow-400
  },
  {
    id: "nhuy",
    name: "Pistil",
    vietnameseName: "Nhụy hoa (Nhụy)",
    description: "Cơ quan sinh sản cái của hoa.",
    kidsExplanation: "Thường nằm trang trọng ở chính giữa hoa, giống như một ngôi nhà nhỏ êm ấm với vòi nhụy vươn lên đón quà bụi vàng.",
    roleInReproduction: "Gồm đầu nhụy (dính để giữ hạt phấn), vòi nhụy, bầu nhụy và noãn. Noãn chứa tế bào sinh dục cái sẽ phát triển thành hạt sau khi thụ tinh.",
    color: "#f43f5e", // rose-500
  },
  {
    id: "canh_hoa",
    name: "Petals",
    vietnameseName: "Cánh hoa (Tràng hoa)",
    description: "Bộ phận bao quanh nhị và nhụy, thường có màu sắc sặc sỡ.",
    kidsExplanation: "Là những chiếc váy rực rỡ, thơm ngát tỏa hương để thu hút các bạn ong như BiBi hay bướm xinh ghé thăm giúp sức thụ phấn.",
    roleInReproduction: "Bảo vệ nhị nhụy bên trong và mời gọi côn trùng mang hạt phấn đi khắp nơi.",
    color: "#a855f7", // purple-500
  },
  {
    id: "dai_hoa",
    name: "Sepals",
    vietnameseName: "Đài hoa",
    description: "Bộ phận nằm ở phía dưới cánh hoa, sát với cuống hoa.",
    kidsExplanation: "Là những chiếc lá xanh bé nhỏ, giống như những người lính gác thầm lặng bảo vệ nụ hoa khi bạn ấy còn đang e ấp ngủ.",
    roleInReproduction: "Bảo vệ nụ hoa lúc chưa nở và nâng đỡ tràng hoa khi hoa đã xòe nở rực rỡ.",
    color: "#22c55e", // green-500
  },
];

export const FLOWER_GAME_ITEMS: FlowerGameItem[] = [
  {
    id: "hoa_buoi",
    name: "Hoa bưởi",
    type: "luong_tinh",
    emoji: "🌸",
    description: "Hoa màu trắng muốt, hương thơm ngào ngạt.",
    explanation: "Hoa bưởi có cả nhị và nhụy trên cùng một bông hoa, giúp hoa tự thụ phấn rất dễ dàng!",
  },
  {
    id: "hoa_muop",
    name: "Hoa mướp",
    type: "don_tinh",
    emoji: "🌼",
    description: "Hoa màu vàng tươi rực rỡ dưới nắng hè.",
    explanation: "Hoa mướp là hoa đơn tính! Trên giàn có bông mướp đực (chỉ có nhị) và bông mướp cái (chỉ có nhụy với quả mướp nhỏ xíu ở cuống).",
  },
  {
    id: "hoa_dam_but",
    name: "Hoa dâm bụt",
    type: "luong_tinh",
    emoji: "🌺",
    description: "Cánh hoa to màu đỏ rực, có nhị nhụy vươn dài nổi bật.",
    explanation: "Dâm bụt là hoa lưỡng tính điển hình! Trông xa thấy ngay cái vòi dài màu đỏ có cả các bao phấn vàng xung quanh và đầu nhụy đỏ sậm ở đỉnh.",
  },
  {
    id: "hoa_bi_ngo",
    name: "Hoa bí ngô",
    type: "don_tinh",
    emoji: "🌻",
    description: "Hoa hình chuông màu vàng cam ấm áp.",
    explanation: "Hoa bí ngô đơn tính đó nha! Các bạn ong phải bay từ hoa đực sang hoa cái để giúp bạn ấy truyền phấn thì mới đậu quả được.",
  },
  {
    id: "hoa_cam",
    name: "Hoa cam",
    type: "luong_tinh",
    emoji: "🍊",
    description: "Những bông hoa nhỏ xinh màu trắng, thơm dìu dịu.",
    explanation: "Cam là cây có hoa lưỡng tính. Mỗi bông hoa cam bé xíu đều mang sứ mệnh tự hoàn thành thụ phấn để kết trái ngọt lịm.",
  },
  {
    id: "hoa_dua_chuot",
    name: "Hoa dưa chuột",
    type: "don_tinh",
    emoji: "🥒",
    description: "Hoa nhỏ màu vàng nhạt, mọc nách lá.",
    explanation: "Dưa chuột cũng giống bầu bí, là hoa đơn tính. Hoa đực héo rụng đi, còn hoa cái được thụ phấn sẽ lớn nhanh thành quả dưa chuột mát giòn.",
  },
  {
    id: "hoa_phuong",
    name: "Hoa phượng",
    type: "luong_tinh",
    emoji: "🔥",
    description: "Cánh hoa đỏ thắm, báo hiệu mùa hè rực rỡ.",
    explanation: "Mỗi bông hoa phượng vĩ đều mang đầy đủ các sợi nhị uốn cong mang bao phấn đen và một nhụy thanh mảnh ở giữa - là hoa lưỡng tính!",
  },
  {
    id: "hoa_bau",
    name: "Hoa bầu",
    type: "don_tinh",
    emoji: "🍈",
    description: "Hoa màu trắng tinh khiết, thường nở vào chiều tối.",
    explanation: "Hoa bầu là hoa đơn tính! Hoa bầu cái có phần bầu noãn ở cuống hoa tròn phúng phính sẵn sàng chờ được thụ phấn để thành quả bầu.",
  },
];

export const LESSON_STAGES: LessonStage[] = [
  {
    id: 1,
    title: "Chặng 1: Thử thách Ghép Tên Bộ Phận Hoa",
    subtitle: "Nhà thiết kế hoa học 🔬",
    description: "Vượt qua thử thách đặt tên các bộ phận của hoa: nhị hoa, nhụy hoa, cánh hoa và đài hoa để mở khóa vườn khoa học.",
  },
  {
    id: 2,
    title: "Chặng 2: Đường đua Phân loại Hoa Đơn/Lưỡng Tính",
    subtitle: "Vua phân loại hoa lớp 5 🏆",
    description: "Phân loại các loài hoa vào giỏ Lưỡng tính và Đơn tính. Thử tài giữ chuỗi trả lời đúng liên tục thật cao nhé!",
  },
  {
    id: 3,
    title: "Chặng 3: Cuộc phiêu lưu Thụ phấn của BiBi",
    subtitle: "Sự ra đời của quả & hạt 🌱",
    description: "Sắp xếp quy trình sinh sản và trực tiếp điều khiển ong BiBi bay đi tìm mật, mang phấn hoa để giúp tạo ra trái ngọt chín mọng.",
  },
  {
    id: 4,
    title: "Chặng 4: Bài tập Luyện tập Cơ bản",
    subtitle: "Chiến binh khoa học nhí ⚔️",
    description: "Thử sức với 10 câu hỏi kiểm tra kiến thức nền tảng về nhị, nhụy, quá trình thụ phấn và thụ tinh của thực vật có hoa.",
  },
  {
    id: 5,
    title: "Chặng 5: Thử thách Bác học Nâng cao",
    subtitle: "Nhà bác học tương lai 🎓",
    description: "Chinh phục 10 câu hỏi nâng cao có tính phân loại cao để nhận bằng tốt nghiệp xuất sắc từ chú ong vàng BiBi.",
  },
];

export const QUIZ_QUESTIONS_STAGE4: QuizQuestion[] = [
  {
    id: 1,
    type: "single",
    question: "Cơ quan sinh sản đực của thực vật có hoa gọi là gì?",
    options: ["Nhụy hoa", "Nhị hoa", "Cánh hoa", "Đài hoa"],
    correctAnswer: "Nhị hoa",
    explanation: "Nhị hoa chứa bao phấn và chỉ nhị, đóng vai trò là cơ quan sinh sản đực."
  },
  {
    id: 2,
    type: "single",
    question: "Cơ quan sinh sản cái của thực vật có hoa gọi là gì?",
    options: ["Nhị hoa", "Nhụy hoa", "Cuống hoa", "Tràng hoa"],
    correctAnswer: "Nhụy hoa",
    explanation: "Nhụy hoa nằm ở trung tâm bông hoa, chứa bầu nhụy và noãn, là cơ quan sinh sản cái."
  },
  {
    id: 3,
    type: "multiple",
    question: "Những loài hoa nào dưới đây là hoa đơn tính? (Chọn tất cả các đáp án đúng)",
    options: ["Hoa mướp", "Hoa phượng", "Hoa bí ngô", "Hoa dâm bụt"],
    correctAnswer: ["Hoa mướp", "Hoa bí ngô"],
    explanation: "Hoa mướp và hoa bí ngô chỉ có nhị (hoa đực) hoặc chỉ có nhụy (hoa cái) trên một bông hoa nên là hoa đơn tính."
  },
  {
    id: 4,
    type: "fill",
    question: "Hiện tượng hạt phấn tiếp xúc với đầu nhụy được gọi là gì?",
    placeholder: "Nhập câu trả lời (ví dụ: thụ phấn)...",
    correctAnswer: "thụ phấn",
    explanation: "Sự tiếp xúc giữa hạt phấn của nhị hoa và đầu nhụy của nhụy hoa gọi là hiện tượng thụ phấn."
  },
  {
    id: 5,
    type: "select",
    question: "Sau khi thụ tinh, noãn của hoa sẽ phát triển thành bộ phận nào dưới đây?",
    options: ["Hạt", "Quả", "Rễ", "Lá"],
    correctAnswer: "Hạt",
    explanation: "Noãn sau khi thụ tinh sẽ biến đổi và phát triển thành hạt chứa phôi cây con."
  },
  {
    id: 6,
    type: "select",
    question: "Sau khi thụ tinh, bầu nhụy của hoa sẽ phát triển thành bộ phận nào dưới đây?",
    options: ["Hạt", "Quả", "Hoa mới", "Cành cây"],
    correctAnswer: "Quả",
    explanation: "Bầu nhụy phình to và phát triển thành quả để bao bọc và bảo vệ hạt bên trong."
  },
  {
    id: 7,
    type: "single",
    question: "Những loài hoa có cả nhị và nhụy trên cùng một bông hoa được gọi là gì?",
    options: ["Hoa đơn tính", "Hoa lưỡng tính", "Hoa khuyết", "Hoa vô tính"],
    correctAnswer: "Hoa lưỡng tính",
    explanation: "Hoa lưỡng tính chứa đầy đủ cả cơ quan sinh sản đực (nhị) và cái (nhụy) trên cùng một bông hoa."
  },
  {
    id: 8,
    type: "multiple",
    question: "Những bộ phận nào dưới đây thuộc về cấu tạo của Nhụy hoa? (Chọn tất cả các đáp án đúng)",
    options: ["Bao phấn", "Đầu nhụy", "Bầu nhụy", "Chỉ nhị"],
    correctAnswer: ["Đầu nhụy", "Bầu nhụy"],
    explanation: "Nhụy hoa gồm đầu nhụy, vòi nhụy, bầu nhụy và noãn. Bao phấn và chỉ nhị thuộc về Nhị hoa."
  },
  {
    id: 9,
    type: "fill",
    question: "Tế bào sinh dục đực kết hợp với tế bào sinh dục cái (ở noãn) tạo thành cấu trúc nào dưới đây?",
    placeholder: "Nhập câu trả lời (ví dụ: hợp tử)...",
    correctAnswer: "hợp tử",
    explanation: "Tế bào sinh dục đực trong hạt phấn kết hợp với tế bào sinh dục cái trong noãn tạo thành Hợp tử."
  },
  {
    id: 10,
    type: "single",
    question: "Loài hoa nào dưới đây tự thụ phấn là chính do có nhị và nhụy chín cùng lúc trên cùng một bông hoa?",
    options: ["Hoa bưởi", "Hoa ngô (bắp)", "Hoa bí ngô đực", "Hoa mướp cái"],
    correctAnswer: "Hoa bưởi",
    explanation: "Hoa bưởi là hoa lưỡng tính chín đồng đều cả nhị và nhụy nên có khả năng tự thụ phấn cao."
  }
];

export const QUIZ_QUESTIONS_STAGE5: QuizQuestion[] = [
  {
    id: 1,
    type: "single",
    question: "Tại sao hoa mướp đực không bao giờ có thể kết thành quả mướp?",
    options: [
      "Vì hoa đực không được côn trùng thụ phấn",
      "Vì hoa đực không có bầu nhụy chứa noãn",
      "Vì cánh hoa đực rụng quá nhanh",
      "Vì hạt phấn của hoa đực không có chất dinh dưỡng"
    ],
    correctAnswer: "Vì hoa đực không có bầu nhụy chứa noãn",
    explanation: "Chỉ có bầu nhụy của hoa cái mới phình to tạo thành quả sau thụ tinh. Hoa đực chỉ có nhị và hạt phấn nên không thể tạo quả."
  },
  {
    id: 2,
    type: "multiple",
    question: "Những tác nhân nào dưới đây thường giúp thụ phấn cho thực vật có hoa trong tự nhiên? (Chọn tất cả các đáp án đúng)",
    options: ["Côn trùng (ong, bướm)", "Gió", "Ánh sáng mặt trời", "Nước mưa hoặc dòng nước"],
    correctAnswer: ["Côn trùng (ong, bướm)", "Gió", "Nước mưa hoặc dòng nước"],
    explanation: "Hoa thụ phấn nhờ gió, nước và côn trùng. Ánh sáng mặt trời giúp cây quang hợp chứ không phải tác nhân truyền phấn."
  },
  {
    id: 3,
    type: "fill",
    question: "Hoa ngô (bắp) có các hạt phấn nhỏ, nhẹ và dễ bay. Loài hoa này chủ yếu thụ phấn nhờ tác nhân nào?",
    placeholder: "Nhập câu trả lời (ví dụ: gió)...",
    correctAnswer: "gió",
    explanation: "Hoa ngô thụ phấn nhờ gió. Gió thổi hạt phấn nhẹ rơi từ cờ ngô (hoa đực ở trên) xuống râu ngô (hoa cái ở dưới)."
  },
  {
    id: 4,
    type: "select",
    question: "Những bông hoa thụ phấn nhờ côn trùng thường có đặc điểm nổi bật nào dưới đây?",
    options: [
      "Cánh hoa màu sắc sặc sỡ và có hương thơm ngào ngạt",
      "Hoa màu xanh lục nhạt và không có mùi thơm",
      "Hoa không có cánh hoa và đài hoa",
      "Hoa chỉ nở vào mùa đông lạnh giá"
    ],
    correctAnswer: "Cánh hoa màu sắc sặc sỡ và có hương thơm ngào ngạt",
    explanation: "Màu sắc nổi bật và hương thơm thu hút ong bướm đến hút mật, từ đó gián tiếp giúp mang hạt phấn đi thụ phấn."
  },
  {
    id: 5,
    type: "single",
    question: "Một bông hoa bầu cái đã nở nhưng sau vài ngày hoa bị héo rụng mà không đậu quả bầu nhỏ. Nguyên nhân chính là gì?",
    options: [
      "Do hoa cái thiếu ánh sáng mặt trời chiếu vào",
      "Do hoa cái không được thụ phấn từ hạt phấn của hoa đực",
      "Do cây bầu bị tưới quá nhiều nước vào rễ",
      "Do cánh hoa quá to cản trở gió thổi"
    ],
    correctAnswer: "Do hoa cái không được thụ phấn từ hạt phấn của hoa đực",
    explanation: "If không được thụ phấn, noãn không thể thụ tinh, bầu nhụy không thể phát triển thành quả bầu và sẽ bị thối, héo rụng."
  },
  {
    id: 6,
    type: "multiple",
    question: "Những bộ phận nào dưới đây cấu tạo nên Nhị hoa đực? (Chọn tất cả các đáp án đúng)",
    options: ["Chỉ nhị", "Vòi nhụy", "Bao phấn chứa hạt phấn", "Noãn"],
    correctAnswer: ["Chỉ nhị", "Bao phấn chứa hạt phấn"],
    explanation: "Nhị hoa đực gồm chỉ nhị và bao phấn chứa hạt phấn. Vòi nhụy và noãn thuộc về cấu tạo nhụy cái."
  },
  {
    id: 7,
    type: "select",
    question: "Nhụy hoa cái thường có đặc điểm gì ở đầu nhụy để giữ hạt phấn đực khi tiếp xúc?",
    options: [
      "Có chất dính và chất ngọt để giữ và nuôi dưỡng hạt phấn nảy mầm",
      "Đầu nhụy khô và đắng để xua đuổi vi khuẩn",
      "Đầu nhụy sắc nhọn để chọc thủng bao phấn",
      "Đầu nhụy trơn láng để hạt phấn tự trượt xuống"
    ],
    correctAnswer: "Có chất dính và chất ngọt để giữ và nuôi dưỡng hạt phấn nảy mầm",
    explanation: "Chất dính giúp giữ chặt hạt phấn đực bay tới, và chất ngọt kích thích hạt phấn nảy mầm vươn ống phấn."
  },
  {
    id: 8,
    type: "fill",
    question: "Khi hạt phấn nảy mầm, ống phấn vươn dài xuyên qua vòi nhụy đi sâu vào bầu nhụy để giải phóng tế bào sinh dục nào?",
    placeholder: "Nhập câu trả lời (ví dụ: đực hoặc cái)...",
    correctAnswer: "đực",
    explanation: "Ống phấn dẫn tế bào sinh dục đực di chuyển xuống kết hợp với tế bào sinh dục cái nằm trong noãn."
  },
  {
    id: 9,
    type: "single",
    question: "Các loài cây phi lao, lúa có hoa nhỏ, không có màu sắc sặc sỡ và không có hương thơm. Chúng thụ phấn nhờ tác nhân nào?",
    options: ["Thụ phấn nhờ côn trùng", "Thụ phấn nhờ gió", "Thụ phấn nhờ con người", "Thụ phấn nhờ chim chóc"],
    correctAnswer: "Thụ phấn nhờ gió",
    explanation: "Hoa thụ phấn nhờ gió không cần màu sắc rực rỡ hay hương thơm vì không cần thu hút côn trùng."
  },
  {
    id: 10,
    type: "multiple",
    question: "Con người thường chủ động thụ phấn nhân tạo cho cây trồng (như mướp, bầu, bí, dưa lưới) nhằm mục đích gì? (Chọn tất cả các đáp án đúng)",
    options: [
      "Tăng tỉ lệ đậu quả, tránh rụng hoa cái",
      "Đảm bảo năng suất cao hơn khi thiếu côn trùng truyền phấn",
      "Giúp tạo quả to đẹp hơn và đúng thời điểm mong muốn",
      "Làm cho rễ cây phát triển mạnh mẽ hơn"
    ],
    correctAnswer: ["Tăng tỉ lệ đậu quả, tránh rụng hoa cái", "Đảm bảo năng suất cao hơn khi thiếu côn trùng truyền phấn", "Giúp tạo quả to đẹp hơn và đúng thời điểm mong muốn"],
    explanation: "Thụ phấn nhân tạo giúp hỗ trợ tự nhiên, đảm bảo hoa cái chắc chắn đậu quả. Việc này không ảnh hưởng trực tiếp đến sự phát triển của rễ cây."
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "explorer",
    title: "Kỹ Sư Thiết Kế Hoa Nhí",
    description: "Ghép đúng vị trí toàn bộ 4 bộ phận của hoa trên mô hình giải phẫu.",
    unlocked: false,
    emoji: "🔬",
  },
  {
    id: "sorter",
    title: "Vua Phân Loại Hoa Lớp 5",
    description: "Phân loại chính xác các loài hoa đơn tính và lưỡng tính.",
    unlocked: false,
    emoji: "🏆",
  },
  {
    id: "chatter",
    title: "Nhà Khoa Học Hiếu Kỳ",
    description: "Trò chuyện, đố chú ong vàng BiBi về bí mật thực vật.",
    unlocked: false,
    emoji: "💬",
  },
  {
    id: "graduated",
    title: "Nhà Thụ Phấn Học Xuất Sắc",
    description: "Hoàn thành mô phỏng điều khiển BiBi thụ phấn thành công cho cây ra quả.",
    unlocked: false,
    emoji: "🌱",
  },
];
