import { COLLECTIONS, type Collection, type Pattern } from './catalog'

/**
 * Câu chuyện của từng phối màu (thiết kế "Kết hợp D", owner chọn ngày 14/10/2026).
 * Mỗi phối màu là một "chương": có tên câu chuyện, đoạn kể ngắn và gam màu.
 *
 * TOÀN BỘ CHỮ TRONG FILE NÀY LÀ BẢN NHÁP, viết theo ảnh mẫu đang có, CHỜ ECOPILLO DUYỆT.
 * Bản để Ecopillo đọc và sửa: docs/nhap-cau-chuyen-phoi-mau.html
 * (tạo lại bằng `node tools/xuat-nhap-cau-chuyen.mjs` mỗi khi sửa file này).
 * Khi Ecopillo đã duyệt thì đổi STORIES_APPROVED thành true để bỏ nhãn "chờ duyệt" trên web.
 */
export const STORIES_APPROVED = false

export type ToneId = 'xanh' | 'hong' | 'tim' | 'kem' | 'xam' | 'be'

export interface Tone {
  id: ToneId
  label: string
  /** Cụm chữ ghép vào câu, ví dụ "Thêm gam xanh ở bộ khác" */
  phrase: string
  /** Dải màu cho nút lọc, pha từ màu ô của các mẫu trong gam */
  swatch: string
}

/** Cách chia gam là bản nháp: [ECOPILLO DUYỆT CÁCH CHIA GAM MÀU] */
export const TONES: readonly Tone[] = [
  { id: 'xanh', label: 'Xanh', phrase: 'gam xanh', swatch: 'linear-gradient(135deg, #a2bfe1, #b6d7e8)' },
  { id: 'hong', label: 'Hồng, đỏ cam', phrase: 'gam hồng, đỏ cam', swatch: 'linear-gradient(135deg, #f0d2d8, #cfa9a2)' },
  { id: 'tim', label: 'Tím', phrase: 'gam tím', swatch: 'linear-gradient(135deg, #e4d4e0, #bebcc7)' },
  { id: 'kem', label: 'Trắng, kem', phrase: 'gam trắng, kem', swatch: 'linear-gradient(135deg, #f4f3e9, #e5d8c8)' },
  { id: 'xam', label: 'Xám', phrase: 'gam xám', swatch: 'linear-gradient(135deg, #d0c9c8, #818284)' },
  { id: 'be', label: 'Cho bé', phrase: 'phối màu cho bé', swatch: 'linear-gradient(135deg, #e6d3d9, #bacbe3)' },
]

export const toneById = (id: string | null | undefined): Tone | undefined => TONES.find((t) => t.id === id)

export interface PatternStory {
  title: string
  text: string
  tone: ToneId
  /** "Tập" trong bộ sưu tập nhiều phối màu (Eco Rosa) */
  volume?: string
}

const s = (title: string, text: string, tone: ToneId, volume?: string): PatternStory => ({ title, text, tone, volume })

const HOA_LA = 'Hoa lá'
const HINH_HOC = 'Hình học, kẻ sọc'
const CHO_BE = 'Cho bé'

