"use client";

import { ConfigProvider, Spin } from "antd";

export default function ButtonSpinner() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#ffffff" } }}>
      <Spin size="small" />
    </ConfigProvider>
  );
}
