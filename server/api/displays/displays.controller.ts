import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { asyncHandler } from '../../util/asyn-handler';
import { ApiError } from '../../util/api.error';

const DISPLAYS_FILE = path.join(process.cwd(), 'data', 'displays.json');

// Ensure the data directory exists
async function ensureDataDir() {
  const dir = path.dirname(DISPLAYS_FILE);
  await fs.mkdir(dir, { recursive: true });
}

// Read displays from file
async function readDisplays() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DISPLAYS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Write displays to file
async function writeDisplays(displays: any[]) {
  await ensureDataDir();
  await fs.writeFile(DISPLAYS_FILE, JSON.stringify(displays, null, 2));
}

export const getDisplays = asyncHandler(async (req: Request, res: Response) => {
  const displays = await readDisplays();
  res.json(displays);
});

export const addDisplay = asyncHandler(async (req: Request, res: Response) => {
  const newDisplay = req.body;

  if (!newDisplay.id || !newDisplay.hexCode) {
    throw new ApiError(400, 'Display ID and hex code are required');
  }

  const displays = await readDisplays();

  // Check if display with same hex code already exists
  if (displays.some((d: any) => d.hexCode === newDisplay.hexCode)) {
    throw new ApiError(400, 'Display with this hex code already exists');
  }

  displays.push(newDisplay);
  await writeDisplays(displays);

  res.status(201).json(newDisplay);
});

export const updateDisplay = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const displays = await readDisplays();
    const index = displays.findIndex((d: any) => d.id === id);

    if (index === -1) {
      throw new ApiError(404, 'Display not found');
    }

    displays[index] = { ...displays[index], ...updateData };
    await writeDisplays(displays);

    res.json(displays[index]);
  }
);

export const deleteDisplay = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const displays = await readDisplays();
    const filteredDisplays = displays.filter((d: any) => d.id !== id);

    if (displays.length === filteredDisplays.length) {
      throw new ApiError(404, 'Display not found');
    }

    await writeDisplays(filteredDisplays);
    res.status(204).send();
  }
);

export const getDisplay = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const displays = await readDisplays();
  const display = displays.find((d: any) => d.id === id);

  if (!display) {
    throw new ApiError(404, 'Display not found');
  }

  res.json(display);
});
