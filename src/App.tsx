import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Utensils, Info, X, ZoomIn, Map as MapIcon, ChevronRight, GripHorizontal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- CẤU HÌNH BẢN ĐỒ VÀ TỌA ĐỘ ---
// 1. Dán link ảnh bản đồ của bạn vào biến MAP_IMAGE_URL dưới đây:
const MAP_IMAGE_URL = "https://files.catbox.moe/2hv189.jpg"; // <-- THAY LINK ẢNH TẠI ĐÂY

// 2. Cập nhật tọa độ các điểm du lịch (x, y tính theo phần trăm % từ góc trên bên trái của bản đồ)
// - x: Tọa độ ngang (trái -> phải, 0 đến 100)
// - y: Tọa độ dọc (trên -> xuống, 0 đến 100)
const touristSpots = [
  { 
    id: 1, 
    name: "Tam Chúc", 
    location: "Kim Bảng", 
    x: 19.8, 
    y: 48.9, 
    image: "https://files.catbox.moe/0vvx65.webp", 
    description: "Được mệnh danh là Vịnh Hạ Long trên cạn, Tam Chúc là khu du lịch tâm linh lớn nhất thế giới với cảnh quan thiên nhiên hùng vĩ, non nước hữu tình." 
  },
  { 
    id: 2, 
    name: "Địa Tạng Phi Lai", 
    location: "Thanh Liêm", 
    x: 40, 
    y: 82, 
    image: "https://files.catbox.moe/3rgue5.jpg", 
    description: "Ngôi chùa mang vẻ đẹp thanh tịnh, yên bình, ẩn mình giữa rừng thông. Nơi đây nổi tiếng với kiến trúc độc đáo và không gian thiền định tuyệt vời." 
  },
  { 
    id: 3, 
    name: "Chùa Bà Đanh", 
    location: "Kim Bảng", 
    x: 22.7, 
    y: 40.6, 
    image: "https://files.catbox.moe/6c41lj.webp", 
    description: "Nổi tiếng với câu nói 'Vắng như chùa Bà Đanh', ngôi chùa có lịch sử lâu đời, nằm soi bóng bên dòng sông Đáy thơ mộng." 
  },
  { 
    id: 4, 
    name: "Ngũ Động Thi Sơn", 
    location: "Duy Tiên", 
    x: 55.7, 
    y: 22.2, 
    image: "https://files.catbox.moe/e95erb.jpg", 
    description: "Ngôi chùa cổ kính nằm trên đỉnh núi Đọi, được xây dựng từ thời Lý. Nơi đây lưu giữ bảo vật quốc gia bia tháp Sùng Thiện Diên Linh." 
  },
  { 
    id: 5, 
    name: "Đền Trần Thương", 
    location: "Lý Nhân", 
    x: 74.4, 
    y: 37, 
    image: "https://files.catbox.moe/udrwlp.jpg", 
    description: "Nơi thờ Hưng Đạo Đại Vương Trần Quốc Tuấn. Đền nổi tiếng với lễ hội phát lương đầu năm thu hút hàng vạn du khách thập phương." 
  },
  { 
    id: 6, 
    name: "Chùa Bầu", 
    location: "Phủ Lý", 
    x: 39, 
    y: 41.4, 
    image: "https://files.catbox.moe/j7d9jz.jfif", 
    description: "Ngôi chùa nằm ngay trung tâm thành phố Phủ Lý, có lịch sử lâu đời và không gian thanh tịnh giữa lòng đô thị." 
  },
];

