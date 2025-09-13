import { z } from "zod";

const required =  {
  sessionId: z.string().min(1).optional(),
}

export { required };
