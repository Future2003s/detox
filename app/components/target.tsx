"use client";
import React, { useState, useEffect } from "react";
import {
  Heart,
  ChevronRight,
  Utensils,
  Activity,
  ArrowLeft,
  CheckCircle,
  Droplets,
  Moon,
  Sun,
  Coffee,
  Clock,
  Trophy,
  Scale,
  Battery,
  BookOpen,
  HelpCircle,
} from "lucide-react";

// --- Type Definitions ---
type DayType = "day" | "night" | "off";

interface MealPlan {
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
}

interface DayData {
  id: number;
  type: DayType;
  title: string;
  desc: string;
  meals: MealPlan;
  workout: string;
  tips: string;
}

// --- Từ điển giải thích thuật ngữ ---
const glossary = [
  {
    term: "Meal Prep",
    def: "Chuẩn bị sẵn đồ ăn cho nhiều bữa/nhiều ngày để tiết kiệm thời gian nấu nướng khi đi làm.",
  },
  {
    term: "Overnight Oats",
    def: "Món yến mạch ngâm qua đêm với sữa/sữa chua trong tủ lạnh. Sáng ra yến mạch mềm và có thể ăn ngay, rất tiện lợi.",
  },
  {
    term: "Detox",
    def: "Thanh lọc cơ thể bằng cách ăn uống nhẹ nhàng, nhiều rau xanh, nước ép để giảm tải cho hệ tiêu hóa.",
  },
  {
    term: "Cardio",
    def: "Bài tập làm tăng nhịp tim (như đi bộ nhanh, chạy bộ, leo cầu thang) giúp đốt cháy calo hiệu quả.",
  },
  {
    term: "Squat",
    def: "Bài tập 'Ngồi xổm'. Đứng lên ngồi xuống (như ngồi ghế) để làm săn chắc mông và đùi.",
  },
  {
    term: "Lunges",
    def: "Bài tập 'Chùng chân'. Bước 1 chân lên trước, hạ thấp hông vuông góc để tập đùi.",
  },
  {
    term: "Plank",
    def: "Tư thế 'Tấm ván'. Chống khuỷu tay xuống sàn, giữ người thẳng như khúc gỗ để siết cơ bụng.",
  },
  {
    term: "Sữa KĐ",
    def: "Sữa tươi hoặc Sữa chua 'Không Đường'. Bạn có thể thay thế linh hoạt 2 loại này cho nhau tùy thích.",
  },
];

// --- Cấu trúc dữ liệu mới cho chu kỳ 4-4-2 (Bắt đầu bằng Ca Đêm) ---

const MEAL_LABELS: Record<
  DayType,
  { b: string; l: string; s: string; d: string }
> = {
  day: {
    b: "Bữa Sáng (06:30)",
    l: "Bữa Trưa (12:00)",
    s: "Bữa Chiều (16:00)",
    d: "Bữa Tối (20:30)",
  },
  night: {
    b: "Trước Ca (17:30)",
    l: "Giữa Ca (00:00)",
    s: "Xế Ca (04:00)",
    d: "Tan Ca (08:30)",
  },
  off: {
    b: "Bữa Sáng (08:00)",
    l: "Bữa Trưa (12:30)",
    s: "Bữa Chiều (16:00)",
    d: "Bữa Tối (19:00)",
  },
};