const foods = [
  { id: 1, name: "Cá kho làng Vũ Đại", location: "Lý Nhân", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop", description: "Món cá kho truyền thống trứ danh, được kho trong niêu đất từ 12-16 tiếng với gia vị đặc trưng. Thịt cá chắc nịch, xương nhừ tơi, hương vị đậm đà khó quên." },
  { id: 2, name: "Chuối ngự Đại Hoàng", location: "Lý Nhân", image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=1000&auto=format&fit=crop", description: "Loại chuối từng được dùng để tiến vua. Quả nhỏ nhắn, vỏ mỏng tang, ruột vàng ươm, khi chín tỏa hương thơm nức và có vị ngọt thanh tao." },
  { id: 3, name: "Bánh đa Kiện Khê", location: "Thanh Liêm", image: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=1000&auto=format&fit=crop", description: "Bánh đa được nướng giòn rụm, thơm lừng mùi vừng và lạc. Thường được thưởng thức cùng chuối tiêu chín hoặc kẹo lạc tạo nên hương vị dân dã độc đáo." },
  { id: 4, name: "Mắm cáy Bình Lục", location: "Bình Lục", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop", description: "Đặc sản dân dã mang đậm hồn quê. Mắm có màu đỏ nâu bắt mắt, vị đậm đà, thơm mùi cáy đặc trưng, là thức chấm tuyệt vời cho các món rau luộc, thịt luộc." },
  { id: 5, name: "Rượu làng Vọc", location: "Bình Lục", image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=1000&auto=format&fit=crop", description: "Loại rượu được chưng cất từ gạo nếp ủ men ta truyền thống gồm 36 vị thuốc Bắc. Rượu trong vắt, uống êm dịu, hương thơm nồng nàn và đặc biệt không gây đau đầu." },
];

// --- Components ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'tourism' | 'food'>('tourism');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [devCoords, setDevCoords] = useState<{x: number, y: number} | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-none flex items-center justify-center text-white shadow-md">
              <MapIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Cẩm Nang Hà Nam</h1>
              <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Khám phá vùng đất văn hiến</p>
            </div>
          </div>
          
          <nav className="flex gap-2 bg-stone-100 p-1 rounded-none">
            <button
              onClick={() => setActiveTab('tourism')}
              className={cn(
                "px-6 py-2.5 rounded-none font-semibold text-sm transition-all duration-200 flex items-center gap-2",
                activeTab === 'tourism' 
                  ? "bg-white text-emerald-700 shadow-sm" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              )}
            >
              <MapPin size={18} />
              Du Lịch
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className={cn(
                "px-6 py-2.5 rounded-none font-semibold text-sm transition-all duration-200 flex items-center gap-2",
                activeTab === 'food' 
                  ? "bg-white text-orange-600 shadow-sm" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              )}
            >
              <Utensils size={18} />
              Món Ăn Đặc Sản
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'tourism' ? (
            <motion.div
              key="tourism"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col relative"
            >
              {/* Floating Header */}
              <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-20 pointer-events-none">
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 font-serif bg-white/90 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 shadow-sm">Bản đồ Du lịch</h2>
              </div>
              
              <div className="relative flex-1 overflow-hidden bg-white flex items-center justify-center p-4 sm:p-8">
                {/* Map Container */}
                <div 
                  className="relative inline-block max-w-full max-h-full cursor-crosshair"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setDevCoords({x, y});
                  }}
                >
                    <img 
                      src={MAP_IMAGE_URL} 
                      alt="Bản đồ Hà Nam" 
                      className="max-w-full max-h-full pointer-events-none block" 
                    />
                    
                    {/* Tourist Spots (Red Dots) */}
                    <AnimatePresence>
                      {touristSpots.map((spot) => (
                        <motion.div
                          key={spot.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ delay: spot.id * 0.1, type: "spring" }}
                          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                          style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                        >
                          {/* Pulsing Dot */}
                          <div 
                            className="relative flex items-center justify-center group cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(spot);
                            }}
                          >
                            <motion.div
                              animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                              className="absolute w-8 h-8 bg-red-500 rounded-full"
                            />
                            <div className="relative w-5 h-5 bg-red-600 border-2 border-white rounded-full shadow-md z-10" />
                            
                            {/* Label */}
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-stone-100">
                              <p className="text-sm font-bold text-stone-800">{spot.name}</p>
                              <p className="text-[10px] text-stone-500 uppercase tracking-wider">{spot.location}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Dev Coords Tool */}
                    {devCoords && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-stone-900/90 text-white px-4 py-2 rounded-md text-sm z-50 font-mono shadow-lg border border-white/20 pointer-events-none">
                        Tọa độ: x: {devCoords.x.toFixed(1)}, y: {devCoords.y.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
            </motion.div>
          ) : (
            <motion.div
              key="food"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8"
            >
              <div className="mb-8 text-center max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold text-stone-800 font-serif mb-4">Thực Đơn Đặc Sản</h2>
                <p className="text-stone-600 text-lg">Khám phá những hương vị truyền thống độc đáo, mang đậm bản sắc văn hóa ẩm thực của vùng đất Hà Nam.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {foods.map((food, index) => (
                  <motion.div
                    key={food.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedItem(food)}
                    className="group bg-white rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-stone-100 flex flex-col"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out"
                        style={{ backgroundImage: `url(${food.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-orange-600 text-sm font-medium mb-2">
                        <MapPin size={16} />
                        <span>{food.location}</span>
                      </div>
                      <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-orange-600 transition-colors">{food.name}</h3>
                      <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed flex-1">{food.description}</p>
                      
                      <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-sm font-medium text-stone-500 group-hover:text-orange-600 transition-colors">
                        <span>Xem chi tiết</span>
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            {/* Modal Content */}
            <motion.div
              drag
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="pointer-events-auto relative w-full max-w-4xl h-[60vh] min-h-[450px] max-h-[600px] bg-stone-900/95 backdrop-blur-xl rounded-none overflow-hidden shadow-2xl flex flex-col md:flex-row cursor-grab active:cursor-grabbing border border-white/20"
            >
              {/* Drag Handle Indicator */}
              <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center z-30 opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
                <GripHorizontal size={28} className="text-white/60 drop-shadow-md" />
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-none flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Left Info Panel */}
              <div className="w-full md:w-5/12 relative z-10 flex flex-col justify-center p-8 md:p-12 bg-black/40 backdrop-blur-xl border-r border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-900/90 to-stone-900/50 -z-10" />
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6">
                    <MapPin size={16} />
                    {selectedItem.location}
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-6 leading-tight">
                    {selectedItem.name}
                  </h2>
                  
                  <div className="w-12 h-1 bg-emerald-500 rounded-none mb-6" />
                  
                  <p className="text-lg text-stone-300 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </motion.div>
              </div>

              {/* Right Image Panel */}
              <div className="w-full md:w-7/12 relative h-64 md:h-auto">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${selectedItem.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-transparent to-transparent md:hidden" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
