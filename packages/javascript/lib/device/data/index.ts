import { rows } from '../../_internal/parse.js';
import type { DeviceType } from '../../_types/global.js';

export const DEVICE_TYPES: readonly DeviceType[] = ['phone', 'tablet', 'laptop'];

/** One device the catalog holds. */
export interface DeviceEntry {
	type: DeviceType;
	/** The year the device was released. */
	year: number;
	/** Who makes it: `Apple`, `Samsung`, `Lenovo`. */
	vendor: string;
	/**
	 * The model's own name, as its maker writes it: `iPhone 15 Pro`, `Galaxy Z
	 * Fold5`, `ThinkPad X1 Carbon Gen 11`. A model whose name already opens on its
	 * maker's (`Xiaomi 14`, `OnePlus 12`) is never written with the maker twice.
	 */
	model: string;
}

/**
 * Every device the catalog holds, one per row: `type | year | vendor | model`.
 *
 * Phones, tablets and laptops — the devices that carry a model name of their
 * own, which a desktop PC built from parts does not. A model is written the way
 * its maker writes it, generation and all: Apple's own identifiers for its
 * iPads and Macs (`iPad (10th generation)`, `MacBook Air (M2, 2022)`), the
 * `Gen` of a ThinkPad and the `G` of an EliteBook, and the year a laptop line is
 * told apart by. The year is the year the device was first released, which for
 * a phone launched in one market a few weeks before the rest is that first
 * market's. The catalog runs to the devices released by the end of 2025.
 */
