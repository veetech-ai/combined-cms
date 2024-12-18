import { Router } from "express";
import { z, ZodError } from "zod";
import { analyticsService } from "../services/analytics.service";

const router = Router();

// Validation schemas
const timeRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  interval: z.enum(["hour", "day", "week", "month"]).optional(),
});

const searchEventSchema = z.object({
  storeId: z.number(),
  searchTerm: z.string(),
  productId: z.number().optional(),
  aisleId: z.number().optional(),
  matched: z.boolean(),
  sessionId: z.string(),
  userAgent: z.string().optional(),
});

// Record search event
router.post("/events", async (req, res) => {
  try {
    const event = searchEventSchema.parse(req.body);
    await analyticsService.recordSearchEvent(event);
    res.status(201).json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get store analytics
router.get("/stores/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params;
    const params = timeRangeSchema.parse(req.query);
    const result = await analyticsService.getStoreAnalytics(
      Number(storeId),
      params
    );
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get top products
router.get("/stores/:storeId/products", async (req, res) => {
  try {
    const { storeId } = req.params;
    const params = timeRangeSchema.parse(req.query);
    const result = await analyticsService.getTopProducts(
      Number(storeId),
      params
    );
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get aisle analytics
router.get("/stores/:storeId/aisles", async (req, res) => {
  try {
    const { storeId } = req.params;
    const params = timeRangeSchema.parse(req.query);
    const result = await analyticsService.getAisleAnalytics(
      Number(storeId),
      params
    );
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get keyword analytics
router.get("/stores/:storeId/keywords", async (req, res) => {
  try {
    const { storeId } = req.params;
    const params = timeRangeSchema.parse(req.query);
    const result = await analyticsService.getKeywordAnalytics(
      Number(storeId),
      params
    );
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
