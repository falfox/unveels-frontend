import { Icons } from "../../components/icons";
import { RecordDialog } from "../../components/record-dialog";
import SwirlyBackground from "../../assets/swirly-background.svg";
import SwirlyBackgroundDesktop from "../../assets/swirly-background-desktop.svg";
import { TopNavigation } from "../../components/assistant";

const WelcomeScreen = ({ onStarted }: { onStarted: () => void }) => {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="w-[1700px] -translate-x-[350px] -translate-y-[900px] lg:hidden">
          <img
            src={SwirlyBackground}
            alt="Assistant"
            className="h-auto object-cover opacity-20"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* <div className="-translate-x-[270px] -translate-y-[100px] overflow-visible"> */}
          <img
            src={SwirlyBackgroundDesktop}
            alt="Assistant"
            className="relative hidden h-[1222px] w-[2704px] object-cover opacity-25 lg:block"
          />
        {/* </div> */}
        <div className="">
          {/* <svg
            viewBox="0 0 2704 1222"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-dvh w-auto object-cover opacity-20"
            style={{
              mixBlendMode: "multiply",
            }}
          >
            <path
              d="M53.5664 1C231.971 94.1424 178.404 196.943 356.809 290.086C535.214 383.228 588.78 280.427 767.133 373.543C945.486 466.658 891.971 569.486 1070.38 662.628C1248.78 755.771 1302.35 652.97 1480.75 746.112C1659.16 839.255 1605.59 942.056 1784.05 1035.22C1962.5 1128.39 2016.02 1025.57 2194.42 1118.71"
              stroke="url(#paint0_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M80.3496 1C258.754 94.1424 205.188 196.943 383.592 290.086C561.997 383.228 615.563 280.427 793.916 373.543C972.27 466.658 918.754 569.486 1097.16 662.628C1275.56 755.771 1329.13 652.97 1507.53 746.112C1685.94 839.255 1632.37 942.056 1810.83 1035.22C1989.28 1128.39 2042.8 1025.57 2221.2 1118.71"
              stroke="url(#paint1_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M107.135 1C285.539 94.1424 231.973 196.943 410.377 290.086C588.782 383.228 642.348 280.427 820.702 373.543C999.055 466.658 945.54 569.486 1123.94 662.628C1302.35 755.771 1355.92 652.97 1534.32 746.112C1712.72 839.255 1659.16 942.056 1837.61 1035.22C2016.07 1128.39 2069.58 1025.57 2247.99 1118.71"
              stroke="url(#paint2_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M134.029 1C312.434 94.1424 258.758 197.152 437.163 290.295C615.568 383.437 669.243 280.427 847.596 373.543C1025.95 466.658 972.325 569.695 1150.73 662.837C1329.13 755.98 1382.81 652.97 1561.21 746.112C1739.62 839.255 1685.94 942.265 1864.4 1035.43C2042.85 1128.6 2096.48 1025.57 2274.88 1118.71"
              stroke="url(#paint3_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M160.809 1C339.213 94.1424 285.538 197.152 463.942 290.295C642.347 383.437 696.022 280.427 874.375 373.543C1052.73 466.658 999.105 569.695 1177.51 662.837C1355.91 755.98 1409.59 652.97 1587.99 746.112C1766.4 839.255 1712.72 942.265 1891.18 1035.43C2069.63 1128.6 2123.26 1025.57 2301.66 1118.71"
              stroke="url(#paint4_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M187.594 1C365.998 94.1424 312.432 196.943 490.836 290.086C669.241 383.228 722.807 280.427 901.161 373.543C1079.51 466.658 1026 569.486 1204.4 662.628C1382.81 755.771 1436.37 652.97 1614.78 746.112C1793.18 839.255 1739.62 942.056 1918.07 1035.22C2096.53 1128.39 2150.04 1025.57 2328.45 1118.71"
              stroke="url(#paint5_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M214.375 1C392.78 94.1424 339.213 196.943 517.618 290.086C696.022 383.228 749.589 280.427 927.942 373.543C1106.29 466.658 1052.78 569.486 1231.18 662.628C1409.59 755.771 1463.16 652.97 1641.56 746.112C1819.96 839.255 1766.4 942.056 1944.85 1035.22C2123.31 1128.39 2176.82 1025.57 2355.23 1118.71"
              stroke="url(#paint6_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M241.16 1C419.565 94.1424 365.998 196.943 544.403 290.086C722.807 383.228 776.374 280.427 954.727 373.543C1133.08 466.658 1079.56 569.486 1257.97 662.628C1436.37 755.771 1489.94 652.97 1668.34 746.112C1846.75 839.255 1793.18 942.056 1971.64 1035.22C2150.09 1128.39 2203.61 1025.57 2382.01 1118.71"
              stroke="url(#paint7_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M267.943 1C446.348 94.1424 392.781 196.943 571.186 290.086C749.59 383.228 803.157 280.427 981.51 373.543C1159.86 466.658 1106.35 569.486 1284.75 662.628C1463.16 755.771 1516.72 652.97 1695.13 746.112C1873.53 839.255 1819.97 942.056 1998.42 1035.22C2176.88 1128.39 2230.39 1025.57 2408.8 1118.71"
              stroke="url(#paint8_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M294.725 1C473.129 94.1424 419.563 196.943 597.967 290.086C776.372 383.228 829.938 280.427 1008.29 373.543C1186.64 466.658 1133.13 569.486 1311.53 662.628C1489.94 755.771 1543.5 652.97 1721.91 746.112C1900.31 839.255 1846.75 942.056 2025.2 1035.22C2203.66 1128.39 2257.17 1025.57 2435.58 1118.71"
              stroke="url(#paint9_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M321.617 1C500.022 94.1424 446.346 197.152 624.751 290.295C803.155 383.437 856.831 280.427 1035.18 373.543C1213.54 466.658 1159.91 569.695 1338.32 662.837C1516.72 755.98 1570.4 652.97 1748.8 746.112C1927.21 839.255 1873.53 942.265 2051.99 1035.43C2230.44 1128.6 2284.07 1025.57 2462.47 1118.71"
              stroke="url(#paint10_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M348.402 1C526.807 94.1424 473.132 197.152 651.536 290.295C829.941 383.437 883.616 280.427 1061.97 373.543C1240.32 466.658 1186.7 569.695 1365.1 662.837C1543.51 755.98 1597.18 652.97 1775.59 746.112C1953.99 839.255 1900.32 942.265 2078.77 1035.43C2257.23 1128.6 2310.85 1025.57 2489.26 1118.71"
              stroke="url(#paint11_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M375.186 1C553.59 94.1424 500.024 196.943 678.428 290.086C856.833 383.228 910.399 280.427 1088.75 373.543C1267.11 466.658 1213.59 569.486 1391.99 662.628C1570.4 755.771 1623.97 652.97 1802.37 746.112C1980.77 839.255 1927.21 942.056 2105.66 1035.22C2284.12 1128.39 2337.64 1025.57 2516.04 1118.71"
              stroke="url(#paint12_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M401.967 1C580.371 94.1424 526.805 196.943 705.209 290.086C883.614 383.228 937.18 280.427 1115.53 373.543C1293.89 466.658 1240.37 569.486 1418.78 662.628C1597.18 755.771 1650.75 652.97 1829.15 746.112C2007.56 839.255 1953.99 942.056 2132.45 1035.22C2310.9 1128.39 2364.42 1025.57 2542.82 1118.71"
              stroke="url(#paint13_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M428.75 1C607.155 94.1424 553.588 196.943 731.993 290.086C910.397 383.228 963.964 280.427 1142.32 373.543C1320.67 466.658 1267.15 569.486 1445.56 662.628C1623.96 755.771 1677.53 652.97 1855.93 746.112C2034.34 839.255 1980.77 942.056 2159.23 1035.22C2337.68 1128.39 2391.2 1025.57 2569.6 1118.71"
              stroke="url(#paint14_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M455.535 1C633.94 94.1424 580.373 196.943 758.778 290.086C937.182 383.228 990.749 280.427 1169.1 373.543C1347.46 466.658 1293.94 569.486 1472.34 662.628C1650.75 755.771 1704.32 652.97 1882.72 746.112C2061.12 839.255 2007.56 942.056 2186.01 1035.22C2364.47 1128.39 2417.98 1025.57 2596.39 1118.71"
              stroke="url(#paint15_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M482.318 1C660.723 94.1424 607.156 196.943 785.561 290.086C963.965 383.228 1017.53 280.427 1195.89 373.543C1374.24 466.658 1320.72 569.486 1499.13 662.628C1677.53 755.771 1731.1 652.97 1909.5 746.112C2087.91 839.255 2034.34 942.056 2212.8 1035.22C2391.25 1128.39 2444.77 1025.57 2623.17 1118.71"
              stroke="url(#paint16_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M509.209 1C687.614 94.1424 633.938 197.152 812.343 290.295C990.747 383.437 1044.42 280.427 1222.78 373.543C1401.13 466.658 1347.5 569.695 1525.91 662.837C1704.31 755.98 1757.99 652.97 1936.39 746.112C2114.8 839.255 2061.12 942.265 2239.58 1035.43C2418.03 1128.6 2471.66 1025.57 2650.06 1118.71"
              stroke="url(#paint17_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M535.992 1C714.397 94.1424 660.721 197.152 839.126 290.295C1017.53 383.437 1071.21 280.427 1249.56 373.543C1427.91 466.658 1374.29 569.695 1552.69 662.837C1731.1 755.98 1784.77 652.97 1963.18 746.112C2141.58 839.255 2087.91 942.265 2266.36 1035.43C2444.82 1128.6 2498.44 1025.57 2676.85 1118.71"
              stroke="url(#paint18_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <path
              d="M562.775 1C741.18 94.1424 687.613 196.943 866.018 290.086C1044.42 383.228 1097.99 280.427 1276.34 373.543C1454.7 466.658 1401.18 569.486 1579.58 662.628C1757.99 755.771 1811.56 652.97 1989.96 746.112C2168.36 839.255 2114.8 942.056 2293.25 1035.22C2471.71 1128.39 2525.23 1025.57 2703.63 1118.71"
              stroke="url(#paint19_linear_10068_379)"
              strokeMiterlimit="10"
              style={{
                mixBlendMode: "overlay",
              }}
            />
            <defs>
              <linearGradient
                id="paint0_linear_10068_379"
                x1="480.114"
                y1="227.657"
                x2="407.61"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_10068_379"
                x1="506.897"
                y1="227.657"
                x2="434.393"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_10068_379"
                x1="533.682"
                y1="227.657"
                x2="461.178"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_10068_379"
                x1="560.574"
                y1="227.663"
                x2="487.931"
                y2="377.659"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_10068_379"
                x1="587.353"
                y1="227.663"
                x2="514.711"
                y2="377.659"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_10068_379"
                x1="614.141"
                y1="227.657"
                x2="541.637"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_10068_379"
                x1="640.923"
                y1="227.657"
                x2="568.418"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint7_linear_10068_379"
                x1="667.708"
                y1="227.657"
                x2="595.204"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint8_linear_10068_379"
                x1="694.491"
                y1="227.657"
                x2="621.987"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint9_linear_10068_379"
                x1="721.272"
                y1="227.657"
                x2="648.768"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint10_linear_10068_379"
                x1="748.162"
                y1="227.663"
                x2="675.519"
                y2="377.659"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint11_linear_10068_379"
                x1="774.947"
                y1="227.663"
                x2="702.304"
                y2="377.659"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint12_linear_10068_379"
                x1="801.733"
                y1="227.657"
                x2="729.229"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint13_linear_10068_379"
                x1="828.514"
                y1="227.657"
                x2="756.01"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint14_linear_10068_379"
                x1="855.298"
                y1="227.657"
                x2="782.793"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint15_linear_10068_379"
                x1="882.083"
                y1="227.657"
                x2="809.579"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint16_linear_10068_379"
                x1="908.866"
                y1="227.657"
                x2="836.362"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint17_linear_10068_379"
                x1="935.753"
                y1="227.663"
                x2="863.111"
                y2="377.659"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint18_linear_10068_379"
                x1="962.537"
                y1="227.663"
                x2="889.894"
                y2="377.659"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
              <linearGradient
                id="paint19_linear_10068_379"
                x1="989.323"
                y1="227.657"
                x2="916.819"
                y2="377.344"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.537367" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.77" />
              </linearGradient>
            </defs>
          </svg> */}
        </div>
      </div>
      <TopNavigation />
      <div className="flex h-dvh w-full flex-1 flex-col items-start justify-center px-4 lg:items-center">
        <div>
          <Icons.logo className="size-20 lg:ml-10 lg:size-24" />

          <p className="text-[2.125rem] text-white lg:text-center">
            Welcome to{" "}
            <span className="inline-block bg-[linear-gradient(90deg,#CA9C43_36.41%,#916E2B_46.74%,#6A4F1B_58.8%,#473209_74.11%)] bg-clip-text text-transparent">
              Sarah
            </span>
            , Your Virtual Shopping Assistant
          </p>
          <div className="pt-4 text-white">
            Hello and welcome! I’m Sarah, here to assist you with all your
            shopping needs.
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-10 w-full px-6 pb-12 lg:static lg:pt-32">
          <RecordDialog
            onConfirm={() => {
              onStarted();
            }}
          >
            <button
              type="button"
              className="mx-auto flex w-full items-center justify-center rounded bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)] p-4 text-white lg:max-w-md lg:text-[26px]"
            >
              Start
            </button>
          </RecordDialog>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
