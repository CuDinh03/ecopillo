import { COLLECTIONS, type Collection, type Pattern } from './catalog'

/**
 * Câu chuyện của từng phối màu (thiết kế "Kết hợp D", owner chọn ngày 14/10/2026).
 * Mỗi phối màu là một "chương": có tên câu chuyện, đoạn kể ngắn và gam màu.
 *
 * 42 phối màu dùng câu chuyện chính thức trong catalog Ecopillo 22.07.2026 (viết bằng `c(...)`, owner chọn 24/10/2026):
 * giữ nguyên chữ catalog, chỉ cắt chữ chất liệu cũ, sửa lỗi gõ và đổi "bạn" thành "Quý khách".
 * Phần còn lại (viết bằng `s(...)`: 25 phối màu catalog không có, 6 chăn hè, câu chuyện chung của bộ, cách chia gam)
 * là BẢN NHÁP viết theo ảnh mẫu, CHỜ ECOPILLO DUYỆT.
 * Bản để Ecopillo đọc và sửa: docs/nhap-cau-chuyen-phoi-mau.html
 * (tạo lại bằng `node tools/xuat-nhap-cau-chuyen.mjs` mỗi khi sửa file này).
 * Nhãn "chờ duyệt" trên web đã tắt (owner 28/10/2026: bỏ hết nhãn chờ); bản nháp vẫn gửi Ecopillo duyệt như cũ.
 */
export const STORIES_APPROVED = true

export type ToneId = 'xanh' | 'hong' | 'tim' | 'kem' | 'xam' | 'be'

export interface Tone {
  id: ToneId
  label: string
  /** Cụm chữ ghép vào câu, ví dụ "Thêm gam xanh ở bộ khác" */
  phrase: string
  /** Dải màu cho nút lọc, pha từ màu ô của các mẫu trong gam */
  swatch: string
}

/** Cách chia gam là bản nháp, chờ Ecopillo duyệt */
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
  /** true = chữ lấy từ catalog Ecopillo, không cần nhãn chờ duyệt */
  fromCatalog?: boolean
}

/** Câu chuyện nháp, chờ Ecopillo duyệt */
const s = (title: string, text: string, tone: ToneId, volume?: string): PatternStory => ({ title, text, tone, volume })
/** Câu chuyện chính thức trong catalog Ecopillo 22.07.2026 (gam và tập vẫn là cách chia nháp) */
const c = (title: string, text: string, tone: ToneId, volume?: string): PatternStory => ({
  title,
  text,
  tone,
  volume,
  fromCatalog: true,
})

/** Câu đầu của đoạn kể, dùng làm mô tả SEO (đoạn catalog dài 60–90 chữ, quá dài cho mô tả) */
export const storySummary = (story: PatternStory): string => story.text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? story.text

const HOA_LA = 'Hoa lá'
const HINH_HOC = 'Hình học, kẻ sọc'
const CHO_BE = 'Cho bé'

/** Câu chuyện chung của cả bộ, hiện ở phần bìa */
export const COLLECTION_STORIES: Readonly<Record<string, string>> = {
  'eco-flora':
    'Những khu vườn nhỏ sau mưa: lá dương xỉ, nhành hoa dại, vệt màu nước. Tám phối màu cho những ai muốn bắt đầu thật nhẹ nhàng.',
  'eco-rosa':
    'Mỗi căn phòng một tính cách, nên Eco Rosa có nhiều câu chuyện nhất: vườn hoa, nét kẻ gọn gàng và cả thế giới của các bé. In hoạt tính nên màu tươi lâu.',
  'eco-tera': 'Không họa tiết, chỉ có màu. Sáu sắc trơn như sáu khoảng lặng trong ngày, để căn phòng tự kể phần còn lại.',
  'eco-vera': 'Hoa lá vẽ bằng nét màu nước trên nền pastel. Sáu phối màu cho những căn phòng nhiều nắng.',
  'eco-sweet': 'Hoa văn không in lên mà dệt thẳng vào vải, chỉ hiện khi ánh sáng lướt qua. Ba sắc màu, ba kiểu lặng lẽ.',
  'eco-liora': 'Vải dệt kim sa, sợi kim tuyến lấp lánh nhẹ dưới ánh đèn. Năm phối màu dành để tặng những người thân yêu.',
  'eco-doris':
    'Dòng cao nhất của Ecopillo, nơi từng đường thêu được dành nhiều thời gian nhất. Sáu phối màu, sáu cách nói lời trân trọng.',
  'chan-he-lyocell': 'Một lớp chăn mỏng cho những đêm oi nồng. Sáu phối màu mang hơi mát của trời, lá và mây.',
}

