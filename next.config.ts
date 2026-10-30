import type { NextConfig } from "next";

process.env.TOKIO_WORKER_THREADS ??= "2";
process.env.RAYON_NUM_THREADS ??= "2";
process.env.UV_THREADPOOL_SIZE ??= "4";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    cpus: 2,
    workerThreads: false,
  },
};

export default nextConfig;
