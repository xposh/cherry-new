import { z } from "zod";

export const opportunityCreatorSchema = z.object({
  title: z
    .string()
    .min(8, "Title must be at least 8 characters")
    .max(120, "Title must be at most 120 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(800, "Description must be at most 800 characters"),
  deadline: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Deadline must be a valid date",
    })
    .refine((value) => new Date(value) > new Date(), {
      message: "Deadline must be in the future",
    }),
  image_url: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/[\w\-./?=#&]+$/.test(value),
      "Image URL must be a valid HTTPS URL",
    ),
  video_url: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/[\w\-./?=#&]+$/.test(value),
      "Video URL must be a valid HTTPS URL",
    ),
});

export type OpportunityCreatorValues = z.infer<typeof opportunityCreatorSchema>;

export interface OpportunityCreatorProps {
  role: "company" | "talent";
  ctaText: string;
  authFetch: typeof fetch;
  onSuccess?: () => void;
  initialValues?: Partial<OpportunityCreatorValues>;
  submitUrl?: string;
  editMode?: boolean;
  opportunityId?: number;
  onCancelEdit?: () => void;
}

export const FEATURED_IMAGE_MAX_BYTES = 15 * 1024 * 1024;

const parsedFeaturedVideoMaxMb = Number(
  import.meta.env.VITE_FEATURED_VIDEO_MAX_MB,
);

export const FEATURED_VIDEO_MAX_MB =
  Number.isFinite(parsedFeaturedVideoMaxMb) && parsedFeaturedVideoMaxMb > 0
    ? Math.floor(parsedFeaturedVideoMaxMb)
    : 50;

export const FEATURED_VIDEO_MAX_BYTES = FEATURED_VIDEO_MAX_MB * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;
