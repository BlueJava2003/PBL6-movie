import { z } from "zod";

export const roomStateSchema = z.object({
  scheduleId: z.number().int().positive(),
  roomId: z.number().int().positive(),
});

export type RoomStateFormData = z.infer<typeof roomStateSchema>;
