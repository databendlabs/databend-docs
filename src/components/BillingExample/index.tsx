// Copyright 2025 DatabendLabs.
import React, { FC, ReactElement } from "react";
import styles from "./styles.module.scss";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import clsx from "clsx";

// SVG Icons as components
const ComputeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 1024 1024"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M256 106.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h618.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v810.666666a42.666667 42.666667 0 0 1-42.666667 42.666667h-426.666666v-85.333333h384v-725.333334H341.333333v170.666667H256v-213.333333z"
      fill="currentColor"
    />
    <path
      d="M64 320a42.666667 42.666667 0 0 1 42.666667-42.666667h384a42.666667 42.666667 0 0 1 42.666666 42.666667v597.333333a42.666667 42.666667 0 0 1-42.666666 42.666667h-384a42.666667 42.666667 0 0 1-42.666667-42.666667v-597.333333z m85.333333 42.666667v512h298.666667v-512h-298.666667z"
      fill="currentColor"
    />
    <path
      d="M234.666667 789.333333a42.666667 42.666667 0 0 1 42.666666-42.666666h42.666667a42.666667 42.666667 0 1 1 0 85.333333h-42.666667a42.666667 42.666667 0 0 1-42.666666-42.666667zM554.666667 789.333333a42.666667 42.666667 0 0 1 42.666666-42.666666h42.666667a42.666667 42.666667 0 1 1 0 85.333333h-42.666667a42.666667 42.666667 0 0 1-42.666666-42.666667z"
      fill="currentColor"
    />
  </svg>
);

const StorageIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse
      cx="12"
      cy="6"
      rx="8"
      ry="3"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M4 6V12C4 13.6569 7.58172 15 12 15C16.4183 15 20 13.6569 20 12V6"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M4 12V18C4 19.6569 7.58172 21 12 21C16.4183 21 20 19.6569 20 18V12"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const CloudIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.5 19C4.01472 19 2 16.9853 2 14.5C2 12.1564 3.79151 10.2313 6.07974 10.0194C6.54781 7.17213 9.02024 5 12 5C14.9798 5 17.4522 7.17213 17.9203 10.0194C20.2085 10.2313 22 12.1564 22 14.5C22 16.9853 19.9853 19 17.5 19H6.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 2V6M16 2V6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19M19 12L13 6M19 12L13 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface IExampleData {
  scenario: {
    title: string;
    description: string;
    specs: string[];
  };
  costs: {
    type: string;
    label: string;
    icon: FC;
    formula: string;
    result: string;
    unit: string;
    note: string;
    colorClass: string;
  }[];
  totals: {
    daily: { label: string; value: string; unit: string };
    monthly: { label: string; value: string; unit: string };
  };
  currency: string;
}

interface IBillingExampleProps {
  example?: 1 | 2;
}