/** Khoá: `<id bộ sưu tập>/<mã mẫu>` (chăn hè dùng lại mã ER nên phải kèm id bộ) */
const STORIES: Readonly<Record<string, PatternStory>> = {
  // Eco Flora
  'eco-flora/EF06': s('Sóng vỗ nhẹ', 'Những dải xanh loang từ đậm sang nhạt như con sóng tan dần vào bờ cát. Đặt vào phòng là nghe được hơi biển.', 'xanh'),
  'eco-flora/EF09': c('Lời thì thầm của những tán lá dịu êm', 'Mang sắc thái dịu nhẹ, thuần khiết, EF09 là chốn dừng chân êm ái lấy cảm hứng từ vẻ đẹp thanh thoát của những cành dương xỉ. Từng họa tiết tối giản nhưng tinh tế khơi gợi sự kết nối với thiên nhiên, giúp Quý khách tìm lại bình yên và cân bằng Chốn Yên của mình sau những quãng thời gian bộn bề, vội vã.', 'kem'),
  'eco-flora/EF10': c('Dấu ấn giao mùa bình dị và thanh lịch', 'Gợi nhớ vẻ đẹp trầm mặc, thanh lịch của thiên nhiên trong khoảnh khắc giao mùa, EF10 mang đến một không gian nghỉ ngơi đầy tinh tế và an yên. Trên nền vải xám nhạt, họa tiết cành lá uốn lượn mềm mại cùng sắc trắng và nâu vàng tạo nên một bản hòa tấu màu sắc ấm áp và bình dị.', 'xam'),
  'eco-flora/EF11': c('Bức tranh mộc mạc, an nhiên từ đất trời', 'Với sắc xám trung tính thanh lịch, EF11 mở ra một bức tranh tĩnh tại đầy an nhiên. Họa tiết những chiếc lá dương xỉ được in tinh xảo với sắc trắng kem và trắng xám mềm mại, trải dài trên nền vải như hơi thở của núi rừng. Từng đường nét gợi nhắc về sự kiên cường mà vẫn dịu dàng, tựa như vòng tay thiên nhiên ôm ấp giấc ngủ.', 'xam'),
  'eco-flora/EF12': s('Hoa lam', 'Những chùm hoa xanh lam nở trên nền kem ấm. Gợi nhớ bộ gốm men lam trong tủ nhà bà.', 'xanh'),
  'eco-flora/EF16': c('Nét chấm phá đầy sắc màu', 'Cuốn hút với họa tiết lá cây được cách điệu, khoác lên mình những gam màu tươi tắn như xanh bạc hà, cam phớt, EF16 mang tới cảm giác êm dịu, nhẹ nhàng và tràn đầy sức sống. Sự phối hợp màu độc đáo trên nền vải trắng ngà tạo nên không gian nghỉ ngơi thư thái, khơi gợi hứng khởi nhưng vẫn giữ được vẻ thanh thoát. Nhờ đó, Quý khách dễ dàng tìm thấy sự kết nối với thiên nhiên và chìm sâu vào giấc ngủ an lành.', 'xanh'),
  'eco-flora/EF18': c('Bản giao hưởng của vân đá và đất trời', 'Với họa tiết vân đá giao hòa tinh tế trên nền xám trắng, EF18 mang đến một vẻ đẹp mộc mạc nhưng đầy chiều sâu. Từng đường nét được tối giản hóa một cách khéo léo gợi nhắc về vẻ đẹp đơn giản, vững chãi của đất trời. EF18 mang đến không gian tĩnh tại, giúp Quý khách tìm thấy sự cân bằng và an nhiên, để tâm hồn được nghỉ ngơi sau những bộn bề, vội vã của cuộc sống.', 'xam'),
  'eco-flora/EF19': c('Nâng niu cảm xúc, vỗ về yêu thương', 'EF19 mang đến một không gian nghỉ ngơi đầy mộng mơ với gam màu hồng phấn dịu nhẹ và họa tiết những đám mây nhỏ xinh đang mỉm cười hạnh phúc. Thiết kế không chỉ đem lại cảm giác vui tươi mà còn là lời mời gọi trở về với sự thư thái tuyệt đối, nơi mỗi giấc ngủ đều nhẹ nhàng như đang trôi lửng lơ trên những tầng mây êm ái, giúp nuôi dưỡng tâm hồn và tái tạo năng lượng tích cực cho mọi thành viên trong gia đình.', 'be'),

  // Eco Rosa: tập Hoa lá
  'eco-rosa/ER06': c('Nét thanh khiết, chạm giấc yên', 'Những nhành hoa lily hồng phấn bung nở trên nền trắng tinh khôi gợi lên sự ấm áp và thanh khiết, như một làn gió xuân dịu dàng, nhẹ nhàng chạm vào giấc ngủ. Sự phối hợp tinh tế này không chỉ tạo nên cảm giác thư thái mà còn nâng niu từng giấc mơ, mang đến không gian Chốn Yên tràn đầy sức sống và hy vọng.', 'hong', HOA_LA),
  'eco-rosa/ER09': c('Khơi nguồn thư thái, ôm trọn giấc an nhiên', 'ER09 khơi gợi sự tĩnh tại với gam màu xanh thiên thanh dịu mát, điểm xuyết họa tiết lá cây bay bổng mang hơi thở của thiên nhiên vào không gian nghỉ ngơi. Sự đan xen tinh tế giữa màu sắc và đường nét tạo nên một "ốc đảo" bình yên, vỗ về tâm hồn và đưa Quý khách vào giấc ngủ mát lành, sảng khoái.', 'xanh', HOA_LA),
  'eco-rosa/ER18': s('Bạc hà', 'Lá vàng nhỏ rắc trên nền xanh bạc hà. Mát dịu như một ngụm trà đầu ngày.', 'xanh', HOA_LA),
  'eco-rosa/ER20': s('Hoa mộc', 'Những bông hoa lớn màu kem nở trên nền ngà. Nền nã, dễ chịu, hợp phòng ngủ cổ điển.', 'kem', HOA_LA),
  'eco-rosa/ER21': s('Thư tay', 'Hoa hồng phấn và cam nhạt loang nhẹ như nét màu nước trên trang thư. Dành cho người lãng mạn.', 'hong', HOA_LA),
  'eco-rosa/ER22': s('Oải hương', 'Những nhành hoa tím nhỏ phủ kín nền hồng nhạt. Dịu như buổi chiều giữa cánh đồng oải hương.', 'tim', HOA_LA),
  'eco-rosa/ER24': s('Nụ hồng', 'Hoa trắng và nụ nhỏ điểm trên nền hồng nhạt. Ngọt vừa đủ cho phòng ngủ đôi.', 'hong', HOA_LA),
  'eco-rosa/ER30': s('Vườn lúc chập tối', 'Lá lớn vẽ nét mảnh trên nền xanh xám. Sâu và yên như khu vườn lúc chập tối.', 'xanh', HOA_LA),
  'eco-rosa/ER31': s('Hoa trong sương', 'Hoa xanh tím nhỏ ẩn trên nền xám nhạt. Lặng lẽ, thanh lịch.', 'xam', HOA_LA),
  'eco-rosa/ER32': s('Đồng hoa dại', 'Hoa hồng, hoa vàng và lá xanh rải trên nền trắng tím. Như vừa ôm về một bó hoa dại.', 'tim', HOA_LA),
  'eco-rosa/ER35': s('Hoa trên lụa', 'Vài nhành hoa tím hồng mảnh mai trên nền kem. Thanh, nhẹ, không lấn át căn phòng.', 'kem', HOA_LA),
  'eco-rosa/ER37': c('Nâng niu xúc cảm, dệt mộng bình yên', 'ER37 khoác lên mình gam màu xanh dịu nhẹ, tượng trưng cho sự tươi mới và sức sống ngập tràn của một khởi đầu đầy hy vọng. Những họa tiết hoa lá mềm mại được sắp xếp khéo léo trên nền vải mát lành, tựa như một khu vườn bình yên vỗ về những giấc mơ êm đềm nhất.', 'xanh', HOA_LA),
  'eco-rosa/ER39': s('Lá nhiệt đới', 'Tán lá lớn xanh đậm nổi trên nền xanh tím. Mạnh mẽ, cá tính.', 'xanh', HOA_LA),
  'eco-rosa/ER42': c('Khóm hoa xuân', 'Với sắc hồng được phối một cách tinh tế và lãng mạn, cùng những đóa hoa bung nở xen kẽ, ER42 gợi lên sắc xuân tràn đầy năng lượng và vẻ đẹp thanh thuần. Từng lớp màu hòa quyện tạo nên một không gian ấm áp, sáng bừng sức sống, để phòng ngủ luôn ngập tràn sự tươi mới và đầy cảm hứng mỗi ngày.', 'hong', HOA_LA),
  'eco-rosa/ER47': c('Gieo mầm an nhiên, ươm trồng hạnh phúc', 'ER47 lấy cảm hứng từ sự sống khởi đầu đầy hy vọng, thiết kế đưa ta trở về với vẻ đẹp nguyên bản của thiên nhiên qua những đóa hồng nở rộ trên nền vải mềm mát. Mỗi lần ngả lưng, Quý khách như được hòa mình vào sự tĩnh lặng của đất trời, nơi hạnh phúc bắt đầu nảy mầm từ những trải nghiệm êm ái và giấc ngủ vẹn tròn nhất.', 'hong', HOA_LA),
  'eco-rosa/ER48': c('Vũ khúc bình yên', 'ER48 mang vẻ đẹp thuần khiết với họa tiết những nhành lá non vươn mình mềm mại trên nền vải sáng màu tinh tế. Thiết kế là sự tôn vinh cho sức sống dịu dàng của thiên nhiên, mang đến một không gian nghỉ ngơi yên ả, nơi tâm hồn được vỗ về và tái tạo năng lượng mỗi đêm.', 'kem', HOA_LA),

  // Eco Rosa: tập Hình học, kẻ sọc
  'eco-rosa/ER08': c('Nhã nhặn sắc xanh, giấc mơ an lành', 'Với sắc xanh dương thanh nhã, sản phẩm khơi dậy sự thư thái và nhẹ nhàng, như một làn gió mát lành từ thiên nhiên. Họa tiết hình học được thiết kế đầy nghệ thuật và cân đối, gợi lên sự vững chãi và tinh tế, mang đến cảm giác hài hòa và yên bình. Từng chi tiết đều như lời ru dịu dàng, nâng niu những giấc mơ xanh trọn vẹn qua từng đêm.', 'xanh', HINH_HOC),
  'eco-rosa/ER10': s('Nhịp phố', 'Mảng xám, be và trắng đan chéo nhau đầy nhịp điệu. Hiện đại mà vẫn ấm.', 'xam', HINH_HOC),
  'eco-rosa/ER16': s('Mưa nghiêng', 'Những mảng xám bạc đan xiên như mưa bay ngoài cửa kính. Trầm tĩnh, hợp phòng ngủ tông lạnh.', 'xam', HINH_HOC),
  'eco-rosa/ER19': s('Gạch nung', 'Sắc cam đào ấm cùng những đường kẻ xám như mảng tường gạch cũ. Cho căn phòng thêm nắng.', 'hong', HINH_HOC),
  'eco-rosa/ER25': s('Mái ngói xám', 'Những ô tam giác xám tro xếp đều như mái ngói nhìn từ trên cao. Gọn gàng, chững chạc.', 'xam', HINH_HOC),
  'eco-rosa/ER33': s('Cát và sóng', 'Những dải be, kem và nâu nhạt chạy dài như bãi cát lúc triều xuống. Mộc và ấm.', 'kem', HINH_HOC),
  'eco-rosa/ER34': c('Ngọt ngào vững chãi, cân bằng hoàn hảo', 'ER34 với họa tiết hình học đan xen, uyển chuyển, thể hiện sự năng động, hiện đại, và khát khao vươn tới những điều tốt đẹp. Sự giao thoa độc đáo giữa xanh navy đậm, biểu trưng cho sự vững chãi, hồng pastel dịu dàng, ngọt ngào và xám trung tính, đại diện cho sự cân bằng hoàn hảo, tạo nên không gian Chốn Yên êm ái và thư thái.', 'xanh', HINH_HOC),
  'eco-rosa/ER49': c('Điểm chạm cảm xúc', 'ER49 mang phong cách tối giản nhưng đầy cuốn hút với những dải sọc kẻ ngang thanh lịch kết hợp với sắc xanh dịu mát. Bộ chăn ga không chỉ đem lại cảm giác hiện đại, trẻ trung mà còn tạo nên sự cân bằng thị giác hoàn hảo, là sự lựa chọn tuyệt vời dành cho những ai đang tìm kiếm một góc nghỉ ngơi thư thái để tái tạo năng lượng sau ngày dài làm việc.', 'xanh', HINH_HOC),

  // Eco Rosa: tập Cho bé
  'eco-rosa/ER11': s('Chuyến xe tí hon', 'Các bạn thú nhỏ lái xe đi khắp tấm chăn trắng. Mỗi tối là một chuyến phiêu lưu mới của bé.', 'be', CHO_BE),
  'eco-rosa/ER12': c('Phiêu lưu Bắc Cực, mở lối giấc mơ', 'Hãy để ER12 đưa bé vào vương quốc Bắc Cực kỳ diệu, nơi chim cánh cụt tinh nghịch, cá heo uyển chuyển và hải cẩu ngộ nghĩnh dẫn lối tạo nên một thế giới mộng mơ. Sắc xanh trong veo của biển băng lung linh khơi gợi trí tưởng tượng, mở lối cho những chuyến phiêu lưu đầy sáng tạo và giấc mơ bay cao.', 'be', CHO_BE),
  'eco-rosa/ER15': s('Kỷ khủng long', 'Bầy khủng long tí hon dạo chơi trên nền xanh navy. Dành cho các nhà thám hiểm nhỏ tuổi.', 'be', CHO_BE),
  'eco-rosa/ER17': s('Trời đầy sao', 'Những ngôi sao vàng, cam, xanh vẽ tay trên nền trắng. Bé đếm sao là ngủ lúc nào không hay.', 'be', CHO_BE),
  'eco-rosa/ER26': s('Gấu túi ôm cây', 'Những chú gấu túi ôm cành cây trên nền hồng đào. Để bé có bạn ôm cùng mỗi tối.', 'be', CHO_BE),
  'eco-rosa/ER28': s('Khủng long con', 'Khủng long vàng, mây trắng và núi nhỏ trên nền xanh biển. Một thế giới tiền sử thật hiền.', 'be', CHO_BE),
  'eco-rosa/ER29': s('Gấu ngủ trên trăng', 'Gấu bông nằm trên vầng trăng giữa mây và sao, nền xanh xám dịu. Một lời chúc ngủ ngon cho bé mỗi tối.', 'be', CHO_BE),
  'eco-rosa/ER45': c('Nuôi dưỡng những giấc mơ ngọt ngào', 'ER45 mở ra một thế giới thần tiên đầy sắc màu với tông hồng kẹo ngọt và những chú gấu bông nhỏ xinh vô cùng đáng yêu. Trên nền vải mềm mại, mỗi họa tiết đều mang theo sự vỗ về dịu dàng, biến không gian phòng ngủ thành nơi nuôi dưỡng những giấc mơ trong trẻo và ngập tràn niềm vui.', 'be', CHO_BE),
  'eco-rosa/ER46': c('Khơi nguồn cảm hứng', 'ER46 mở ra một thế giới đầy phiêu lưu với gam màu xanh đại dương mát mắt cùng với những họa tiết ngộ nghĩnh, xinh xắn. Với chất liệu vải cao cấp mềm mại và thoáng khí, bộ chăn ga không chỉ mang đến giấc ngủ thư giãn tuyệt đối mà còn là điểm nhấn đầy cá tính, Phù hợp cho mọi không gian sống hiện đại và năng động.', 'be', CHO_BE),

  // Eco Tera
  'eco-tera/ET01': c('Êm dịu tựa hơi thở đại dương', 'ET01 là biểu tượng của sự sang trọng tối giản với gam màu xanh dương dịu mắt, mang đến cảm giác thư thái và tĩnh lặng tuyệt đối cho tâm hồn ngay khi chạm mắt. Không cần họa tiết cầu kỳ, bộ chăn ga chinh phục người dùng bằng chi tiết thêu tinh tế. Với ET01, phòng ngủ của Quý khách sẽ trở thành một không gian nghỉ dưỡng cao cấp, nơi mọi thành viên trong gia đình đều có thể tận hưởng giấc ngủ sâu và tái tạo năng lượng trọn vẹn.', 'xanh'),
  'eco-tera/ET02': c('Sắc hồng dịu ngọt trọn vẹn giấc nồng', 'Khoác lên mình lớp sắc hồng thanh lịch, ET02 là biểu tượng cho sự may mắn cùng một không gian sum vầy ấm áp, nơi hơi ấm gia đình lan tỏa đến từng góc nhỏ. Từng đường kim mũi chỉ được chăm chút tỉ mỉ, kết hợp cùng chi tiết thêu logo tinh xảo trên nền vải mướt mịn, gợi lên cảm giác hạnh phúc nhưng vẫn toát lên vẻ sang trọng cao cấp và đầy cuốn hút.', 'hong'),
  'eco-tera/ET03': c('Sang trọng trong từng điểm chạm', 'ET03 chinh phục mọi ánh nhìn bằng gam màu xám ghi hiện đại, mang đến vẻ đẹp lịch lãm và chiều sâu tinh tế cho không gian nghỉ ngơi. Sử dụng chất liệu tự nhiên mềm mát, ET03 tựa như một "ốc đảo" bình yên giúp xoa dịu tâm trí và đưa mọi thành viên trong gia đình vào giấc ngủ sâu thư thái, tách biệt khỏi những ồn ào của cuộc sống.', 'xam'),
  'eco-tera/ET04': c('Sắc màu dịu êm vỗ về cảm xúc', 'ET04 mang đến một vẻ đẹp thanh lịch tuyệt đối với sắc màu kem dịu nhẹ, tựa như những tia nắng sớm mai sưởi ấm không gian phòng ngủ. Bề mặt vải mướt mịn với độ bắt sáng tự nhiên không chỉ nâng tầm đẳng cấp cho phòng ngủ mà còn là liệu pháp tinh thần dịu nhẹ, giúp vỗ về mọi giác quan và nuôi dưỡng những phút giây hạnh phúc giản đơn bên người thân yêu.', 'kem'),
  'eco-tera/ET05': c('Chạm vào miền thư thái an yên', 'ET05 định nghĩa lại sự sang trọng qua sắc trắng kem thuần khiết. Không cần họa tiết cầu kỳ, sản phẩm tỏa sáng bằng vẻ đẹp trang nhã, biến phòng ngủ thành một không gian nghỉ dưỡng thượng lưu nơi mọi áp lực được rũ bỏ để nhường chỗ cho sự thư thái và những khởi đầu mới đầy rạng rỡ.', 'kem'),
  'eco-tera/ET06': s('Đêm thành phố', 'Gam xám đậm, trầm và chững chạc. Hợp phòng ngủ tông tối và ánh đèn vàng.', 'xam'),

  // Eco Vera
  'eco-vera/EV01': c('Bản giao hưởng của nghệ thuật và cảm xúc', 'Không gò bó trong những đường nét rạch ròi, EV01 mượn kỹ thuật loang màu đầy ngẫu hứng của tranh watercolor để vẽ nên khoảnh khắc hạ sang. Những đóa hoa bung nở rực rỡ dưới nắng vàng, các mảng màu sáng tối đan xen hòa quyện vào nhau một cách tinh tế. Tất cả tạo nên một hiệu ứng thị giác sống động như một tác phẩm hội họa đang chuyển động ngay trước mắt.', 'kem'),
  'eco-vera/EV02': c('Chạm sắc xanh, chạm miền thư thái', 'EV02 khoác lên mình gam màu xanh thiên thanh nhẹ nhàng, điểm xuyết bằng những họa tiết nhành lá bay bổng mang đậm hơi thở của thiên nhiên trong lành. Thiết kế trung tính nhưng đầy tinh tế này không chỉ mang lại cảm giác thư thái, giải tỏa căng thẳng sau một ngày dài làm việc mà còn là sự lựa chọn hoàn hảo để kết nối mọi thành viên trong gia đình qua giấc ngủ êm ái và sâu lắng.', 'xanh'),
  'eco-vera/EV03': c('Sắc xuân nở rộ giữa miền an nhiên', 'Đắm mình trong vẻ đẹp tinh khôi của khu vườn nắng sớm, nơi những đóa mẫu đơn nở rộ đầy kiêu hãnh dưới ánh mai. EV03 tái hiện trọn vẹn vẻ đẹp của bức tranh thiên nhiên đầy thơ mộng qua những nét vẽ màu nước bay bổng và mềm mại. Với EV03, mỗi lần ngả lưng là một lần chạm vào sự thư thái tuyệt đối, để tâm hồn được vỗ về bởi sự dịu dàng và tinh khôi nhất của đất trời.', 'tim'),
  'eco-vera/EV04': c('Sắc hoa dịu ngọt, trọn giấc nồng say', 'EV04 tựa như một vườn hoa xuân đang độ nở rộ với những cánh hoa tím nhạt và hồng phấn đan xen đầy chất thơ trên nền vải mềm mại. Sự kết hợp khéo léo giữa các sắc độ màu mang lại vẻ đẹp lãng mạn, thanh lịch cho không gian sống. Bộ chăn ga khơi dậy cảm hứng yêu đời, giúp vỗ về tâm hồn và đưa Quý khách vào giấc ngủ yên bình, ngập tràn hương sắc thiên nhiên.', 'tim'),
  'eco-vera/EV05': c('Tĩnh lặng trong từng nhịp sống', 'Sắc xám nhẹ nhàng và hiện đại, kết hợp với họa tiết hình khối đan xen đầy tinh tế, tạo nên tổng thể hài hòa và sang trọng, tựa như một điểm dừng chân bình yên giữa hành trình của những giấc mơ xa. EV05 như một lời hứa hẹn cho sự khởi đầu đầy cảm hứng và kiên định trong cuộc sống.', 'xam'),
  'eco-vera/EV06': c('Ánh xanh tươi mới, giấc mơ rạng ngời', 'EV06 khoác lên mình sắc xanh nhẹ nhàng, tựa như ánh bình minh trong trẻo của một ngày mới đầy hứng khởi. Những cánh hoa trắng bung nở mềm mại mang nhịp thở của đất trời khi vạn vật bừng tỉnh, biểu trưng cho sự khởi đầu mới mẻ và tràn đầy hy vọng, dẫn lối ta tới những khởi đầu tươi mới và đẹp đẽ.', 'xanh'),

  // Eco Sweet
  'eco-sweet/ES06': c('Dệt yêu thương, nâng giấc lành', 'Với gam màu trắng ngà thanh thoát cùng họa tiết dệt Jacquard chìm hình con ong tinh tế, ES06 mang đến không gian tinh tế và đầy cuốn hút. Đặc biệt, ga chần hình tổ ong được thiết kế đồng bộ như một tác phẩm nghệ thuật độc bản, khó tìm thấy ở bất cứ đâu. Là biểu tượng của sự chăm chỉ và gắn kết, ES06 như một lời nhắc nhở về sự vun đắp và tình yêu thương bền chặt.', 'kem'),
  'eco-sweet/ES08': s('Mặt hồ', 'Xanh ngọc trong như mặt hồ buổi sáng, hoa văn dệt nổi lăn tăn như sóng. Mát từ cái nhìn đầu tiên.', 'xanh'),
  'eco-sweet/ES10': c('Vũ điệu ngàn sao', 'ES10 cuốn hút với họa tiết dệt Jacquard hình ngôi sao tinh xảo, đồng bộ từ ga chần đến từng chi tiết - thiết kế độc quyền từ Ecopillo, tạo nên vẻ đẹp sang trọng và hiếm có. Gam màu ghi thanh lịch không chỉ mang đến không gian Chốn Yên thư thái cho những giây phút nghỉ ngơi mà còn khẳng định gu thẩm mỹ tinh tế đẳng cấp.', 'xam'),

  // Eco Liora
  'eco-liora/EL06': c('Sang trọng mê hoặc, tinh xảo nền nã', 'Được kiến tạo trên nền vải cao cấp màu xám vững chãi đầy sang trọng, EL06 là một tuyên ngôn về vẻ đẹp đích thực với từng sợi kim tuyến lấp lánh được dệt tỉ mỉ, tạo hiệu ứng thị giác mê hoặc nhưng vẫn giữ trọn vẻ nền nã. EL06 không chỉ mang đến không gian nghỉ ngơi thư thái, mà còn là sự phản chiếu của vẻ đẹp nội tại: thanh lịch từ cốt cách, dịu dàng chan chứa kiêu hãnh.', 'xam'),
  'eco-liora/EL08': c('Mộng mơ sắc tím, nâng giấc cổ tích', 'Ánh lên vẻ đẹp huyền ảo và lãng mạn, bộ EL08 quyến rũ ánh nhìn với sự hòa quyện diệu kỳ của sắc hồng phấn ngọt ngào và tím lavender mơ màng. Những vệt màu loang chảy mềm mại trên nền vải như những áng mây bồng bềnh, điểm xuyết ánh kim tuyến óng ánh tựa sương khói. Mỗi đường nét đều toát lên vẻ tinh tế, hiện đại, mang đến một không gian phòng ngủ thư thái và đầy chất thơ.', 'tim'),
  'eco-liora/EL09': c('Lãng mạn mộng mơ, tinh tế như thơ', 'Với vẻ đẹp lãng mạn và kiêu sa của họa tiết hoa hồng, được vẽ bằng những nét cọ đầy chất thơ trên nền vải ghi xám đầy chiều sâu, EL09 là một tuyên ngôn về vẻ đẹp đích thực. Điều khiến EL09 trở nên độc bản chính là hiệu ứng dệt kim tuyến như một bức khảm nghệ thuật, nơi mỗi điểm sáng đều là một nốt nhạc ngân vang trong bản giao hưởng của sự tinh tế.', 'xam'),
  'eco-liora/EL10': c('Quý phái ngọt ngào, toả nét thanh tao', 'Chìm đắm trong vẻ lãng mạn của EL10, nơi những đóa hoa hồng được phác họa bằng phong cách thủy mặc tinh tế. Sắc hồng phấn và hồng đậm hòa quyện mềm mại, tạo nên một bức tranh nghệ thuật đầy chất thơ. Họa tiết uyển chuyển và phóng khoáng không chỉ mang đến sự dịu dàng, nữ tính mà còn biến phòng ngủ thành không gian tràn ngập cảm hứng và thư thái tuyệt đối.', 'hong'),
  'eco-liora/EL12': c('Lấp lánh kiêu sa, trọn giấc thăng hoa', 'EL12 tỏa sáng với sắc vàng ánh kim ấm áp, lấp lánh trên nền vải kim tuyến cao cấp, thu hút mọi ánh nhìn ngay từ khoảnh khắc đầu tiên. Những đường vân hoa văn dệt chìm bằng vải kim tuyến lấp lánh như tia nắng cuối ngày rọi lên tơ lụa, nâng niu từng khoảnh khắc nghỉ ngơi và biến phòng ngủ thành không gian thư thái, thanh lịch và đầy mê hoặc.', 'kem'),

  // Eco Doris
  'eco-doris/ED08': c('Ngọt ngào như thơ, êm từng giấc mơ', 'ED08 sở hữu sắc hồng phấn nhẹ nhàng tựa như ánh ban mai, mang đến cảm giác ngọt ngào, êm dịu nhưng không kém phần tinh tế. Gam màu pastel không quá rực rỡ, mà lại thanh thoát, đầy mê hoặc, giúp không gian phòng ngủ trở nên lãng mạn, sang trọng và thư thái. Sự kết hợp với họa tiết hoa tuyết thêu tỉ mỉ, hiếm có càng tôn lên vẻ đẹp duyên dáng, thanh lịch và độc đáo của bộ chăn ga.', 'hong'),
  'eco-doris/ED09': c('Sang trọng kiêu hãnh, tinh tế sắc sảo', 'ED09 là sự giao thoa tinh tế giữa nét cổ điển và hiện đại, nổi bật với họa tiết lông công - biểu tượng của sự sang trọng và quyền quý - được thêu cách điệu đầy tinh tế sắc sảo. Nền vải xanh dương thanh lịch, hiếm có, như tôn lên vẻ đẹp độc đáo, quý phái mà khó tìm thấy ở bất cứ đâu.', 'xanh'),
  'eco-doris/ED10': c('Cổ điển tinh xảo, độc đáo cuốn hút', 'Họa tiết thêu tinh xảo độc quyền trên nền vải trắng thanh khiết, ED10 toát lên vẻ đẹp nhẹ nhàng nhưng cuốn hút. Hoa văn cổ điển lấy cảm hứng từ châu Âu, với đường uốn lượn mềm mại và đan xen khéo léo, tạo điểm nhấn đầy khác biệt. Từng chi tiết đều hòa quyện hài hòa, không chỉ tôn lên sự sang trọng mà còn khẳng định phong cách thời thượng, góp phần nâng tầm không gian sống.', 'kem'),
  'eco-doris/ED20': c('Sắc đỏ đoàn viên, ấm áp sum vầy', 'Khoác lên sắc đỏ trầm ấm - ED20 là biểu tượng của may mắn và chốn yên sum vầy, nơi hơi ấm gia đình lan tỏa trong từng góc nhỏ. Họa tiết thêu chỉ vàng tinh xảo, từng đường kim, mũi chỉ được chăm chút tỉ mỉ, gợi lên cảm giác ấm áp, hạnh phúc nhưng vẫn toát lên vẻ sang trọng đầy cuốn hút.', 'hong'),
  'eco-doris/ED25': c('Nâng niu khoảnh khắc, giữ trọn yêu thương', 'Họa tiết thêu độc bản sự giao hòa của uyên ương và hồ điệp quấn quýt, điểm xuyết hoa mai vàng và hoa mơ cách điệu, ED25 mang vẻ đẹp của sự phú quý, lãng mạn và tinh tế, trở thành món quà ý nghĩa dành cho các đôi uyên ương hoặc những cặp vợ chồng muốn lưu giữ dấu ấn yêu thương. Mỗi chi tiết như một lời chúc cho hạnh phúc bền lâu và những khoảnh khắc bên nhau thêm trọn vẹn.', 'kem'),
  'eco-doris/ED26': c('Tuyệt tác chạm cảm xúc', 'ED26 là một tác phẩm nghệ thuật tinh tế với hoạ tiết hoa tuyết thêu tay tinh xảo độc quyền, nổi bật trên nền ghi thanh nhã. Từng đường kim, mũi chỉ đều được chăm chút tỉ mỉ, tạo nên sự khác biệt hiếm có. Tất cả như vỗ về, dẫn lối Quý khách vào một giấc mơ ngọt ngào, thư thái - nơi mọi bộn bề đều lắng lại, nhường chỗ cho sự an yên giữa lòng cuộc sống.', 'xam'),

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

/** Đường link riêng của từng phối màu: trang sản phẩm của mẫu đó trên web cũ (bảng ở links.ts) */
export { patternPath } from './links'

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