const cyclePlan: DayData[] = [
  // --- 4 NGÀY CA ĐÊM (20:00 - 08:00) - BẮT ĐẦU CHU KỲ ---
  {
    id: 1,
    type: "night",
    title: "Ca Đêm 1: Khởi động",
    desc: "Làm quen nhịp độ, tập trung ăn đủ chất ở nhà trước khi đi.",
    meals: {
      breakfast: "Cơm nhà: 1 bát cơm + Trứng chiên ít dầu + Rau luộc",
      lunch: "Cơm công ty: Chọn món luộc/hấp, ăn 1/2 lượng cơm thường ăn",
      snack: "Tại ca: Uống nhiều nước lọc (giúp tỉnh táo)",
      dinner: "Về nhà: 1 hộp sữa chua/sữa tươi KĐ + 1 lát bánh mì",
    },
    workout: "Tập nhẹ 15p tại nhà sau khi ngủ dậy buổi chiều",
    tips: "Ở công ty hãy uống nước lọc từng ngụm nhỏ để tránh đói vặt.",
  },
  {
    id: 2,
    type: "night",
    title: "Ca Đêm 2: Tăng rau xanh",
    desc: "Tận dụng rau ở công ty để no lâu hơn.",
    meals: {
      breakfast: "Cơm nhà: Bún/Phở (tự nấu hoặc mua) nhưng bỏ nước béo",
      lunch: "Cơm công ty: Ăn rau trước -> Thịt -> Cơm sau cùng",
      snack: "Tại ca: Nước lọc + 1 hộp sữa chua/sữa tươi KĐ mang theo",
      dinner: "Về nhà: Khoai lang luộc + 1 quả trứng luộc (nhanh gọn)",
    },
    workout: "Đi lại nhẹ nhàng trong giờ nghỉ giải lao ở cty",
    tips: "Ăn ngược (Rau trước, Cơm sau) giúp giảm hấp thu đường.",
  },
  {
    id: 3,
    type: "night",
    title: "Ca Đêm 3: Giảm muối",
    desc: "Đồ ăn công ty thường mặn, hãy hạn chế chan nước thịt.",
    meals: {
      breakfast: "Cơm nhà: Ức gà/Thịt heo nạc rang + Cơm + Dưa chuột",
      lunch: "Cơm công ty: Không chan nước thịt kho/cá kho vào cơm",
      snack: "Tại ca: Nước lọc (mang thêm chai lớn)",
      dinner: "Về nhà: Cháo gói hoặc yến mạch (dễ tiêu để ngủ ngay)",
    },
    workout: "Vặn mình, giãn cơ tại chỗ",
    tips: "Đồ ăn mặn làm tích nước, hãy tráng qua canh nếu món quá mặn.",
  },
  {
    id: 4,
    type: "night",
    title: "Ca Đêm 4: Về đích",
    desc: "Chuẩn bị bụng nhẹ nhàng để chuyển sang ngày nghỉ.",
    meals: {
      breakfast: "Cơm nhà: Cá kho/rán + Rau muống luộc + Cơm",
      lunch: "Cơm công ty: Chỉ ăn thức ăn và rau, giảm tối đa cơm",
      snack: "Tại ca: Sữa đậu nành (nếu cty có) hoặc Nước lọc",
      dinner: "Về nhà: 1 ly sữa ấm/sữa chua KĐ (giúp ngủ ngon)",
    },
    workout: "Nghỉ ngơi hoàn toàn",
    tips: "Ngủ một giấc thật sâu để reset cơ thể.",
  },

  // --- 2 NGÀY NGHỈ (TỰ NẤU 100% ĐỂ DETOX) ---
  {
    id: 5,
    type: "off",
    title: "Nghỉ 1: Detox nhẹ",
    desc: "Ăn đồ nhà hoàn toàn để kiểm soát gia vị.",
    meals: {
      breakfast: "2 quả trứng ốp la + Dưa chuột",
      lunch: "Cơm nhà: Thịt luộc chấm mắm nhạt + Rau cải",
      snack: "Trái cây mua sẵn (Ổi/Táo/Thanh long)",
      dinner: "Miến gà hoặc Bún mọc (nấu nhạt, nhiều rau)",
    },
    workout: "Đi bộ công viên hoặc dọn dẹp nhà cửa (30p)",
    tips: "Ngày nghỉ là lúc bù đắp dinh dưỡng sạch cho cơ thể.",
  },
  {
    id: 6,
    type: "off",
    title: "Nghỉ 2: Chuẩn bị",
    desc: "Mua sẵn sữa, trứng, hoa quả cho đợt ca ngày.",
    meals: {
      breakfast: "Yến mạch trộn sữa chua/sữa tươi KĐ (hoặc Bánh mì trứng)",
      lunch: "Cơm nhà: Cá rán/sốt cà chua + Canh rau ngót",
      snack: "1 ly nước cam/chanh ít đường",
      dinner: "Salad rau trộn trứng (hoặc Rau luộc chấm trứng)",
    },
    workout: "Chạy bộ nhẹ nhàng 20p",
    tips: "Đi siêu thị mua: Sữa KĐ, Trứng, Khoai lang cho tuần tới.",
  },

  // --- 4 NGÀY CA NGÀY (08:00 - 20:00) ---
  {
    id: 7,
    type: "day",
    title: "Ca Ngày 1: Năng lượng",
    desc: "Ăn sáng no ở nhà, trưa ăn khéo ở công ty.",
    meals: {
      breakfast: "Cơm nhà: Cơm nguội rang trứng (ít dầu) hoặc Xôi ít",
      lunch: "Cơm công ty: Lấy nhiều rau, bỏ bì/mỡ thịt",
      snack: "Chiều: Nước lọc công ty",
      dinner: "Về nhà: Khoai lang luộc + Thịt nạc luộc/rang",
    },
    workout: "Đi bộ thư giãn sau khi đi làm về",
    tips: "Bữa sáng quan trọng nhất, đừng bỏ bữa.",
  },
  {
    id: 8,
    type: "day",
    title: "Ca Ngày 2: Siết nhẹ",
    desc: "Giảm tinh bột vào bữa tối khi về nhà.",
    meals: {
      breakfast: "Bánh mì kẹp trứng/thịt + 1 hộp sữa chua/sữa tươi KĐ",
      lunch: "Cơm công ty: Ưu tiên món cá/đậu phụ nếu có",
      snack: "Chiều: Nước lọc (cố gắng uống đủ 2 lít/ngày)",
      dinner: "Về nhà: Rau luộc thập cẩm + 1 quả trứng (không cơm)",
    },
    workout: "Squat 20 cái tại nhà trong lúc chờ cơm",
    tips: "Nếu đói vào buổi chiều, hãy uống nước lọc ngay lập tức.",
  },
  {
    id: 9,
    type: "day",
    title: "Ca Ngày 3: Thanh lọc",
    desc: "Cố gắng chọn đồ thanh đạm nhất có thể.",
    meals: {
      breakfast: "Ngũ cốc/Yến mạch + Sữa chua/Sữa tươi KĐ (nhanh gọn)",
      lunch: "Cơm công ty: Hạn chế món chiên xào nhiều dầu",
      snack: "Chiều: Mang theo 1 trái táo/ổi từ nhà",
      dinner: "Về nhà: Canh bí/bầu nấu tôm/thịt băm",
    },
    workout: "Giãn cơ nhẹ nhàng",
    tips: "Mang trái cây từ nhà đi ăn xế giúp tránh ăn vặt bậy bạ.",
  },
  {
    id: 10,
    type: "day",
    title: "Ca Ngày 4: Tổng kết",
    desc: "Kết thúc chu kỳ, chuẩn bị tinh thần chuyển ca.",
    meals: {
      breakfast: "Bún/Mì nấu tại nhà (cho nhiều rau)",
      lunch: "Cơm công ty: Ăn bình thường, bỏ nước sốt",
      snack: "Chiều: Nước lọc",
      dinner: "Về nhà: Ăn nhẹ (Sữa chua/Sữa tươi KĐ + Hoa quả) để ngủ sớm",
    },
    workout: "Nghỉ ngơi để mai chuyển sang Ca Đêm",
    tips: "Kiểm tra cân nặng vào sáng mai sau khi ngủ dậy.",
  },
];

