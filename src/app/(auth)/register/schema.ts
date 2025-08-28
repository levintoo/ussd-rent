import { z } from "zod";

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Name is required.",
  }),
  email: z.email({
    message: "Invalid email address.",
  }),
  password: z.string().trim().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default formSchema;
