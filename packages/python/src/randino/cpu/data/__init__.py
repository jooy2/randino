"""Every processor the catalog holds, by the name its maker gave it."""

from dataclasses import dataclass

from randino._internal.table import rows
from randino._types import CpuVendor, SystemPlatform

CPU_VENDORS: tuple[CpuVendor, ...] = (
    "Intel",
    "AMD",
    "Apple",
    "Qualcomm",
    "Samsung",
    "MediaTek",
    "Google",
    "HiSilicon",
)
"""Every maker the catalog holds a part of, in the order the catalog lists them."""


@dataclass(frozen=True, slots=True)
class CpuEntry:
    """One processor the catalog holds."""

    platform: SystemPlatform
    """The kind of machine it is built into."""

    year: int
    """The year the first machines with it went on sale."""

    vendor: CpuVendor
    """Who makes it: `Intel`, `AMD`, `Apple`, `Qualcomm`."""

    model: str
    """The processor's own name, as its maker writes it: `Core i7-13700K`."""


CPUS: tuple[CpuEntry, ...] = tuple(
    CpuEntry(platform=row[0], year=int(row[1]), vendor=row[2], model=row[3])  # type: ignore[arg-type]
    for row in rows("""
desktop | 2000 | Intel | Pentium 4
desktop | 2003 | Intel | Pentium M
desktop | 2005 | Intel | Pentium D
desktop | 2006 | Intel | Core 2 Duo E6600
desktop | 2006 | Intel | Core 2 Duo T7200
desktop | 2007 | Intel | Core 2 Quad Q6600
desktop | 2008 | Intel | Core 2 Duo E8400
desktop | 2008 | Intel | Atom N270
desktop | 2008 | Intel | Core i7-920
desktop | 2009 | Intel | Core i5-750
desktop | 2010 | Intel | Core i3-530
desktop | 2010 | Intel | Core i7-980X
desktop | 2011 | Intel | Core i5-2500K
desktop | 2011 | Intel | Core i7-2600K
desktop | 2011 | Intel | Core i5-2410M
desktop | 2012 | Intel | Core i5-3570K
desktop | 2012 | Intel | Core i7-3770K
desktop | 2012 | Intel | Core i5-3210M
desktop | 2013 | Intel | Core i7-4770K
desktop | 2013 | Intel | Core i5-4200U
desktop | 2014 | Intel | Core i5-4590
desktop | 2014 | Intel | Core i7-4790K
desktop | 2014 | Intel | Core i7-5960X
desktop | 2015 | Intel | Core i5-5200U
desktop | 2015 | Intel | Core i7-6700K
desktop | 2015 | Intel | Core i5-6500
desktop | 2015 | Intel | Core i5-6200U
desktop | 2016 | Intel | Core i5-7200U
desktop | 2017 | Intel | Core i7-7700K
desktop | 2017 | Intel | Core i5-7400
desktop | 2017 | Intel | Core i7-7700HQ
desktop | 2017 | Intel | Core i5-8250U
desktop | 2017 | Intel | Core i7-8550U
desktop | 2017 | Intel | Core i7-8700K
desktop | 2017 | Intel | Core i5-8400
desktop | 2018 | Intel | Core i7-8750H
desktop | 2018 | Intel | Core i9-9900K
desktop | 2018 | Intel | Core i7-9700K
desktop | 2018 | Intel | Core i5-9600K
desktop | 2019 | Intel | Core i5-9400F
desktop | 2019 | Intel | Core i7-9750H
desktop | 2019 | Intel | Core i7-1065G7
desktop | 2019 | Intel | Core i5-10210U
desktop | 2019 | Intel | Celeron N4020
desktop | 2020 | Intel | Core i9-10900K
desktop | 2020 | Intel | Core i7-10700K
desktop | 2020 | Intel | Core i5-10400
desktop | 2020 | Intel | Core i7-10750H
desktop | 2020 | Intel | Core i7-1165G7
desktop | 2020 | Intel | Core i5-1135G7
desktop | 2020 | Intel | Pentium Gold 7505
desktop | 2021 | Intel | Core i9-11900K
desktop | 2021 | Intel | Core i5-11400
desktop | 2021 | Intel | Core i7-11800H
desktop | 2021 | Intel | Core i9-12900K
desktop | 2021 | Intel | Core i7-12700K
desktop | 2021 | Intel | Core i5-12600K
desktop | 2022 | Intel | Core i5-12400
desktop | 2022 | Intel | Core i7-12700H
desktop | 2022 | Intel | Core i7-1255U
desktop | 2022 | Intel | Core i7-1260P
desktop | 2022 | Intel | Core i9-13900K
desktop | 2022 | Intel | Core i7-13700K
desktop | 2022 | Intel | Core i5-13600K
desktop | 2023 | Intel | Core i5-13400
desktop | 2023 | Intel | Core i9-13980HX
desktop | 2023 | Intel | Core i7-1360P
desktop | 2023 | Intel | Core i7-13700H
desktop | 2023 | Intel | Core i9-14900K
desktop | 2023 | Intel | Core i7-14700K
desktop | 2023 | Intel | Core i5-14600K
desktop | 2023 | Intel | Core Ultra 7 155H
desktop | 2023 | Intel | Core Ultra 5 125U
desktop | 2024 | Intel | Core i5-14400
desktop | 2024 | Intel | Core Ultra 7 258V
desktop | 2024 | Intel | Core Ultra 5 226V
desktop | 2024 | Intel | Core Ultra 9 285K
desktop | 2024 | Intel | Core Ultra 7 265K
desktop | 2024 | Intel | Core Ultra 5 245K
desktop | 2025 | Intel | Core Ultra 9 285H
desktop | 2025 | Intel | Core Ultra 9 275HX
desktop | 2025 | Intel | Core Ultra 5 225

desktop | 2003 | AMD | Athlon 64 3200+
desktop | 2005 | AMD | Athlon 64 X2 4200+
desktop | 2009 | AMD | Phenom II X4 940
desktop | 2010 | AMD | Phenom II X6 1090T
desktop | 2011 | AMD | FX-8150
desktop | 2012 | AMD | FX-8350
desktop | 2012 | AMD | FX-6300
desktop | 2013 | AMD | A10-6800K
desktop | 2017 | AMD | Ryzen 7 1700X
desktop | 2017 | AMD | Ryzen 5 1600
desktop | 2017 | AMD | Ryzen Threadripper 1950X
desktop | 2017 | AMD | Ryzen 5 2500U
desktop | 2018 | AMD | Ryzen 5 2400G
desktop | 2018 | AMD | Ryzen 7 2700X
desktop | 2018 | AMD | Ryzen 5 2600
desktop | 2019 | AMD | Ryzen 9 3900X
desktop | 2019 | AMD | Ryzen 7 3700X
desktop | 2019 | AMD | Ryzen 5 3600
desktop | 2019 | AMD | Ryzen 9 3950X
desktop | 2019 | AMD | Ryzen Threadripper 3970X
desktop | 2020 | AMD | Ryzen 7 4800H
desktop | 2020 | AMD | Ryzen 5 4500U
desktop | 2020 | AMD | Ryzen 7 4700U
desktop | 2020 | AMD | Ryzen 9 5950X
desktop | 2020 | AMD | Ryzen 9 5900X
desktop | 2020 | AMD | Ryzen 7 5800X
desktop | 2020 | AMD | Ryzen 5 5600X
desktop | 2021 | AMD | Ryzen 7 5800H
desktop | 2021 | AMD | Ryzen 5 5600H
desktop | 2021 | AMD | Ryzen 7 5700U
desktop | 2021 | AMD | Ryzen 5 5600G
desktop | 2022 | AMD | Ryzen 7 5800X3D
desktop | 2022 | AMD | Ryzen 5 5600
desktop | 2022 | AMD | Ryzen 7 6800H
desktop | 2022 | AMD | Ryzen 7 6800U
desktop | 2022 | AMD | Ryzen 9 7950X
desktop | 2022 | AMD | Ryzen 7 7700X
desktop | 2022 | AMD | Ryzen 5 7600X
desktop | 2023 | AMD | Ryzen 5 7600
desktop | 2023 | AMD | Ryzen 9 7950X3D
desktop | 2023 | AMD | Ryzen 7 7800X3D
desktop | 2023 | AMD | Ryzen 9 7940HS
desktop | 2023 | AMD | Ryzen 7 7840U
desktop | 2023 | AMD | Ryzen 5 7530U
desktop | 2024 | AMD | Ryzen 9 9950X
desktop | 2024 | AMD | Ryzen 7 9700X
desktop | 2024 | AMD | Ryzen 5 9600X
desktop | 2024 | AMD | Ryzen 7 9800X3D
desktop | 2024 | AMD | Ryzen AI 9 HX 370
desktop | 2024 | AMD | Ryzen AI 9 365
desktop | 2025 | AMD | Ryzen 9 9950X3D
desktop | 2025 | AMD | Ryzen AI Max+ 395
desktop | 2025 | AMD | Ryzen AI 7 350

desktop | 2020 | Apple | M1
desktop | 2021 | Apple | M1 Pro
desktop | 2021 | Apple | M1 Max
desktop | 2022 | Apple | M1 Ultra
desktop | 2022 | Apple | M2
desktop | 2023 | Apple | M2 Pro
desktop | 2023 | Apple | M2 Max
desktop | 2023 | Apple | M2 Ultra
desktop | 2023 | Apple | M3
desktop | 2023 | Apple | M3 Pro
desktop | 2023 | Apple | M3 Max
desktop | 2024 | Apple | M4
desktop | 2024 | Apple | M4 Pro
desktop | 2024 | Apple | M4 Max
desktop | 2025 | Apple | M3 Ultra
desktop | 2025 | Apple | M5

desktop | 2022 | Qualcomm | Snapdragon 8cx Gen 3
desktop | 2024 | Qualcomm | Snapdragon X Elite
desktop | 2024 | Qualcomm | Snapdragon X Plus
desktop | 2025 | Qualcomm | Snapdragon X

mobile | 2010 | Apple | A4
mobile | 2011 | Apple | A5
mobile | 2012 | Apple | A5X
mobile | 2012 | Apple | A6
mobile | 2012 | Apple | A6X
mobile | 2013 | Apple | A7
mobile | 2014 | Apple | A8
mobile | 2014 | Apple | A8X
mobile | 2015 | Apple | A9
mobile | 2015 | Apple | A9X
mobile | 2016 | Apple | A10 Fusion
mobile | 2017 | Apple | A10X Fusion
mobile | 2017 | Apple | A11 Bionic
mobile | 2018 | Apple | A12 Bionic
mobile | 2018 | Apple | A12X Bionic
mobile | 2019 | Apple | A13 Bionic
mobile | 2020 | Apple | A12Z Bionic
mobile | 2020 | Apple | A14 Bionic
mobile | 2021 | Apple | A15 Bionic
mobile | 2022 | Apple | A16 Bionic
mobile | 2023 | Apple | A17 Pro
mobile | 2024 | Apple | A18
mobile | 2024 | Apple | A18 Pro
mobile | 2025 | Apple | A19
mobile | 2025 | Apple | A19 Pro

mobile | 2013 | Qualcomm | Snapdragon 600
mobile | 2013 | Qualcomm | Snapdragon 800
mobile | 2014 | Qualcomm | Snapdragon 801
mobile | 2014 | Qualcomm | Snapdragon 805
mobile | 2015 | Qualcomm | Snapdragon 810
mobile | 2016 | Qualcomm | Snapdragon 625
mobile | 2016 | Qualcomm | Snapdragon 820
mobile | 2016 | Qualcomm | Snapdragon 821
mobile | 2017 | Qualcomm | Snapdragon 660
mobile | 2017 | Qualcomm | Snapdragon 835
mobile | 2018 | Qualcomm | Snapdragon 845
mobile | 2019 | Qualcomm | Snapdragon 665
mobile | 2019 | Qualcomm | Snapdragon 675
mobile | 2019 | Qualcomm | Snapdragon 730G
mobile | 2019 | Qualcomm | Snapdragon 855
mobile | 2019 | Qualcomm | Snapdragon 855+
mobile | 2020 | Qualcomm | Snapdragon 765G
mobile | 2020 | Qualcomm | Snapdragon 865
mobile | 2020 | Qualcomm | Snapdragon 865+
mobile | 2021 | Qualcomm | Snapdragon 778G
mobile | 2021 | Qualcomm | Snapdragon 870
mobile | 2021 | Qualcomm | Snapdragon 888
mobile | 2021 | Qualcomm | Snapdragon 8 Gen 1
mobile | 2022 | Qualcomm | Snapdragon 695
mobile | 2022 | Qualcomm | Snapdragon 7 Gen 1
mobile | 2022 | Qualcomm | Snapdragon 8+ Gen 1
mobile | 2022 | Qualcomm | Snapdragon 8 Gen 2
mobile | 2023 | Qualcomm | Snapdragon 7+ Gen 2
mobile | 2023 | Qualcomm | Snapdragon 7s Gen 2
mobile | 2023 | Qualcomm | Snapdragon 8 Gen 3
mobile | 2024 | Qualcomm | Snapdragon 8 Elite
mobile | 2025 | Qualcomm | Snapdragon 8 Elite Gen 5

mobile | 2016 | Samsung | Exynos 8890
mobile | 2017 | Samsung | Exynos 8895
mobile | 2018 | Samsung | Exynos 9810
mobile | 2019 | Samsung | Exynos 9820
mobile | 2020 | Samsung | Exynos 990
mobile | 2021 | Samsung | Exynos 2100
mobile | 2022 | Samsung | Exynos 2200
mobile | 2023 | Samsung | Exynos 1380
mobile | 2024 | Samsung | Exynos 1480
mobile | 2024 | Samsung | Exynos 2400
mobile | 2025 | Samsung | Exynos 1580
mobile | 2025 | Samsung | Exynos 2500

mobile | 2018 | MediaTek | Helio P60
mobile | 2019 | MediaTek | Helio G90T
mobile | 2020 | MediaTek | Helio G85
mobile | 2021 | MediaTek | Dimensity 700
mobile | 2021 | MediaTek | Dimensity 1200
mobile | 2022 | MediaTek | Helio G99
mobile | 2022 | MediaTek | Dimensity 8100
mobile | 2022 | MediaTek | Dimensity 9000
mobile | 2022 | MediaTek | Dimensity 9200
mobile | 2023 | MediaTek | Dimensity 7050
mobile | 2023 | MediaTek | Dimensity 9300
mobile | 2024 | MediaTek | Dimensity 9400
mobile | 2025 | MediaTek | Dimensity 9500

mobile | 2021 | Google | Tensor
mobile | 2022 | Google | Tensor G2
mobile | 2023 | Google | Tensor G3
mobile | 2024 | Google | Tensor G4
mobile | 2025 | Google | Tensor G5

mobile | 2017 | HiSilicon | Kirin 970
mobile | 2018 | HiSilicon | Kirin 980
mobile | 2019 | HiSilicon | Kirin 990
mobile | 2020 | HiSilicon | Kirin 9000
mobile | 2023 | HiSilicon | Kirin 9000S
mobile | 2024 | HiSilicon | Kirin 9010
""")
)
"""Every processor the catalog holds, one per row: `platform | year | vendor | model`.

Desktop and laptop processors under `desktop`, and the systems-on-chip of phones and
tablets under `mobile`. Each line is represented by the models a spec sheet most often
names rather than every variant its maker sold. The year is the year the first machines
with it went on sale, which for a phone chip announced in one December and shipped in the
next is the year it shipped. The catalog runs to the processors out by the end of 2025.
"""
