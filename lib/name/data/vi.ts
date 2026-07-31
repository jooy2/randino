import { words } from '../../_internal/parse.js';
import { VIETNAMESE_SYLLABLES } from './syllables.js';
import type { NameLanguageData } from './types.js';

export const VI: NameLanguageData = {
	order: 'family-first',
	joiner: ' ',
	hasMiddle: true,
	roman: 'fold',
	lengthSpec: { given: [2, 6], last: [3, 7], middle: [3, 6] },
	// Tone marks are part of the name: Dung (female) and Dũng (male) are two
	// different names, so a new entry has to carry the diacritics it is written with.
	male: words(`
		An Bình Cường Dũng Đạt Hải Hùng Khôi Long Minh Nam Phúc Quân Sơn Tuấn Việt Bảo
		Khánh Trung Thắng Duy Kiên Lâm Nghĩa Phong Hiếu Huy Đức Thành Tùng Khang Toàn Trí
		Tú Vinh Nguyên Kiệt Đăng Hưng Thịnh
	`),
	female: words(`
		Anh Chi Dung Hà Hoa Hương Lan Linh Mai Ngọc Nhung Phương Quỳnh Thảo Trang Uyên Vân
		Yến Hạnh Ngân Diệp Giang Loan My Thu Trâm Nhi Như Vy Tuyết Trinh Hiền Huyền Nga
		Oanh Phượng Thúy Tiên Hằng Châu
	`),
	last: words(`
		Nguyễn Trần Lê Phạm Hoàng Huỳnh Phan Vũ Võ Đặng Bùi Đỗ Hồ Ngô Dương Lý Đinh Trịnh
		Đoàn Lâm Trương Tô Cao Chu Tạ Vương Phùng Tống Triệu Lưu
	`),
	middleMale: words('Văn Hữu Đức Minh Quang Thành Xuân Bá Công Trọng Quốc Nhật Chí Đình Thế'),
	middleFemale: words('Thị Ngọc Thanh Thu Kim Hồng Mỹ Diễm Bích Phương Thùy Cẩm Ánh Nhã Hoài'),
	syn: VIETNAMESE_SYLLABLES
};
