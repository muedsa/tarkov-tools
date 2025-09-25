import React from "react";
import TooltipStyles from "./tooltip.module.css";

// 定义提示框可能的方向
type TooltipDirection = "top" | "bottom" | "left" | "right";

// 定义组件的属性接口
interface TooltipProps {
  /** 触发提示框的子元素 */
  children: React.ReactNode;
  /** 提示框显示的内容 */
  content: React.ReactNode;
  /** 提示框显示的方向 */
  direction?: TooltipDirection;
  /** 提示框显示的延迟时间(ms) */
  /** 自定义类名 */
  className?: string;
  /** 是否禁用提示框 */
  disabled?: boolean;
  /** 提示框的z-index值 */
  zIndex?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  direction = "top",
  className = "",
  disabled = false,
  zIndex = 50,
}) => {
  if (disabled) {
    return <>{children}</>;
  }
  console.log(TooltipStyles);
  return (
    <div
      className={`${TooltipStyles["tooltip-container"]} ${TooltipStyles[direction]} ${className}`}
      role="tooltip"
    >
      {children}
      <span className={TooltipStyles["tooltip-text"]} style={{ zIndex }}>
        {content}
      </span>
    </div>
  );
};

export default Tooltip;