// --- Components ---

interface ProgressBarProps {
  completed: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const percentage = Math.round((completed / total) * 100);
  return (
    <div className="w-full bg-rose-100 rounded-full h-4 mb-6 relative overflow-hidden">
      <div
        className="bg-rose-500 h-4 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-rose-800">
        {percentage}% Chu kỳ
      </span>
    </div>
  );
};

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const calculateBMI = () => {
    if (height && weight) {
      const h = Number(height) / 100;
      const w = Number(weight);
      const result = (w / (h * h)).toFixed(1);
      setBmi(result);

      const numResult = parseFloat(result);
      if (numResult < 18.5) setStatus("Thiếu cân");
      else if (numResult < 24.9) setStatus("Bình thường");
      else if (numResult < 29.9) setStatus("Thừa cân");
      else setStatus("Béo phì");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-rose-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Scale className="w-5 h-5 text-rose-500" />
        Tính chỉ số BMI
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Chiều cao (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-400"
            placeholder="160"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Cân nặng (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-400"
            placeholder="55"
          />
        </div>
      </div>
      <button
        onClick={calculateBMI}
        className="w-full bg-rose-500 text-white py-2 rounded-lg font-semibold hover:bg-rose-600 transition"
      >
        Tính ngay
      </button>
      {bmi && (
        <div className="mt-4 p-3 bg-rose-50 rounded-lg text-center">
          <p className="text-gray-600">
            BMI của bạn:{" "}
            <span className="font-bold text-rose-600 text-xl">{bmi}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">Đánh giá: {status}</p>
        </div>
      )}
    </div>
  );
};

export default function Target() {
  const [view, setView] = useState<"dashboard" | "detail">("dashboard");
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("shift_cycle_progress");
    if (saved) {
      setCompletedDays(JSON.parse(saved));
    }
  }, []);

  const toggleDayComplete = (dayId: number) => {
    let newCompleted;
    if (completedDays.includes(dayId)) {
      newCompleted = completedDays.filter((id) => id !== dayId);
    } else {
      newCompleted = [...completedDays, dayId];
    }
    setCompletedDays(newCompleted);
    localStorage.setItem("shift_cycle_progress", JSON.stringify(newCompleted));
  };

  const handleDayClick = (dayId: number) => {
    setSelectedDayId(dayId);
    setView("detail");
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setView("dashboard");
    setSelectedDayId(null);
  };

  const selectedDayData = cyclePlan.find((d) => d.id === selectedDayId);

  // Helper to render type icon
  const getTypeIcon = (type: DayType) => {
    switch (type) {
      case "day":
        return <Sun className="w-4 h-4 text-orange-500" />;
      case "night":
        return <Moon className="w-4 h-4 text-indigo-500" />;
      default:
        return <Coffee className="w-4 h-4 text-green-500" />;
    }
  };

  const getTypeLabel = (type: DayType) => {
    switch (type) {
      case "day":
        return "Ca Ngày";
      case "night":
        return "Ca Đêm";
      default:
        return "Ngày Nghỉ";
    }
  };

  // --- Views ---

  const DashboardView = () => (
    <div className="animate-fade-in">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Shift<span className="text-rose-500">Fit</span> Cycle
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Chu trình 4 Ca Đêm - 2 Nghỉ - 4 Ca Ngày
        </p>
      </header>

      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        <div className="bg-indigo-50 p-3 rounded-xl min-w-[100px] flex flex-col items-center border border-indigo-100">
          <Moon className="text-indigo-500 mb-1 w-6 h-6" />
          <span className="text-xs font-bold text-indigo-700">Ca Đêm</span>
          <span className="text-[10px] text-gray-500">20h - 08h</span>
        </div>
        <div className="bg-green-50 p-3 rounded-xl min-w-[100px] flex flex-col items-center border border-green-100">
          <Coffee className="text-green-500 mb-1 w-6 h-6" />
          <span className="text-xs font-bold text-green-700">Nghỉ</span>
          <span className="text-[10px] text-gray-500">Phục hồi</span>
        </div>
        <div className="bg-orange-50 p-3 rounded-xl min-w-[100px] flex flex-col items-center border border-orange-100">
          <Sun className="text-orange-500 mb-1 w-6 h-6" />
          <span className="text-xs font-bold text-orange-700">Ca Ngày</span>
          <span className="text-[10px] text-gray-500">08h - 20h</span>
        </div>
      </div>

      <ProgressBar completed={completedDays.length} total={10} />

      <BMICalculator />

      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Battery className="w-5 h-5 text-rose-500" /> Lịch trình 10 ngày
      </h2>
      <div className="grid gap-3 grid-cols-1 mb-8">
        {cyclePlan.map((item) => {
          const isCompleted = completedDays.includes(item.id);
          let cardBg = "bg-white";
          let borderColor = "border-gray-100";

          if (item.type === "night") {
            cardBg = "bg-indigo-50/30";
            borderColor = "border-indigo-100";
          }
          if (item.type === "off") {
            cardBg = "bg-green-50/30";
            borderColor = "border-green-100";
          }
          if (isCompleted) {
            cardBg = "bg-rose-50";
            borderColor = "border-rose-200";
          }

          return (
            <div
              key={item.id}
              onClick={() => handleDayClick(item.id)}
              className={`
                  relative p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md flex items-center gap-4
                  ${cardBg} ${borderColor}
                `}
            >
              {/* Status Indicator */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-rose-500" />
                ) : (
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs
                            ${
                              item.type === "night"
                                ? "border-indigo-300 text-indigo-600"
                                : item.type === "off"
                                ? "border-green-300 text-green-600"
                                : "border-orange-300 text-orange-600"
                            }
                        `}
                  >
                    {item.id}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded text-white flex items-center gap-1
                             ${
                               item.type === "night"
                                 ? "bg-indigo-400"
                                 : item.type === "off"
                                 ? "bg-green-500"
                                 : "bg-orange-400"
                             }
                        `}
                  >
                    {getTypeIcon(item.type)} {getTypeLabel(item.type)}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-sm md:text-base">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {item.desc}
                </p>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-300" />
            </div>
          );
        })}
      </div>

      {/* Glossary Section */}
      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> Từ điển thuật ngữ
        </h3>
        <div className="grid gap-3">
          {glossary.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-3 rounded-lg text-sm shadow-sm"
            >
              <span className="font-bold text-blue-600">{item.term}:</span>
              <span className="text-gray-600 ml-1">{item.def}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DetailView = () => {
    if (!selectedDayData) return null;
    const isCompleted = completedDays.includes(selectedDayData.id);
    const labels = MEAL_LABELS[selectedDayData.type];

    // Theme colors based on shift type
    let themeColor = "rose"; // default
    let headerGradient = "from-rose-400 to-orange-500";
    if (selectedDayData.type === "night") {
      themeColor = "indigo";
      headerGradient = "from-indigo-600 to-purple-800";
    } else if (selectedDayData.type === "off") {
      themeColor = "green";
      headerGradient = "from-green-500 to-teal-600";
    }

    return (
      <div className="animate-slide-in">
        <button
          onClick={goHome}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Quay lại
        </button>

        <div
          className={`bg-gradient-to-r ${headerGradient} rounded-3xl p-6 text-white mb-6 shadow-lg`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
              {getTypeIcon(selectedDayData.type)}
              <span>{getTypeLabel(selectedDayData.type)}</span>
            </div>
            <button
              onClick={() => toggleDayComplete(selectedDayData.id)}
              className={`
                        flex items-center gap-2 px-3 py-1 rounded-full font-bold text-xs transition-all bg-white text-${themeColor}-600
                    `}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-3 h-3" /> Đã xong
                </>
              ) : (
                "Đánh dấu xong"
              )}
            </button>
          </div>
          <h1 className="text-2xl font-bold mb-1">{selectedDayData.title}</h1>
          <p className="opacity-90 text-sm">{selectedDayData.desc}</p>
        </div>

        {/* Schedule Warning for Night Shift */}
        {selectedDayData.type === "night" && (
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-3 items-center mb-6">
            <Clock className="w-8 h-8 text-indigo-500" />
            <div>
              <h4 className="font-bold text-indigo-800 text-sm">
                Lưu ý múi giờ Ca Đêm
              </h4>
              <p className="text-indigo-600 text-xs mt-1">
                Thực đơn được thiết kế lệch giờ. "Bữa sáng" bắt đầu lúc 17h
                chiều. Hãy ngủ đủ giấc ban ngày.
              </p>
            </div>
          </div>
        )}

        {/* Workout Section */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Activity className={`w-5 h-5 text-${themeColor}-500`} /> Tập luyện
          </h3>
          <p className="text-gray-700 font-medium">{selectedDayData.workout}</p>
        </div>

        {/* Meals Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Utensils className={`w-5 h-5 text-${themeColor}-500`} /> Thực đơn
          </h3>
          <div className="space-y-3">
            <MealCard
              label={labels.b}
              content={selectedDayData.meals.breakfast}
              color="orange"
            />
            <MealCard
              label={labels.l}
              content={selectedDayData.meals.lunch}
              color="green"
            />
            <MealCard
              label={labels.s}
              content={selectedDayData.meals.snack}
              color="purple"
            />
            <MealCard
              label={labels.d}
              content={selectedDayData.meals.dinner}
              color="blue"
            />
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100 flex gap-4 items-start">
          <div className="bg-yellow-100 p-2 rounded-full flex-shrink-0">
            <Heart className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h4 className="font-bold text-yellow-800 mb-1 text-sm">
              Lời khuyên
            </h4>
            <p className="text-yellow-700 text-sm">{selectedDayData.tips}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-rose-100 pb-12">
      <div className="max-w-md md:max-w-3xl mx-auto min-h-screen bg-white shadow-2xl overflow-hidden md:rounded-[40px] md:my-8 md:min-h-[calc(100vh-4rem)]">
        <div className="h-full overflow-y-auto p-5 md:p-8 custom-scrollbar">
          {view === "dashboard" ? <DashboardView /> : <DetailView />}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slide-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

interface MealCardProps {
  label: string;
  content: string;
  color: "orange" | "green" | "purple" | "blue";
}

const MealCard: React.FC<MealCardProps> = ({ label, content, color }) => {
  const colorClasses = {
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    green: "text-green-600 bg-green-50 border-green-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
  };
  return (
    <div
      className={`p-4 rounded-xl border ${colorClasses[color]} flex flex-col`}
    >
      <span className="text-[10px] font-bold uppercase tracking-wide opacity-80 mb-1">
        {label}
      </span>
      <span className="font-medium text-gray-800 text-sm">{content}</span>
    </div>
  );
};
