import { Router } from "express";

import {
  createProxyMiddleware,
} from "http-proxy-middleware";

import { env } from "../config/env";

const router = Router();


router.use(
  "/products",

  createProxyMiddleware({
    target: env.PRODUCT_SERVICE_URL,

    changeOrigin: true,
  })
);

router.use(
  "/auth",

  createProxyMiddleware({
    target: env.AUTH_SERVICE_URL,

    changeOrigin: true,
  })
);

export default router;