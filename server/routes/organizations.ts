// routes/organizations.ts

import { Router } from "express";
import { organizationService } from "../services/organization.service";
import { storeService } from "../services/store.service";
import { analyticsService } from "../services/analytics.service";

const router = Router();

// Get all organizations
router.get("/", async (req, res) => {
  const { rows: organizations } = await organizationService.getOrganizations();

  const data = await Promise.all(
    organizations.map(async (org) => {
      const storeCount = await storeService.getStoreCountByOrganization(org.id);
      const totalSearches = await analyticsService.getOrganizationTotalSearches(
        org.id
      );
      return { ...org, storeCount, totalSearches };
    })
  );

  res.json(data);
});

export default router;
