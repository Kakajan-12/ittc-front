"use client";

import { ConfigProvider, Segmented } from "antd";
import { useTranslations } from "next-intl";

export type AuthMode = "signin" | "registration";

interface AuthModeTabsProps {
  value: AuthMode;
  onChange: (mode: AuthMode) => void;
  className?: string;
}

export default function AuthModeTabs({
  value,
  onChange,
  className = "",
}: AuthModeTabsProps) {
  const t = useTranslations("Registration.tabs");

  return (
    <ConfigProvider
      theme={{
        token: { fontFamily: "inherit", fontSize: 16, borderRadius: 4 },
        components: {
          Segmented: {
            trackBg: "#05518B",
            trackPadding: 8,
            controlHeight: 60,
            controlHeightLG: 60,
            controlHeightSM: 60,
            itemColor: "rgba(255, 255, 255, 0.7)",
            itemHoverColor: "#ffffff",
            itemHoverBg: "rgba(255, 255, 255, 0.1)",
            itemActiveBg: "rgba(255, 255, 255, 0.16)",
            itemSelectedBg: "#0071BB",
            itemSelectedColor: "#ffffff",
          },
        },
      }}
    >
      <Segmented<AuthMode>
        block
        value={value}
        onChange={onChange}
        options={[
          { label: t("signIn"), value: "signin" },
          { label: t("registration"), value: "registration" },
        ]}
        className={`auth-mode-segmented w-full ${className}`}
      />
    </ConfigProvider>
  );
}
