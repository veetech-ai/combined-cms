// routes/stores.ts

import { Router } from "express";
import { storeService } from "../services/store.service";
import { analyticsService } from "../services/analytics.service";
import { aisleService } from "../services/aisle.service";

const router = Router();

router.get("/", async (req, res) => {
  const stores = await storeService.getStores();

  res.json(stores);
});

router.get("/:id", async (req, res) => {
  const store = await storeService.getStoreById(req.params.id);
  res.json(store);
});

router.get("/:id/analytics", async (req, res) => {
  const analytics = await storeService.getStoreAnalytics(req.params.id);
  res.json(analytics);
});

router.get("/count", async (req, res) => {
  const count = await storeService.getStoreCount();
  res.json({ count });
});

router.get("/organization/:organizationId", async (req, res) => {
  const stores = await storeService.getStoresByOrganizationId(
    req.params.organizationId
  );
  const data = await Promise.all(
    stores.map(async (store) => {
      const totalSearches = await analyticsService.getStoreTotalSearches(
        store.id
      );

      const productSearches = await analyticsService.getTopProducts(store.id, {
        ...req.query,
      });

      const aisles = await aisleService.getAislesByStoreId(store.id);
      const keywordSearches = await analyticsService.getKeywordAnalytics(
        store.id,
        { ...req.query }
      );
      return {
        ...store,
        totalSearches,
        aisles,
        productSearches,
        keywordSearches,
      };
    })
  );
  res.json(data);
});

router.get("/:organizationId/count", async (req, res) => {
  const count = await storeService.getStoreCountByOrganization(
    req.params.organizationId
  );
  res.json({ count });
});

export default router;