/** Câu chuyện chung của cả bộ, hiện ở phần bìa */
export const COLLECTION_STORIES: Readonly<Record<string, string>> = {
  'eco-flora':
    'Những khu vườn nhỏ sau mưa: lá dương xỉ, nhành hoa dại, vệt màu nước. Tám phối màu cho những ai muốn bắt đầu thật nhẹ nhàng.',
  'eco-rosa':
    'Mỗi căn phòng một tính cách, nên Eco Rosa có nhiều câu chuyện nhất: vườn hoa, nét kẻ gọn gàng và cả thế giới của các bé.',
  'eco-tera': 'Không họa tiết, chỉ có màu. Sáu sắc trơn như sáu khoảng lặng trong ngày, để căn phòng tự kể phần còn lại.',
  'eco-vera': 'Hoa lá vẽ bằng nét màu nước trên nền pastel. Sáu phối màu cho những căn phòng nhiều nắng.',
  'eco-sweet': 'Hoa văn không in lên mà dệt thẳng vào vải, chỉ hiện khi ánh sáng lướt qua. Ba sắc màu, ba kiểu lặng lẽ.',
  'eco-liora': 'Sắc pastel loang như màu nước, viền thêu tinh tế. Năm phối màu dành để tặng những người thân yêu.',
  'eco-doris':
    'Dòng cao nhất của Ecopillo, nơi từng đường thêu được dành nhiều thời gian nhất. Sáu phối màu, sáu cách nói lời trân trọng.',
  'chan-he-lyocell': 'Một lớp chăn mỏng cho những đêm oi nồng. Sáu phối màu mang hơi mát của trời, lá và mây.',
}

