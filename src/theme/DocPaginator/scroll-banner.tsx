// Copyright 2025 DatabendLabs.
import { Flex } from "antd";
import type { FC, ReactElement } from "react";
import Slider from "react-slick";
import styles from "./styles.module.scss";
const ANNOUNCEMENTS = [
  "用户 ue**ke@163.com 指出问题【注释与命令不符，拼写错误】，获得 Tshirt 一件",
  "用户 bo**yf@gmail.com 提出建议【存储过程相关的文档过于分散】，获得定制魔方一个",
  "用户 7**99@qq.com 指出问题【没看到 range + 时间方式的处理】，获得 Tshirt 一件",
  "用户 ty**ll@**.com 指出问题【404 找不到链接】，获得 Tshirt 一件",
];

function Item({ text }: { text: string }) {
  return (
    <div style={{ height: "40px", lineHeight: "40px", paddingLeft: "20px" }}>
      <Flex
        align="center"
        gap={8}
        style={{
          height: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: "var(--color-primary)",
            display: "inline-block",
            borderRadius: "50%",
          }}
        ></span>
        {text}
      </Flex>
    </div>
  );
}

const ScrollBanner: FC = (): ReactElement => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    vertical: true,
    arrows: false,
    pauseOnHover: false,
    cssEase: "cubic-bezier(0.25, 1, 0.5, 1)",
  };

  return (
    <div className={styles?.marquee}>
      <Slider {...settings}>
        {ANNOUNCEMENTS.map((text, index) => (
          <Item key={index} text={text} />
        ))}
      </Slider>
    </div>
  );
};

export default ScrollBanner;
