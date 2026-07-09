import { FlowerPart, FlowerGameItem, LessonStage, Achievement } from "./types";

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