/** Khoá: `<id bộ sưu tập>/<mã mẫu>` (chăn hè dùng lại mã ER nên phải kèm id bộ) */
const STORIES: Readonly<Record<string, PatternStory>> = {
  // Eco Flora
  'eco-flora/EF06': s('Sóng vỗ nhẹ', 'Những dải xanh loang từ đậm sang nhạt như con sóng tan dần vào bờ cát. Đặt vào phòng là nghe được hơi biển.', 'xanh'),
  'eco-flora/EF09': s('Vườn dương xỉ', 'Từng nhành dương xỉ xanh xoè trên nền trắng, như góc vườn sau cơn mưa. Mát mắt ngay từ lúc mở cửa phòng.', 'kem'),
  'eco-flora/EF10': s('Cành khô đầu đông', 'Vài nhành hoa mảnh vẽ trên nền xám nhạt, trầm và tĩnh. Dành cho những ai thích sự yên ắng.', 'xam'),
  'eco-flora/EF11': s('Rừng sương', 'Lá dương xỉ trắng ẩn hiện trên nền xám như cánh rừng buổi sớm còn sương. Dịu, kín đáo, dễ phối.', 'xam'),
  'eco-flora/EF12': s('Hoa lam', 'Những chùm hoa xanh lam nở trên nền kem ấm. Gợi nhớ bộ gốm men lam trong tủ nhà bà.', 'xanh'),
  'eco-flora/EF16': s('Lá non', 'Lá xanh ngọc điểm trên nền trắng, trong như sáng đầu xuân. Cho căn phòng luôn có cảm giác vừa mở cửa sổ.', 'xanh'),
  'eco-flora/EF18': s('Đường chân trời', 'Những dải xám đậm nhạt nằm ngang, gọn và dứt khoát. Hợp phòng ngủ tối giản.', 'xam'),
  'eco-flora/EF19': s('Giấc mơ kẹo ngọt', 'Nền hồng phấn cùng những người bạn nhỏ ngộ nghĩnh. Để giờ đi ngủ của bé thành giờ được mong chờ.', 'be'),

  // Eco Rosa: tập Hoa lá
  'eco-rosa/ER06': s('Cành đào trước ngõ', 'Những cành hoa hồng phớt vươn trên nền trắng như cành đào trước ngõ ngày giáp Tết. Nhẹ nhàng mà rộn ràng.', 'hong', HOA_LA),
  'eco-rosa/ER09': s('Lá rơi mặt hồ', 'Những chiếc lá lớn xanh lam thả trên nền trắng. Thoáng, mát, như vừa có gió qua.', 'xanh', HOA_LA),
  'eco-rosa/ER18': s('Bạc hà', 'Lá vàng nhỏ rắc trên nền xanh bạc hà. Mát dịu như một ngụm trà đầu ngày.', 'xanh', HOA_LA),
  'eco-rosa/ER20': s('Hoa mộc', 'Những bông hoa lớn màu kem nở trên nền ngà. Nền nã, dễ chịu, hợp phòng ngủ cổ điển.', 'kem', HOA_LA),
  'eco-rosa/ER21': s('Thư tay', 'Hoa hồng phấn và cam nhạt loang nhẹ như nét màu nước trên trang thư. Dành cho người lãng mạn.', 'hong', HOA_LA),
  'eco-rosa/ER22': s('Oải hương', 'Những nhành hoa tím nhỏ phủ kín nền hồng nhạt. Dịu như buổi chiều giữa cánh đồng oải hương.', 'tim', HOA_LA),
  'eco-rosa/ER24': s('Nụ hồng', 'Hoa trắng và nụ nhỏ điểm trên nền hồng nhạt. Ngọt vừa đủ cho phòng ngủ đôi.', 'hong', HOA_LA),
  'eco-rosa/ER30': s('Vườn lúc chập tối', 'Lá lớn vẽ nét mảnh trên nền xanh xám. Sâu và yên như khu vườn lúc chập tối.', 'xanh', HOA_LA),
  'eco-rosa/ER31': s('Hoa trong sương', 'Hoa xanh tím nhỏ ẩn trên nền xám nhạt. Lặng lẽ, thanh lịch.', 'xam', HOA_LA),
  'eco-rosa/ER32': s('Đồng hoa dại', 'Hoa hồng, hoa vàng và lá xanh rải trên nền trắng tím. Như vừa ôm về một bó hoa dại.', 'tim', HOA_LA),
  'eco-rosa/ER35': s('Hoa trên lụa', 'Vài nhành hoa tím hồng mảnh mai trên nền kem. Thanh, nhẹ, không lấn át căn phòng.', 'kem', HOA_LA),
  'eco-rosa/ER37': s('Gió đồng', 'Lá vàng nhạt bay trên nền xanh lam. Mang cái thoáng của cánh đồng vào phòng ngủ.', 'xanh', HOA_LA),
  'eco-rosa/ER39': s('Lá nhiệt đới', 'Tán lá lớn xanh đậm nổi trên nền xanh tím. Mạnh mẽ, cá tính.', 'xanh', HOA_LA),
  'eco-rosa/ER42': s('Mùa hoa nở', 'Hoa hồng, hoa trắng nở kín tấm chăn. Rực rỡ như khu vườn giữa độ xuân.', 'hong', HOA_LA),
  'eco-rosa/ER47': s('Hoa nhí', 'Những nhành hoa hồng nhỏ trên nền trắng ngà. Giản dị, nữ tính.', 'hong', HOA_LA),
  'eco-rosa/ER48': s('Lá ô liu', 'Cành lá xanh xám vẽ kiểu màu nước trên nền trắng. Tươi mà vẫn trang nhã.', 'kem', HOA_LA),

  // Eco Rosa: tập Hình học, kẻ sọc
  'eco-rosa/ER08': s('Chiều thứ Bảy', 'Những ô xanh denim chồng lên nhau, thoải mái như chiếc áo sơ mi cũ. Cho những buổi chiều không cần vội.', 'xanh', HINH_HOC),
  'eco-rosa/ER10': s('Nhịp phố', 'Mảng xám, be và trắng đan chéo nhau đầy nhịp điệu. Hiện đại mà vẫn ấm.', 'xam', HINH_HOC),
  'eco-rosa/ER16': s('Mưa nghiêng', 'Những mảng xám bạc đan xiên như mưa bay ngoài cửa kính. Trầm tĩnh, hợp phòng ngủ tông lạnh.', 'xam', HINH_HOC),
  'eco-rosa/ER19': s('Gạch nung', 'Sắc cam đào ấm cùng những đường kẻ xám như mảng tường gạch cũ. Cho căn phòng thêm nắng.', 'hong', HINH_HOC),
  'eco-rosa/ER25': s('Mái ngói xám', 'Những ô tam giác xám tro xếp đều như mái ngói nhìn từ trên cao. Gọn gàng, chững chạc.', 'xam', HINH_HOC),
  'eco-rosa/ER33': s('Cát và sóng', 'Những dải be, kem và nâu nhạt chạy dài như bãi cát lúc triều xuống. Mộc và ấm.', 'kem', HINH_HOC),
  'eco-rosa/ER34': s('Cánh buồm', 'Mảng tam giác xanh, hồng và trắng ghép vào nhau như những cánh buồm. Trẻ trung, nhiều năng lượng.', 'xanh', HINH_HOC),
  'eco-rosa/ER49': s('Vải mộc', 'Sắc trắng xám trơn với đường viền kẻ mảnh. Tối giản, để chất vải lên tiếng.', 'kem', HINH_HOC),

  // Eco Rosa: tập Cho bé
  'eco-rosa/ER11': s('Chuyến xe tí hon', 'Các bạn thú nhỏ lái xe đi khắp tấm chăn trắng. Mỗi tối là một chuyến phiêu lưu mới của bé.', 'be', CHO_BE),
  'eco-rosa/ER12': s('Dưới lòng biển', 'Cá voi và những người bạn bơi giữa nền xanh nước biển. Bé đi ngủ cùng cả một đại dương.', 'be', CHO_BE),
  'eco-rosa/ER15': s('Kỷ khủng long', 'Bầy khủng long tí hon dạo chơi trên nền xanh navy. Dành cho các nhà thám hiểm nhỏ tuổi.', 'be', CHO_BE),
  'eco-rosa/ER17': s('Trời đầy sao', 'Những ngôi sao vàng, cam, xanh vẽ tay trên nền trắng. Bé đếm sao là ngủ lúc nào không hay.', 'be', CHO_BE),
  'eco-rosa/ER26': s('Gấu túi ôm cây', 'Những chú gấu túi ôm cành cây trên nền hồng đào. Để bé có bạn ôm cùng mỗi tối.', 'be', CHO_BE),
  'eco-rosa/ER28': s('Khủng long con', 'Khủng long vàng, mây trắng và núi nhỏ trên nền xanh biển. Một thế giới tiền sử thật hiền.', 'be', CHO_BE),
  'eco-rosa/ER29': s('Gấu ngủ trên trăng', 'Gấu bông nằm trên vầng trăng giữa mây và sao, nền xanh xám dịu. Một lời chúc ngủ ngon cho bé mỗi tối.', 'be', CHO_BE),
  'eco-rosa/ER45': s('Gấu con', 'Những chú gấu nhỏ đội mũ trên nền hồng. Ngọt ngào cho phòng của bé gái.', 'be', CHO_BE),
  'eco-rosa/ER46': s('Ra khơi', 'Tàu thuyền, máy bay, xe cộ chạy khắp nền xanh. Dành cho các bé mê khám phá.', 'be', CHO_BE),

  // Eco Tera
  'eco-tera/ET01': s('Sáng đầu hạ', 'Màu của khoảng trời sau cơn mưa sớm. Dành cho căn phòng nhiều nắng và những người thích thức dậy thật nhẹ.', 'xanh'),
  'eco-tera/ET02': s('Má hồng', 'Một sắc hồng rất khẽ, đủ ấm cho phòng ngủ đôi mà không ngọt quá. Hợp làm quà cho ngày về nhà mới.', 'hong'),
  'eco-tera/ET03': s('Sương sớm', 'Xám dịu như mặt hồ lúc chưa có nắng. Đi cùng mọi màu tường, mọi kiểu nội thất.', 'xam'),
  'eco-tera/ET04': s('Nắng trong rèm', 'Màu kem ấm của nắng lọc qua lớp rèm mỏng. Làm căn phòng sáng lên mà vẫn yên.', 'kem'),
  'eco-tera/ET05': s('Trang giấy mới', 'Trắng ngà sạch và tĩnh, như một trang giấy chưa viết. Cho những ai muốn phòng ngủ thật gọn.', 'kem'),
  'eco-tera/ET06': s('Đêm thành phố', 'Gam xám đậm, trầm và chững chạc. Hợp phòng ngủ tông tối và ánh đèn vàng.', 'xam'),

  // Eco Vera
  'eco-vera/EV01': s('Lông vũ', 'Những nét lá mềm như lông vũ, vàng kem xen xanh rêu. Êm mắt, ấm phòng.', 'kem'),
  'eco-vera/EV02': s('Lá bay', 'Vài chiếc lá xanh lam bay trên nền xanh nhạt. Nhẹ như một hơi thở.', 'xanh'),
  'eco-vera/EV03': s('Hoa diên vĩ', 'Hoa tím nở trên nền kem ấm. Dịu dàng mà có chiều sâu.', 'tim'),
  'eco-vera/EV04': s('Hoàng hôn tím', 'Hoa tím trên nền hồng phấn, như bầu trời lúc mặt trời vừa lặn. Dành cho người lãng mạn.', 'tim'),
  'eco-vera/EV05': s('Ô cửa', 'Những ô xám đậm nhạt ghép chéo nhau. Gọn, tĩnh, hợp phòng ngủ hiện đại.', 'xam'),
  'eco-vera/EV06': s('Vườn dưới trăng', 'Hoa trắng nở trên nền xanh lam. Như vườn hoa dưới ánh trăng.', 'xanh'),

  // Eco Sweet
  'eco-sweet/ES06': s('Lụa ngà', 'Trắng ngà với hoa văn dệt chìm, chỉ hiện khi ánh sáng lướt qua. Sang trọng một cách lặng lẽ.', 'kem'),
  'eco-sweet/ES08': s('Mặt hồ', 'Xanh ngọc trong như mặt hồ buổi sáng, hoa văn dệt nổi lăn tăn như sóng. Mát từ cái nhìn đầu tiên.', 'xanh'),
  'eco-sweet/ES10': s('Ánh bạc', 'Xám bạc với hoa văn dệt chìm, ánh lên nhẹ dưới đèn. Điềm đạm, tinh tế.', 'xam'),

  // Eco Liora
  'eco-liora/EL06': s('Ngọc trai', 'Ánh xám dịu của ngọc trai, sang mà không phô. Dành cho người thích sự kín đáo.', 'xam'),
  'eco-liora/EL08': s('Chiều tím', 'Hồng và tím hoà vào nhau như bầu trời lúc sáu giờ chiều. Mềm, mơ màng, rất khó rời mắt.', 'tim'),
  'eco-liora/EL09': s('Cẩm tú cầu', 'Những chùm hoa xanh tím nở trên nền vải mát. Mang một góc vườn Đà Lạt vào phòng ngủ.', 'tim'),
  'eco-liora/EL10': s('Vườn đào tháng Ba', 'Sắc hồng đào loang như cánh hoa vừa rụng trên lối đi. Một lời chúc ngọt ngào cho đôi vợ chồng mới.', 'hong'),
  'eco-liora/EL12': s('Chỉ vàng', 'Hoa văn vàng kem trên nền ngà, tỉ mỉ và ấm. Món quà tân gia trang trọng.', 'kem'),

  // Eco Doris
  'eco-doris/ED08': s('Cánh sen', 'Hồng phấn mịn như cánh sen vừa hé, điểm đường thêu cùng tông. Dành tặng những người phụ nữ thân yêu.', 'hong'),
  'eco-doris/ED09': s('Trời xanh', 'Xanh da trời trong vắt với những nhành thêu mảnh. Bình yên như một sáng không mây.', 'xanh'),
  'eco-doris/ED10': s('Kỳ nghỉ tại nhà', 'Trắng tinh với viền kẻ thanh mảnh, phẳng phiu như giường khách sạn. Để ngày nào về nhà cũng là kỳ nghỉ.', 'kem'),
  'eco-doris/ED20': s('Ngày vui', 'Đỏ cam rực rỡ với những đường kẻ kem chạy dọc. Màu của ngày vui, của khởi đầu mới.', 'hong'),
  'eco-doris/ED25': s('Chim và hoa', 'Chim nhỏ đậu trên cành hoa, thêu trên nền kem. Một bức hoa điểu cho phòng ngủ.', 'kem'),
  'eco-doris/ED26': s('Sao đêm', 'Xám bạc điểm những bông thêu nhỏ như sao. Trầm, sang, không phô trương.', 'xam'),

  // Chăn hè Lyocell
  'chan-he-lyocell/ER09': s('Mưa rào', 'Những vệt xanh nhạt như mưa rào đầu hạ. Đắp lên là thấy dịu.', 'xanh'),
  'chan-he-lyocell/ER12': s('Biển xanh', 'Xanh biển tươi với họa tiết vui mắt. Một góc biển cho giấc trưa hè.', 'xanh'),
  'chan-he-lyocell/ER16': s('Mây xám', 'Những dải xám mềm như mây trước cơn mưa. Mát mắt, dễ phối với mọi bộ ga.', 'xam'),
  'chan-he-lyocell/ER20': s('Cát mịn', 'Kem be trơn, ấm và nhẹ. Hợp mọi phòng ngủ.', 'kem'),
  'chan-he-lyocell/ER36': s('Bóng râm', 'Xám ghi dịu như bóng râm giữa trưa hè. Kín đáo, sạch sẽ.', 'xam'),
  'chan-he-lyocell/ER38': s('Sen trắng', 'Hoa trắng nở trên nền xanh mây. Thanh mát như hồ sen sáng sớm.', 'xanh'),
}