export const DEVICES: readonly DeviceEntry[] = rows(`
	phone | 2007 | Apple | iPhone
	phone | 2008 | Apple | iPhone 3G
	phone | 2009 | Apple | iPhone 3GS
	phone | 2010 | Apple | iPhone 4
	phone | 2011 | Apple | iPhone 4S
	phone | 2012 | Apple | iPhone 5
	phone | 2013 | Apple | iPhone 5c
	phone | 2013 | Apple | iPhone 5s
	phone | 2014 | Apple | iPhone 6
	phone | 2014 | Apple | iPhone 6 Plus
	phone | 2015 | Apple | iPhone 6s
	phone | 2015 | Apple | iPhone 6s Plus
	phone | 2016 | Apple | iPhone SE
	phone | 2016 | Apple | iPhone 7
	phone | 2016 | Apple | iPhone 7 Plus
	phone | 2017 | Apple | iPhone 8
	phone | 2017 | Apple | iPhone 8 Plus
	phone | 2017 | Apple | iPhone X
	phone | 2018 | Apple | iPhone XR
	phone | 2018 | Apple | iPhone XS
	phone | 2018 | Apple | iPhone XS Max
	phone | 2019 | Apple | iPhone 11
	phone | 2019 | Apple | iPhone 11 Pro
	phone | 2019 | Apple | iPhone 11 Pro Max
	phone | 2020 | Apple | iPhone SE (2nd generation)
	phone | 2020 | Apple | iPhone 12 mini
	phone | 2020 | Apple | iPhone 12
	phone | 2020 | Apple | iPhone 12 Pro
	phone | 2020 | Apple | iPhone 12 Pro Max
	phone | 2021 | Apple | iPhone 13 mini
	phone | 2021 | Apple | iPhone 13
	phone | 2021 | Apple | iPhone 13 Pro
	phone | 2021 | Apple | iPhone 13 Pro Max
	phone | 2022 | Apple | iPhone SE (3rd generation)
	phone | 2022 | Apple | iPhone 14
	phone | 2022 | Apple | iPhone 14 Plus
	phone | 2022 | Apple | iPhone 14 Pro
	phone | 2022 | Apple | iPhone 14 Pro Max
	phone | 2023 | Apple | iPhone 15
	phone | 2023 | Apple | iPhone 15 Plus
	phone | 2023 | Apple | iPhone 15 Pro
	phone | 2023 | Apple | iPhone 15 Pro Max
	phone | 2024 | Apple | iPhone 16
	phone | 2024 | Apple | iPhone 16 Plus
	phone | 2024 | Apple | iPhone 16 Pro
	phone | 2024 | Apple | iPhone 16 Pro Max
	phone | 2025 | Apple | iPhone 16e
	phone | 2025 | Apple | iPhone 17
	phone | 2025 | Apple | iPhone Air
	phone | 2025 | Apple | iPhone 17 Pro
	phone | 2025 | Apple | iPhone 17 Pro Max

	phone | 2010 | Samsung | Galaxy S
	phone | 2011 | Samsung | Galaxy S II
	phone | 2011 | Samsung | Galaxy Note
	phone | 2012 | Samsung | Galaxy S III
	phone | 2012 | Samsung | Galaxy Note II
	phone | 2013 | Samsung | Galaxy S4
	phone | 2013 | Samsung | Galaxy Note 3
	phone | 2014 | Samsung | Galaxy S5
	phone | 2014 | Samsung | Galaxy Note 4
	phone | 2015 | Samsung | Galaxy S6
	phone | 2015 | Samsung | Galaxy S6 edge
	phone | 2015 | Samsung | Galaxy S6 edge+
	phone | 2015 | Samsung | Galaxy Note5
	phone | 2016 | Samsung | Galaxy S7
	phone | 2016 | Samsung | Galaxy S7 edge
	phone | 2016 | Samsung | Galaxy Note7
	phone | 2017 | Samsung | Galaxy S8
	phone | 2017 | Samsung | Galaxy S8+
	phone | 2017 | Samsung | Galaxy Note8
	phone | 2018 | Samsung | Galaxy S9
	phone | 2018 | Samsung | Galaxy S9+
	phone | 2018 | Samsung | Galaxy Note9
	phone | 2019 | Samsung | Galaxy S10e
	phone | 2019 | Samsung | Galaxy S10
	phone | 2019 | Samsung | Galaxy S10+
	phone | 2019 | Samsung | Galaxy Note10
	phone | 2019 | Samsung | Galaxy Note10+
	phone | 2019 | Samsung | Galaxy Fold
	phone | 2019 | Samsung | Galaxy A50
	phone | 2019 | Samsung | Galaxy A51
	phone | 2020 | Samsung | Galaxy S20
	phone | 2020 | Samsung | Galaxy S20+
	phone | 2020 | Samsung | Galaxy S20 Ultra
	phone | 2020 | Samsung | Galaxy S20 FE
	phone | 2020 | Samsung | Galaxy Z Flip
	phone | 2020 | Samsung | Galaxy Z Fold2
	phone | 2020 | Samsung | Galaxy Note20
	phone | 2020 | Samsung | Galaxy Note20 Ultra
	phone | 2021 | Samsung | Galaxy S21
	phone | 2021 | Samsung | Galaxy S21+
	phone | 2021 | Samsung | Galaxy S21 Ultra
	phone | 2021 | Samsung | Galaxy Z Fold3
	phone | 2021 | Samsung | Galaxy Z Flip3
	phone | 2021 | Samsung | Galaxy A52
	phone | 2022 | Samsung | Galaxy S21 FE
	phone | 2022 | Samsung | Galaxy S22
	phone | 2022 | Samsung | Galaxy S22+
	phone | 2022 | Samsung | Galaxy S22 Ultra
	phone | 2022 | Samsung | Galaxy Z Fold4
	phone | 2022 | Samsung | Galaxy Z Flip4
	phone | 2022 | Samsung | Galaxy A53 5G
	phone | 2023 | Samsung | Galaxy S23
	phone | 2023 | Samsung | Galaxy S23+
	phone | 2023 | Samsung | Galaxy S23 Ultra
	phone | 2023 | Samsung | Galaxy S23 FE
	phone | 2023 | Samsung | Galaxy Z Fold5
	phone | 2023 | Samsung | Galaxy Z Flip5
	phone | 2023 | Samsung | Galaxy A54 5G
	phone | 2024 | Samsung | Galaxy S24
	phone | 2024 | Samsung | Galaxy S24+
	phone | 2024 | Samsung | Galaxy S24 Ultra
	phone | 2024 | Samsung | Galaxy S24 FE
	phone | 2024 | Samsung | Galaxy Z Fold6
	phone | 2024 | Samsung | Galaxy Z Flip6
	phone | 2024 | Samsung | Galaxy A55 5G
	phone | 2025 | Samsung | Galaxy S25
	phone | 2025 | Samsung | Galaxy S25+
	phone | 2025 | Samsung | Galaxy S25 Ultra
	phone | 2025 | Samsung | Galaxy S25 Edge
	phone | 2025 | Samsung | Galaxy Z Fold7
	phone | 2025 | Samsung | Galaxy Z Flip7
	phone | 2025 | Samsung | Galaxy A56 5G

	phone | 2016 | Google | Pixel
	phone | 2016 | Google | Pixel XL
	phone | 2017 | Google | Pixel 2
	phone | 2017 | Google | Pixel 2 XL
	phone | 2018 | Google | Pixel 3
	phone | 2018 | Google | Pixel 3 XL
	phone | 2019 | Google | Pixel 3a
	phone | 2019 | Google | Pixel 3a XL
	phone | 2019 | Google | Pixel 4
	phone | 2019 | Google | Pixel 4 XL
	phone | 2020 | Google | Pixel 4a
	phone | 2020 | Google | Pixel 4a (5G)
	phone | 2020 | Google | Pixel 5
	phone | 2021 | Google | Pixel 5a
	phone | 2021 | Google | Pixel 6
	phone | 2021 | Google | Pixel 6 Pro
	phone | 2022 | Google | Pixel 6a
	phone | 2022 | Google | Pixel 7
	phone | 2022 | Google | Pixel 7 Pro
	phone | 2023 | Google | Pixel 7a
	phone | 2023 | Google | Pixel Fold
	phone | 2023 | Google | Pixel 8
	phone | 2023 | Google | Pixel 8 Pro
	phone | 2024 | Google | Pixel 8a
	phone | 2024 | Google | Pixel 9
	phone | 2024 | Google | Pixel 9 Pro
	phone | 2024 | Google | Pixel 9 Pro XL
	phone | 2024 | Google | Pixel 9 Pro Fold
	phone | 2025 | Google | Pixel 9a
	phone | 2025 | Google | Pixel 10
	phone | 2025 | Google | Pixel 10 Pro
	phone | 2025 | Google | Pixel 10 Pro XL
	phone | 2025 | Google | Pixel 10 Pro Fold

	phone | 2019 | Xiaomi | Mi 9
	phone | 2019 | Xiaomi | Redmi Note 8
	phone | 2019 | Xiaomi | Redmi Note 8 Pro
	phone | 2020 | Xiaomi | Mi 10
	phone | 2020 | Xiaomi | Mi 10 Pro
	phone | 2020 | Xiaomi | Mi 11
	phone | 2021 | Xiaomi | Redmi Note 10
	phone | 2021 | Xiaomi | Redmi Note 10 Pro
	phone | 2021 | Xiaomi | Xiaomi 11T
	phone | 2021 | Xiaomi | Xiaomi 11T Pro
	phone | 2021 | Xiaomi | Xiaomi 12
	phone | 2022 | Xiaomi | Xiaomi 12T Pro
	phone | 2022 | Xiaomi | Xiaomi 13
	phone | 2023 | Xiaomi | Xiaomi 13T Pro
	phone | 2023 | Xiaomi | Xiaomi 14
	phone | 2024 | Xiaomi | Xiaomi 14 Ultra
	phone | 2024 | Xiaomi | Xiaomi 14T Pro
	phone | 2024 | Xiaomi | Xiaomi 15
	phone | 2025 | Xiaomi | Xiaomi 15 Ultra

	phone | 2014 | OnePlus | OnePlus One
	phone | 2015 | OnePlus | OnePlus 2
	phone | 2016 | OnePlus | OnePlus 3
	phone | 2016 | OnePlus | OnePlus 3T
	phone | 2017 | OnePlus | OnePlus 5
	phone | 2017 | OnePlus | OnePlus 5T
	phone | 2018 | OnePlus | OnePlus 6
	phone | 2018 | OnePlus | OnePlus 6T
	phone | 2019 | OnePlus | OnePlus 7
	phone | 2019 | OnePlus | OnePlus 7 Pro
	phone | 2019 | OnePlus | OnePlus 7T
	phone | 2020 | OnePlus | OnePlus 8
	phone | 2020 | OnePlus | OnePlus 8 Pro
	phone | 2020 | OnePlus | OnePlus 8T
	phone | 2020 | OnePlus | OnePlus Nord
	phone | 2021 | OnePlus | OnePlus 9
	phone | 2021 | OnePlus | OnePlus 9 Pro
	phone | 2022 | OnePlus | OnePlus 10 Pro
	phone | 2022 | OnePlus | OnePlus 10T
	phone | 2023 | OnePlus | OnePlus 11
	phone | 2023 | OnePlus | OnePlus 12
	phone | 2024 | OnePlus | OnePlus 13

	phone | 2013 | Sony | Xperia Z
	phone | 2013 | Sony | Xperia Z1
	phone | 2014 | Sony | Xperia Z2
	phone | 2014 | Sony | Xperia Z3
	phone | 2015 | Sony | Xperia Z5
	phone | 2016 | Sony | Xperia XZ
	phone | 2017 | Sony | Xperia XZ1
	phone | 2018 | Sony | Xperia XZ2
	phone | 2018 | Sony | Xperia XZ3
	phone | 2019 | Sony | Xperia 1
	phone | 2019 | Sony | Xperia 5
	phone | 2020 | Sony | Xperia 1 II
	phone | 2020 | Sony | Xperia 5 II
	phone | 2021 | Sony | Xperia 1 III
	phone | 2021 | Sony | Xperia 5 III
	phone | 2022 | Sony | Xperia 1 IV
	phone | 2022 | Sony | Xperia 5 IV
	phone | 2023 | Sony | Xperia 1 V
	phone | 2023 | Sony | Xperia 5 V
	phone | 2024 | Sony | Xperia 1 VI
	phone | 2025 | Sony | Xperia 1 VII

	phone | 2015 | LG | G4
	phone | 2016 | LG | G5
	phone | 2016 | LG | V20
	phone | 2017 | LG | G6
	phone | 2017 | LG | V30
	phone | 2018 | LG | G7 ThinQ
	phone | 2018 | LG | V40 ThinQ
	phone | 2019 | LG | G8 ThinQ
	phone | 2019 | LG | V50 ThinQ
	phone | 2020 | LG | Velvet
	phone | 2020 | LG | Wing

	phone | 2018 | Huawei | P20
	phone | 2018 | Huawei | P20 Pro
	phone | 2018 | Huawei | Mate 20
	phone | 2018 | Huawei | Mate 20 Pro
	phone | 2019 | Huawei | P30
	phone | 2019 | Huawei | P30 Pro
	phone | 2019 | Huawei | Mate 30 Pro
	phone | 2019 | Huawei | Mate X
	phone | 2020 | Huawei | P40 Pro
	phone | 2020 | Huawei | Mate 40 Pro
	phone | 2021 | Huawei | P50 Pro
	phone | 2022 | Huawei | Mate 50 Pro
	phone | 2023 | Huawei | P60 Pro
	phone | 2023 | Huawei | Mate 60 Pro
	phone | 2024 | Huawei | Pura 70 Pro

	phone | 2009 | Motorola | Droid
	phone | 2013 | Motorola | Moto X
	phone | 2013 | Motorola | Moto G
	phone | 2019 | Motorola | Moto G7
	phone | 2023 | Motorola | Razr 40 Ultra
	phone | 2024 | Motorola | Razr 50 Ultra

	phone | 2022 | Nothing | Nothing Phone (1)
	phone | 2023 | Nothing | Nothing Phone (2)
	phone | 2025 | Nothing | Nothing Phone (3)

	phone | 2007 | Nokia | N95
	phone | 2012 | Nokia | Lumia 920
	phone | 2013 | Nokia | Lumia 1020
	phone | 2008 | HTC | Dream
	phone | 2014 | HTC | One (M8)
	phone | 2008 | BlackBerry | Bold 9000
	phone | 2013 | BlackBerry | Q10

	tablet | 2010 | Apple | iPad
	tablet | 2011 | Apple | iPad 2
	tablet | 2012 | Apple | iPad (3rd generation)
	tablet | 2012 | Apple | iPad (4th generation)
	tablet | 2012 | Apple | iPad mini
	tablet | 2013 | Apple | iPad Air
	tablet | 2013 | Apple | iPad mini 2
	tablet | 2014 | Apple | iPad Air 2
	tablet | 2014 | Apple | iPad mini 3
	tablet | 2015 | Apple | iPad mini 4
	tablet | 2015 | Apple | iPad Pro (12.9-inch)
	tablet | 2016 | Apple | iPad Pro (9.7-inch)
	tablet | 2017 | Apple | iPad (5th generation)
	tablet | 2017 | Apple | iPad Pro (10.5-inch)
	tablet | 2017 | Apple | iPad Pro (12.9-inch) (2nd generation)
	tablet | 2018 | Apple | iPad (6th generation)
	tablet | 2018 | Apple | iPad Pro (11-inch)
	tablet | 2018 | Apple | iPad Pro (12.9-inch) (3rd generation)
	tablet | 2019 | Apple | iPad Air (3rd generation)
	tablet | 2019 | Apple | iPad mini (5th generation)
	tablet | 2019 | Apple | iPad (7th generation)
	tablet | 2020 | Apple | iPad Pro (11-inch) (2nd generation)
	tablet | 2020 | Apple | iPad Pro (12.9-inch) (4th generation)
	tablet | 2020 | Apple | iPad (8th generation)
	tablet | 2020 | Apple | iPad Air (4th generation)
	tablet | 2021 | Apple | iPad Pro (11-inch) (3rd generation)
	tablet | 2021 | Apple | iPad Pro (12.9-inch) (5th generation)
	tablet | 2021 | Apple | iPad (9th generation)
	tablet | 2021 | Apple | iPad mini (6th generation)
	tablet | 2022 | Apple | iPad Air (5th generation)
	tablet | 2022 | Apple | iPad (10th generation)
	tablet | 2022 | Apple | iPad Pro (11-inch) (4th generation)
	tablet | 2022 | Apple | iPad Pro (12.9-inch) (6th generation)
	tablet | 2024 | Apple | iPad Air 11-inch (M2)
	tablet | 2024 | Apple | iPad Air 13-inch (M2)
	tablet | 2024 | Apple | iPad Pro 11-inch (M4)
	tablet | 2024 | Apple | iPad Pro 13-inch (M4)
	tablet | 2024 | Apple | iPad mini (A17 Pro)
	tablet | 2025 | Apple | iPad (A16)
	tablet | 2025 | Apple | iPad Air 11-inch (M3)
	tablet | 2025 | Apple | iPad Air 13-inch (M3)
	tablet | 2025 | Apple | iPad Pro 11-inch (M5)
	tablet | 2025 | Apple | iPad Pro 13-inch (M5)

	tablet | 2011 | Samsung | Galaxy Tab 10.1
	tablet | 2014 | Samsung | Galaxy Tab S
	tablet | 2015 | Samsung | Galaxy Tab S2
	tablet | 2017 | Samsung | Galaxy Tab S3
	tablet | 2018 | Samsung | Galaxy Tab S4
	tablet | 2019 | Samsung | Galaxy Tab S5e
	tablet | 2019 | Samsung | Galaxy Tab S6
	tablet | 2020 | Samsung | Galaxy Tab S6 Lite
	tablet | 2020 | Samsung | Galaxy Tab S7
	tablet | 2020 | Samsung | Galaxy Tab S7+
	tablet | 2021 | Samsung | Galaxy Tab S7 FE
	tablet | 2022 | Samsung | Galaxy Tab S8
	tablet | 2022 | Samsung | Galaxy Tab S8+
	tablet | 2022 | Samsung | Galaxy Tab S8 Ultra
	tablet | 2023 | Samsung | Galaxy Tab S9
	tablet | 2023 | Samsung | Galaxy Tab S9+
	tablet | 2023 | Samsung | Galaxy Tab S9 Ultra
	tablet | 2023 | Samsung | Galaxy Tab S9 FE
	tablet | 2024 | Samsung | Galaxy Tab S10+
	tablet | 2024 | Samsung | Galaxy Tab S10 Ultra
	tablet | 2025 | Samsung | Galaxy Tab S10 FE
	tablet | 2025 | Samsung | Galaxy Tab S11
	tablet | 2025 | Samsung | Galaxy Tab S11 Ultra

	tablet | 2012 | Microsoft | Surface RT
	tablet | 2013 | Microsoft | Surface Pro
	tablet | 2013 | Microsoft | Surface Pro 2
	tablet | 2014 | Microsoft | Surface Pro 3
	tablet | 2015 | Microsoft | Surface 3
	tablet | 2015 | Microsoft | Surface Pro 4
	tablet | 2017 | Microsoft | Surface Pro (5th Gen)
	tablet | 2018 | Microsoft | Surface Pro 6
	tablet | 2018 | Microsoft | Surface Go
	tablet | 2019 | Microsoft | Surface Pro 7
	tablet | 2019 | Microsoft | Surface Pro X
	tablet | 2020 | Microsoft | Surface Go 2
	tablet | 2021 | Microsoft | Surface Pro 7+
	tablet | 2021 | Microsoft | Surface Pro 8
	tablet | 2021 | Microsoft | Surface Go 3
	tablet | 2022 | Microsoft | Surface Pro 9
	tablet | 2023 | Microsoft | Surface Go 4
	tablet | 2024 | Microsoft | Surface Pro 10
	tablet | 2024 | Microsoft | Surface Pro (11th Edition)
	tablet | 2025 | Microsoft | Surface Pro 12-inch

	tablet | 2012 | Google | Nexus 7 (2012)
	tablet | 2013 | Google | Nexus 7 (2013)
	tablet | 2014 | Google | Nexus 9
	tablet | 2015 | Google | Pixel C
	tablet | 2018 | Google | Pixel Slate
	tablet | 2023 | Google | Pixel Tablet
	tablet | 2011 | Amazon | Kindle Fire
	tablet | 2023 | Amazon | Fire Max 11
	tablet | 2021 | Lenovo | Tab P11
	tablet | 2021 | Lenovo | Tab P12 Pro
	tablet | 2021 | Xiaomi | Xiaomi Pad 5
	tablet | 2023 | Xiaomi | Xiaomi Pad 6
	tablet | 2019 | Huawei | MatePad Pro

	laptop | 2008 | Apple | MacBook Air (Original)
	laptop | 2015 | Apple | MacBook (Retina, 12-inch, Early 2015)
	laptop | 2015 | Apple | MacBook Air (13-inch, Early 2015)
	laptop | 2015 | Apple | MacBook Pro (Retina, 13-inch, Early 2015)
	laptop | 2015 | Apple | MacBook Pro (Retina, 15-inch, Mid 2015)
	laptop | 2016 | Apple | MacBook Pro (15-inch, 2016)
	laptop | 2017 | Apple | MacBook Pro (15-inch, 2017)
	laptop | 2018 | Apple | MacBook Air (Retina, 13-inch, 2018)
	laptop | 2018 | Apple | MacBook Pro (15-inch, 2018)
	laptop | 2019 | Apple | MacBook Air (Retina, 13-inch, 2019)
	laptop | 2019 | Apple | MacBook Pro (16-inch, 2019)
	laptop | 2020 | Apple | MacBook Air (Retina, 13-inch, 2020)
	laptop | 2020 | Apple | MacBook Air (M1, 2020)
	laptop | 2020 | Apple | MacBook Pro (13-inch, M1, 2020)
	laptop | 2021 | Apple | MacBook Pro (14-inch, 2021)
	laptop | 2021 | Apple | MacBook Pro (16-inch, 2021)
	laptop | 2022 | Apple | MacBook Air (M2, 2022)
	laptop | 2022 | Apple | MacBook Pro (13-inch, M2, 2022)
	laptop | 2023 | Apple | MacBook Pro (14-inch, 2023)
	laptop | 2023 | Apple | MacBook Pro (16-inch, 2023)
	laptop | 2023 | Apple | MacBook Air (15-inch, M2, 2023)
	laptop | 2023 | Apple | MacBook Pro (14-inch, M3, Nov 2023)
	laptop | 2023 | Apple | MacBook Pro (16-inch, Nov 2023)
	laptop | 2024 | Apple | MacBook Air (13-inch, M3, 2024)
	laptop | 2024 | Apple | MacBook Air (15-inch, M3, 2024)
	laptop | 2024 | Apple | MacBook Pro (14-inch, M4, 2024)
	laptop | 2024 | Apple | MacBook Pro (16-inch, 2024)
	laptop | 2025 | Apple | MacBook Air (13-inch, M4, 2025)
	laptop | 2025 | Apple | MacBook Air (15-inch, M4, 2025)
	laptop | 2025 | Apple | MacBook Pro (14-inch, M5)

	laptop | 2018 | Dell | XPS 13 9370
	laptop | 2018 | Dell | XPS 15 9570
	laptop | 2019 | Dell | XPS 13 9380
	laptop | 2020 | Dell | XPS 13 9300
	laptop | 2020 | Dell | XPS 13 9310
	laptop | 2020 | Dell | XPS 15 9500
	laptop | 2020 | Dell | XPS 17 9700
	laptop | 2021 | Dell | XPS 15 9510
	laptop | 2022 | Dell | XPS 13 9315
	laptop | 2022 | Dell | XPS 13 Plus 9320
	laptop | 2022 | Dell | XPS 15 9520
	laptop | 2023 | Dell | XPS 15 9530
	laptop | 2024 | Dell | XPS 13 9340
	laptop | 2024 | Dell | XPS 13 9350

	laptop | 2018 | Lenovo | ThinkPad T480
	laptop | 2018 | Lenovo | ThinkPad X1 Carbon Gen 6
	laptop | 2019 | Lenovo | ThinkPad T490
	laptop | 2019 | Lenovo | ThinkPad X1 Carbon Gen 7
	laptop | 2020 | Lenovo | ThinkPad T14 Gen 1
	laptop | 2020 | Lenovo | ThinkPad X1 Carbon Gen 8
	laptop | 2021 | Lenovo | ThinkPad T14 Gen 2
	laptop | 2021 | Lenovo | ThinkPad X1 Carbon Gen 9
	laptop | 2022 | Lenovo | ThinkPad T14 Gen 3
	laptop | 2022 | Lenovo | ThinkPad X1 Carbon Gen 10
	laptop | 2023 | Lenovo | ThinkPad T14 Gen 4
	laptop | 2023 | Lenovo | ThinkPad X1 Carbon Gen 11
	laptop | 2024 | Lenovo | ThinkPad T14 Gen 5
	laptop | 2024 | Lenovo | ThinkPad X1 Carbon Gen 12

	laptop | 2018 | HP | EliteBook 840 G5
	laptop | 2019 | HP | EliteBook 840 G6
	laptop | 2020 | HP | EliteBook 840 G7
	laptop | 2021 | HP | EliteBook 840 G8
	laptop | 2021 | HP | Spectre x360 14
	laptop | 2022 | HP | EliteBook 840 G9
	laptop | 2023 | HP | EliteBook 840 G10
	laptop | 2024 | HP | EliteBook 840 G11

	laptop | 2015 | Microsoft | Surface Book
	laptop | 2017 | Microsoft | Surface Laptop
	laptop | 2017 | Microsoft | Surface Book 2
	laptop | 2018 | Microsoft | Surface Laptop 2
	laptop | 2019 | Microsoft | Surface Laptop 3
	laptop | 2020 | Microsoft | Surface Book 3
	laptop | 2020 | Microsoft | Surface Laptop Go
	laptop | 2021 | Microsoft | Surface Laptop 4
	laptop | 2021 | Microsoft | Surface Laptop Studio
	laptop | 2022 | Microsoft | Surface Laptop 5
	laptop | 2022 | Microsoft | Surface Laptop Go 2
	laptop | 2023 | Microsoft | Surface Laptop Go 3
	laptop | 2023 | Microsoft | Surface Laptop Studio 2
	laptop | 2024 | Microsoft | Surface Laptop 6
	laptop | 2024 | Microsoft | Surface Laptop (7th Edition)
	laptop | 2025 | Microsoft | Surface Laptop 13-inch

	laptop | 2020 | ASUS | ROG Zephyrus G14 (2020)
	laptop | 2021 | ASUS | ROG Zephyrus G14 (2021)
	laptop | 2022 | ASUS | ROG Zephyrus G14 (2022)
	laptop | 2023 | ASUS | ROG Zephyrus G14 (2023)
	laptop | 2024 | ASUS | ROG Zephyrus G14 (2024)

	laptop | 2021 | Samsung | Galaxy Book Pro
	laptop | 2022 | Samsung | Galaxy Book2 Pro
	laptop | 2023 | Samsung | Galaxy Book3 Pro
	laptop | 2023 | Samsung | Galaxy Book4 Pro
	laptop | 2025 | Samsung | Galaxy Book5 Pro

	laptop | 2018 | Razer | Blade 15 (2018)
	laptop | 2020 | Razer | Blade 15 (2020)
	laptop | 2021 | Razer | Blade 14 (2021)
	laptop | 2023 | Razer | Blade 16 (2023)
	laptop | 2023 | Razer | Blade 18 (2023)

	laptop | 2017 | Google | Pixelbook
	laptop | 2019 | Google | Pixelbook Go
	laptop | 2024 | LG | gram Pro 16
`).map(([type, year, vendor, model]) => ({
	type: type as DeviceType,
	year: Number(year),
	vendor,
	model
}));
