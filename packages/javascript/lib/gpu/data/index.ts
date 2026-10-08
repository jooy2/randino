import { rows } from '../../_internal/parse.js';
import type { GpuVendor, SystemPlatform } from '../../_types/global.js';

/** Every maker the catalog holds a part of, in the order the catalog lists them. */
export const GPU_VENDORS: readonly GpuVendor[] = [
	'NVIDIA',
	'ATI',
	'AMD',
	'Intel',
	'Qualcomm',
	'Arm',
	'Samsung'
];

/** One graphics processor the catalog holds. */
export interface GpuEntry {
	platform: SystemPlatform;
	/** The year the first cards or machines with it went on sale. */
	year: number;
	/** Who sells it under their name: `NVIDIA`, `AMD`, `Intel`, `Qualcomm`, `Arm`. */
	vendor: GpuVendor;
	/** The graphics processor's own name, as its maker writes it: `GeForce RTX 4090`. */
	model: string;
}

/**
 * Every graphics processor the catalog holds, one per row: `platform | year |
 * vendor | model`.
 *
 * Desktop cards, laptop GPUs and the graphics built into a PC processor under
 * `desktop`, and the GPUs inside the chips of phones and tablets under `mobile`.
 * A Radeon from before the end of 2010 is written as ATI sold it, because that
 * is the name it carried. Apple's GPUs carry no name of their own — a Mac reports
 * its chip's, which `randCpu` already writes — so they are left out. The year is
 * the year the first cards or machines with it went on sale, and the catalog runs
 * to the graphics processors out by the end of 2025.
 */