export const storyOf = (collection: Collection, pattern: Pattern): PatternStory | undefined =>
  STORIES[`${collection.id}/${pattern.code}`]

/** Tên chương: tên câu chuyện, chưa có thì dùng tên màu */
export const chapterTitle = (collection: Collection, pattern: Pattern): string =>
  storyOf(collection, pattern)?.title ?? pattern.colorName

/** Đường link riêng của từng phối màu, ví dụ /san-pham/eco-tera/et01 */
export const patternPath = (collection: Collection, pattern: Pattern): string =>
  `/san-pham/${collection.id}/${pattern.code.toLowerCase()}`

export const patternByParam = (collection: Collection, param: string | null | undefined): Pattern | undefined =>
  param ? collection.patterns.find((p) => p.code.toLowerCase() === param.toLowerCase()) : undefined

/** Các "tập" của bộ sưu tập theo thứ tự xuất hiện; bộ không chia tập thì trả về mảng rỗng */
export const volumesOf = (collection: Collection): readonly string[] => [
  ...new Set(collection.patterns.flatMap((p) => storyOf(collection, p)?.volume ?? [])),
]

export interface Colorway {
  collection: Collection
  pattern: Pattern
  story: PatternStory
}

/** Mọi phối màu đã có câu chuyện, theo thứ tự bộ sưu tập */
export const COLORWAYS: readonly Colorway[] = COLLECTIONS.flatMap((collection) =>
  collection.patterns.flatMap((pattern) => {
    const story = storyOf(collection, pattern)
    return story ? [{ collection, pattern, story }] : []
  }),
)

export const colorwaysOfTone = (tone: ToneId): readonly Colorway[] => COLORWAYS.filter((c) => c.story.tone === tone)

/**
 * Phối màu cùng gam ở các bộ khác: lấy lần lượt mỗi bộ một mẫu trước, để khách thấy nhiều mức giá.
 */
export const sameToneElsewhere = (collection: Collection, tone: ToneId, limit: number): readonly Colorway[] => {
  const others = colorwaysOfTone(tone).filter((c) => c.collection.id !== collection.id)
  const firstOfEach = others.filter((c, i) => others.findIndex((o) => o.collection.id === c.collection.id) === i)
  const rest = others.filter((c) => !firstOfEach.includes(c))
  return [...firstOfEach, ...rest].slice(0, limit)
}
