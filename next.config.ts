import type { NextConfig } from "next";
import withMDX from "@next/mdx";

const configWithMdx = withMDX();

const nextConfig: NextConfig = {
  /* config options here */
};

export default configWithMdx(nextConfig);