const BillingExample: FC<IBillingExampleProps> = ({
  example = 2,
}): ReactElement => {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext() as any;

  const isChina = currentLocale === "zh";

  // Example 1 data - occasional query
  const example1Data: { cn: IExampleData; en: IExampleData } = {
    cn: {
      scenario: {
        title: "使用场景",
        description:
          "某用户使用商业版 XSmall 集群，偶尔查询一次数据，此次查询耗时 5 分 20 秒，数据存储容量为 100GB。",
        specs: ["XSmall 集群", "5分20秒查询", "100GB 存储", "偶发查询"],
      },
      costs: [
        {
          type: "compute",
          label: "计算费用",
          icon: ComputeIcon,
          formula: "0.00125 × (5×60+20)",
          result: "0.4",
          unit: "元",
          note: "XSmall 集群 0.00125 元/秒",
          colorClass: "blue",
        },
        {
          type: "storage",
          label: "存储费用",
          icon: StorageIcon,
          formula: "160 ÷ 1024 ÷ 30 × 100",
          result: "0.52",
          unit: "元",
          note: "存储单价 160 元/TB/月",
          colorClass: "emerald",
        },
      ],
      totals: {
        daily: { label: "日总费用", value: "0.92", unit: "元" },
        monthly: { label: "月总费用", value: "27.6", unit: "元" },
      },
      currency: "¥",
    },
    en: {
      scenario: {
        title: "Usage Scenario",
        description:
          "A user is using an XSmall warehouse (Business) and occasionally queries data. This specific query took 5 minutes and 20 seconds, and the data storage size is 100GB.",
        specs: ["XSmall Warehouse", "5m 20s Query", "100GB Storage", "Occasional"],
      },
      costs: [
        {
          type: "compute",
          label: "Compute",
          icon: ComputeIcon,
          formula: "$0.000416667 × (5×60+20)",
          result: "0.13",
          unit: "",
          note: "XSmall cluster $0.000416667/sec",
          colorClass: "blue",
        },
        {
          type: "storage",
          label: "Storage",
          icon: StorageIcon,
          formula: "$23 ÷ 1024 ÷ 30 × 100",
          result: "0.75",
          unit: "",
          note: "Storage $23/TB/month",
          colorClass: "emerald",
        },
      ],
      totals: {
        daily: { label: "Daily Total", value: "0.88", unit: "" },
        monthly: { label: "Monthly Total", value: "26.4", unit: "" },
      },
      currency: "$",
    },
  };

  // Example 2 data - continuous import
  const example2Data: { cn: IExampleData; en: IExampleData } = {
    cn: {
      scenario: {
        title: "使用场景",
        description:
          "某用户使用商业版 XSmall 集群，将数据持续导入 Databend Cloud。计算集群 24 小时不间断运行，存储数据量为 1TB，使用 Task 服务每分钟执行一次数据加载，预计调用 API 次数为 5 万次。",
        specs: ["XSmall 集群", "24 小时运行", "1TB 存储", "5 万次 API"],
      },
      costs: [
        {
          type: "compute",
          label: "计算费用",
          icon: ComputeIcon,
          formula: "0.00125 × 3600 × 24",
          result: "108",
          unit: "元/天",
          note: "XSmall 集群 0.00125 元/秒",
          colorClass: "blue",
        },
        {
          type: "storage",
          label: "存储费用",
          icon: StorageIcon,
          formula: "160 ÷ 30 × 1",
          result: "5.33",
          unit: "元/天",
          note: "存储单价 160 元/TB/月",
          colorClass: "emerald",
        },
        {
          type: "cloud",
          label: "云服务费用",
          icon: CloudIcon,
          formula: "4.5 × 5",
          result: "22.5",
          unit: "元/天",
          note: "4.5 元/万次 API 调用",
          colorClass: "violet",
        },
      ],
      totals: {
        daily: { label: "日总费用", value: "135.83", unit: "元" },
        monthly: { label: "月总费用", value: "4,074.9", unit: "元" },
      },
      currency: "¥",
    },
    en: {
      scenario: {
        title: "Usage Scenario",
        description:
          "A user is using an XSmall warehouse (Business) to continuously import data into Databend Cloud. The warehouse runs 24 hours a day with 1TB storage, using Task service for minute-by-minute data loading. The estimated number of API calls is 50,000.",
        specs: ["XSmall Warehouse", "24h Runtime", "1TB Storage", "50K API Calls"],
      },
      costs: [
        {
          type: "compute",
          label: "Compute",
          icon: ComputeIcon,
          formula: "$1.50 × 24h",
          result: "36",
          unit: "/day",
          note: "XSmall cluster $1.50/hour",
          colorClass: "blue",
        },
        {
          type: "storage",
          label: "Storage",
          icon: StorageIcon,
          formula: "$23 ÷ 30",
          result: "0.77",
          unit: "/day",
          note: "Storage $23/TB/month",
          colorClass: "emerald",
        },
        {
          type: "cloud",
          label: "Cloud Service",
          icon: CloudIcon,
          formula: "$2 × 5",
          result: "10",
          unit: "/day",
          note: "$2 per 10K API calls",
          colorClass: "violet",
        },
      ],
      totals: {
        daily: { label: "Daily Total", value: "46.77", unit: "" },
        monthly: { label: "Monthly Total", value: "1,403.1", unit: "" },
      },
      currency: "$",
    },
  };

  const exampleData = example === 1 ? example1Data : example2Data;
  const data = isChina ? exampleData.cn : exampleData.en;

  return (
    <div className={styles.container}>
      {/* Decorative background elements */}
      <div className={styles.bgBlur1} />
      <div className={styles.bgBlur2} />

      <div className={styles.content}>
        {/* Scenario Header */}
        <div className={styles.scenarioHeader}>
          <div className={styles.scenarioTitle}>
            <div className={styles.pulseIndicator} />
            <span>{data.scenario.title}</span>
          </div>
          <p className={styles.scenarioDesc}>{data.scenario.description}</p>
          <div className={styles.specTags}>
            {data.scenario.specs.map((spec, i) => (
              <span key={i} className={styles.specTag}>
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Cost Cards Grid */}
        <div className={styles.costsGrid}>
          {data.costs.map((cost, index) => {
            const Icon = cost.icon;
            return (
              <div
                key={cost.type}
                className={clsx(styles.costCard, styles[cost.colorClass])}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={styles.costHeader}>
                  <div className={styles.iconWrap}>
                    <Icon />
                  </div>
                  <span className={styles.costLabel}>{cost.label}</span>
                </div>

                {/* Formula */}
                <div className={styles.formulaWrap}>
                  <code className={styles.formula}>{cost.formula}</code>
                </div>

                {/* Result */}
                <div className={styles.resultWrap}>
                  <span className={styles.resultValue}>
                    {data.currency}
                    {cost.result}
                  </span>
                  <span className={styles.resultUnit}>{cost.unit}</span>
                </div>

                {/* Note */}
                <p className={styles.costNote}>{cost.note}</p>
              </div>
            );
          })}
        </div>

        {/* Totals Section */}
        <div className={styles.totalsSection}>
          <div className={styles.totalsGradientLine} />

          <div className={styles.totalsContent}>
            {/* Daily Total */}
            <div className={styles.totalItem}>
              <div className={styles.totalLabel}>
                <CalendarIcon />
                <span>{data.totals.daily.label}</span>
              </div>
              <span className={styles.totalValue}>
                {data.currency}
                {data.totals.daily.value}
                <span className={styles.totalUnit}>{data.totals.daily.unit}</span>
              </span>
            </div>

            {/* Arrow */}
            <div className={styles.arrowIcon}>
              <ArrowIcon />
            </div>

            {/* Monthly Total */}
            <div className={clsx(styles.totalItem, styles.monthlyTotal)}>
              <div className={styles.totalLabel}>
                <CalendarIcon />
                <span>{data.totals.monthly.label}</span>
              </div>
              <span className={clsx(styles.totalValue, styles.monthlyValue)}>
                {data.currency}
                {data.totals.monthly.value}
                <span className={styles.totalUnit}>{data.totals.monthly.unit}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingExample;