export const GPUS: readonly GpuEntry[] = rows(`
	desktop | 2006 | NVIDIA | GeForce 8800 GTX
	desktop | 2007 | NVIDIA | GeForce 8800 GT
	desktop | 2008 | NVIDIA | GeForce 9800 GT
	desktop | 2008 | NVIDIA | GeForce GTX 260
	desktop | 2008 | NVIDIA | GeForce GTX 280
	desktop | 2010 | NVIDIA | GeForce GTX 480
	desktop | 2010 | NVIDIA | GeForce GTX 460
	desktop | 2010 | NVIDIA | GeForce GTX 580
	desktop | 2011 | NVIDIA | GeForce GTX 560 Ti
	desktop | 2012 | NVIDIA | GeForce GTX 680
	desktop | 2012 | NVIDIA | GeForce GTX 670
	desktop | 2012 | NVIDIA | GeForce GTX 660
	desktop | 2013 | NVIDIA | GeForce GTX TITAN
	desktop | 2013 | NVIDIA | GeForce GTX 780
	desktop | 2013 | NVIDIA | GeForce GTX 760
	desktop | 2014 | NVIDIA | GeForce GTX 750 Ti
	desktop | 2014 | NVIDIA | GeForce GTX 970
	desktop | 2014 | NVIDIA | GeForce GTX 980
	desktop | 2015 | NVIDIA | GeForce GTX 960
	desktop | 2015 | NVIDIA | GeForce GTX 980 Ti
	desktop | 2016 | NVIDIA | GeForce GTX 1080
	desktop | 2016 | NVIDIA | GeForce GTX 1070
	desktop | 2016 | NVIDIA | GeForce GTX 1060
	desktop | 2016 | NVIDIA | GeForce GTX 1050 Ti
	desktop | 2017 | NVIDIA | GeForce GTX 1080 Ti
	desktop | 2017 | NVIDIA | GeForce MX150
	desktop | 2018 | NVIDIA | GeForce RTX 2080
	desktop | 2018 | NVIDIA | GeForce RTX 2080 Ti
	desktop | 2018 | NVIDIA | GeForce RTX 2070
	desktop | 2019 | NVIDIA | GeForce RTX 2060
	desktop | 2019 | NVIDIA | GeForce GTX 1660 Ti
	desktop | 2019 | NVIDIA | GeForce GTX 1660
	desktop | 2019 | NVIDIA | GeForce GTX 1650
	desktop | 2019 | NVIDIA | GeForce RTX 2060 SUPER
	desktop | 2019 | NVIDIA | GeForce RTX 2070 SUPER
	desktop | 2019 | NVIDIA | GeForce GTX 1660 SUPER
	desktop | 2019 | NVIDIA | GeForce MX250
	desktop | 2020 | NVIDIA | GeForce RTX 3080
	desktop | 2020 | NVIDIA | GeForce RTX 3090
	desktop | 2020 | NVIDIA | GeForce RTX 3070
	desktop | 2020 | NVIDIA | GeForce RTX 3060 Ti
	desktop | 2020 | NVIDIA | GeForce MX450
	desktop | 2021 | NVIDIA | GeForce RTX 3060
	desktop | 2021 | NVIDIA | GeForce RTX 3080 Ti
	desktop | 2021 | NVIDIA | GeForce RTX 3070 Ti
	desktop | 2021 | NVIDIA | GeForce RTX 3060 Laptop GPU
	desktop | 2021 | NVIDIA | GeForce RTX 3070 Laptop GPU
	desktop | 2022 | NVIDIA | GeForce RTX 3050
	desktop | 2022 | NVIDIA | GeForce RTX 3090 Ti
	desktop | 2022 | NVIDIA | GeForce RTX 4090
	desktop | 2022 | NVIDIA | GeForce RTX 4080
	desktop | 2022 | NVIDIA | GeForce MX550
	desktop | 2023 | NVIDIA | GeForce RTX 4070 Ti
	desktop | 2023 | NVIDIA | GeForce RTX 4070
	desktop | 2023 | NVIDIA | GeForce RTX 4060 Ti
	desktop | 2023 | NVIDIA | GeForce RTX 4060
	desktop | 2023 | NVIDIA | GeForce RTX 4050 Laptop GPU
	desktop | 2023 | NVIDIA | GeForce RTX 4060 Laptop GPU
	desktop | 2023 | NVIDIA | GeForce RTX 4070 Laptop GPU
	desktop | 2024 | NVIDIA | GeForce RTX 4070 SUPER
	desktop | 2024 | NVIDIA | GeForce RTX 4070 Ti SUPER
	desktop | 2024 | NVIDIA | GeForce RTX 4080 SUPER
	desktop | 2025 | NVIDIA | GeForce RTX 5090
	desktop | 2025 | NVIDIA | GeForce RTX 5080
	desktop | 2025 | NVIDIA | GeForce RTX 5070 Ti
	desktop | 2025 | NVIDIA | GeForce RTX 5070
	desktop | 2025 | NVIDIA | GeForce RTX 5060 Ti
	desktop | 2025 | NVIDIA | GeForce RTX 5060
	desktop | 2025 | NVIDIA | GeForce RTX 5050
	desktop | 2025 | NVIDIA | GeForce RTX 5060 Laptop GPU
	desktop | 2025 | NVIDIA | GeForce RTX 5070 Laptop GPU

	desktop | 2008 | ATI | Radeon HD 4850
	desktop | 2008 | ATI | Radeon HD 4870
	desktop | 2009 | ATI | Radeon HD 5870
	desktop | 2009 | ATI | Radeon HD 5770
	desktop | 2010 | AMD | Radeon HD 6870
	desktop | 2010 | AMD | Radeon HD 6970
	desktop | 2012 | AMD | Radeon HD 7970
	desktop | 2012 | AMD | Radeon HD 7850
	desktop | 2013 | AMD | Radeon R9 290X
	desktop | 2013 | AMD | Radeon R9 280X
	desktop | 2015 | AMD | Radeon R9 390
	desktop | 2015 | AMD | Radeon R9 Fury X
	desktop | 2016 | AMD | Radeon RX 480
	desktop | 2016 | AMD | Radeon RX 470
	desktop | 2017 | AMD | Radeon RX 580
	desktop | 2017 | AMD | Radeon RX 570
	desktop | 2017 | AMD | Radeon RX Vega 64
	desktop | 2017 | AMD | Radeon RX Vega 56
	desktop | 2018 | AMD | Radeon Vega 8 Graphics
	desktop | 2019 | AMD | Radeon VII
	desktop | 2019 | AMD | Radeon RX 5700 XT
	desktop | 2019 | AMD | Radeon RX 5700
	desktop | 2019 | AMD | Radeon RX 5500 XT
	desktop | 2020 | AMD | Radeon RX 5600 XT
	desktop | 2020 | AMD | Radeon RX 6800 XT
	desktop | 2020 | AMD | Radeon RX 6800
	desktop | 2020 | AMD | Radeon RX 6900 XT
	desktop | 2021 | AMD | Radeon RX 6700 XT
	desktop | 2021 | AMD | Radeon RX 6600 XT
	desktop | 2021 | AMD | Radeon RX 6600
	desktop | 2022 | AMD | Radeon RX 6500 XT
	desktop | 2022 | AMD | Radeon RX 6950 XT
	desktop | 2022 | AMD | Radeon RX 7900 XTX
	desktop | 2022 | AMD | Radeon RX 7900 XT
	desktop | 2022 | AMD | Radeon 680M
	desktop | 2023 | AMD | Radeon RX 7600
	desktop | 2023 | AMD | Radeon RX 7800 XT
	desktop | 2023 | AMD | Radeon RX 7700 XT
	desktop | 2023 | AMD | Radeon RX 7900 GRE
	desktop | 2023 | AMD | Radeon 780M
	desktop | 2024 | AMD | Radeon RX 7600 XT
	desktop | 2024 | AMD | Radeon 890M
	desktop | 2025 | AMD | Radeon RX 9070 XT
	desktop | 2025 | AMD | Radeon RX 9070
	desktop | 2025 | AMD | Radeon RX 9060 XT
	desktop | 2025 | AMD | Radeon 8060S

	desktop | 2011 | Intel | HD Graphics 3000
	desktop | 2012 | Intel | HD Graphics 4000
	desktop | 2013 | Intel | HD Graphics 4600
	desktop | 2013 | Intel | Iris Pro Graphics 5200
	desktop | 2015 | Intel | HD Graphics 520
	desktop | 2015 | Intel | HD Graphics 530
	desktop | 2016 | Intel | HD Graphics 620
	desktop | 2017 | Intel | UHD Graphics 620
	desktop | 2017 | Intel | UHD Graphics 630
	desktop | 2019 | Intel | Iris Plus Graphics
	desktop | 2020 | Intel | Iris Xe Graphics
	desktop | 2021 | Intel | UHD Graphics 770
	desktop | 2022 | Intel | Arc A370M
	desktop | 2022 | Intel | Arc A380
	desktop | 2022 | Intel | Arc A750
	desktop | 2022 | Intel | Arc A770
	desktop | 2023 | Intel | Arc Graphics
	desktop | 2024 | Intel | Arc 140V
	desktop | 2024 | Intel | Arc B580
	desktop | 2025 | Intel | Arc B570
	desktop | 2025 | Intel | Arc 140T

	mobile | 2013 | Qualcomm | Adreno 330
	mobile | 2014 | Qualcomm | Adreno 420
	mobile | 2015 | Qualcomm | Adreno 430
	mobile | 2016 | Qualcomm | Adreno 506
	mobile | 2016 | Qualcomm | Adreno 530
	mobile | 2017 | Qualcomm | Adreno 512
	mobile | 2017 | Qualcomm | Adreno 540
	mobile | 2018 | Qualcomm | Adreno 630
	mobile | 2019 | Qualcomm | Adreno 610
	mobile | 2019 | Qualcomm | Adreno 612
	mobile | 2019 | Qualcomm | Adreno 618
	mobile | 2019 | Qualcomm | Adreno 640
	mobile | 2020 | Qualcomm | Adreno 620
	mobile | 2020 | Qualcomm | Adreno 650
	mobile | 2021 | Qualcomm | Adreno 642L
	mobile | 2021 | Qualcomm | Adreno 660
	mobile | 2021 | Qualcomm | Adreno 730
	mobile | 2022 | Qualcomm | Adreno 619
	mobile | 2022 | Qualcomm | Adreno 644
	mobile | 2022 | Qualcomm | Adreno 740
	mobile | 2023 | Qualcomm | Adreno 710
	mobile | 2023 | Qualcomm | Adreno 725
	mobile | 2023 | Qualcomm | Adreno 750
	mobile | 2024 | Qualcomm | Adreno 830
	mobile | 2025 | Qualcomm | Adreno 840

	mobile | 2016 | Arm | Mali-T880
	mobile | 2016 | Arm | Mali-G71
	mobile | 2017 | Arm | Mali-G72
	mobile | 2018 | Arm | Mali-G76
	mobile | 2020 | Arm | Mali-G57
	mobile | 2020 | Arm | Mali-G77
	mobile | 2020 | Arm | Mali-G78
	mobile | 2021 | Arm | Mali-G68
	mobile | 2022 | Arm | Mali-G710
	mobile | 2022 | Arm | Immortalis-G715
	mobile | 2023 | Arm | Mali-G715
	mobile | 2023 | Arm | Immortalis-G720
	mobile | 2024 | Arm | Immortalis-G925

	mobile | 2022 | Samsung | Xclipse 920
	mobile | 2024 | Samsung | Xclipse 940
	mobile | 2025 | Samsung | Xclipse 950
`).map(([platform, year, vendor, model]) => ({
	platform: platform as SystemPlatform,
	year: Number(year),
	vendor: vendor as GpuVendor,
	model
}));
