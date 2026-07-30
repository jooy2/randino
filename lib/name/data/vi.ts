import { words } from './parse.js';
import { VIETNAMESE_SYLLABLES } from './syllables.js';
import type { NameLanguageData } from './types.js';

export const VI: NameLanguageData = {
	order: 'family-first',
	joiner: ' ',
	hasMiddle: true,
	roman: 'fold',
	lengthSpec: { given: [2, 6], last: [3, 7], middle: [3, 6] },
	male: words(`
		An Bình Cường Dũng Đạt Hải Hùng Khôi Long Minh Nam Phúc Quân Sơn Tuấn Việt Bảo
		Khánh Trung Thắng Duy Kiên Lâm Nghĩa Phong
	`),
	female: words(`
		Anh Chi Dung Hà Hoa Hương Lan Linh Mai Ngọc Nhung Phương Quỳnh Thảo Trang Uyên Vân
		Yến Hạnh Ngân Diệp Giang Loan My Thu
	`),
	last: words(`
		Nguyễn Trần Lê Phạm Hoàng Huỳnh Phan Vũ Võ Đặng Bùi Đỗ Hồ Ngô Dương Lý Đinh Trịnh
		Đoàn Lâm
	`),
	middleMale: words('Văn Hữu Đức Minh Quang Thành Xuân Bá Công Trọng'),
	middleFemale: words('Thị Ngọc Thanh Thu Kim Hồng Mỹ Diễm Bích Phương'),
	syn: VIETNAMESE_SYLLABLES
};
