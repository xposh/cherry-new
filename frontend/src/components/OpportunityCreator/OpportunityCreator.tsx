import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type {
  OpportunityCreatorProps,
  OpportunityCreatorValues,
} from "./OpportunityCreator.types";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  FEATURED_IMAGE_MAX_BYTES,
  FEATURED_VIDEO_MAX_MB,
  FEATURED_VIDEO_MAX_BYTES,
  opportunityCreatorSchema,
} from "./OpportunityCreator.types";
import { supabase } from "../../util/supabase";

const defaultValues: OpportunityCreatorValues = {
  title: "",
  description: "",
  deadline: new Date(Date.now() + 1000 * 60 * 60 * 24)
    .toISOString()
    .slice(0, 16),
  image_url: "",
  video_url: "",
};

export function OpportunityCreator({
  role,
  ctaText,
  authFetch,
  onSuccess,
  initialValues,
  submitUrl = "/api/featured-opportunities",
  editMode = false,
  opportunityId,
  onCancelEdit,
}: OpportunityCreatorProps) {
  const mergedValues = useMemo(() => {
    const raw = { ...defaultValues, ...initialValues };
    // DB columns are nullable; Zod v4 .optional() only accepts undefined, not null.
    // Normalise null → empty string so the schema never sees null.
    return {
      ...raw,
      image_url: raw.image_url == null ? "" : raw.image_url,
      video_url: raw.video_url == null ? "" : raw.video_url,
    };
  }, [initialValues]);

  const [values, setValues] = useState<OpportunityCreatorValues>(mergedValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(values.image_url ?? "");
  const [videoPreview, setVideoPreview] = useState(values.video_url ?? "");
  const [errors, setErrors] = useState<
    Partial<Record<keyof OpportunityCreatorValues, string>>
  >({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setValues(mergedValues);
    setImagePreview(mergedValues.image_url ?? "");
    setVideoPreview(mergedValues.video_url ?? "");
    setImageFile(null);
    setVideoFile(null);
  }, [mergedValues]);

  const titleLabel =
    role === "company"
      ? "Feature the job or event that sets your brand apart"
      : "Showcase the project or milestone that proves your craft";

  const modeLabel = editMode ? "Update feature" : "Publish feature";

  function handleImageFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setUploadError(null);

    if (!file) {
      setImageFile(null);
      return;
    }
    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
      )
    ) {
      setUploadError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > FEATURED_IMAGE_MAX_BYTES) {
      setUploadError("Image is too large. Max size is 15MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleVideoFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setUploadError(null);

    if (!file) {
      setVideoFile(null);
      return;
    }
    if (
      !ALLOWED_VIDEO_TYPES.includes(
        file.type as (typeof ALLOWED_VIDEO_TYPES)[number],
      )
    ) {
      setUploadError("Please upload an MP4, WebM, or MOV video.");
      return;
    }
    if (file.size > FEATURED_VIDEO_MAX_BYTES) {
      setUploadError(
        `Video is too large. Max size is ${FEATURED_VIDEO_MAX_MB}MB.`,
      );
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  }

  async function uploadAsset(
    file: File,
    kind: "images" | "videos",
  ): Promise<string> {
    const bucket = role === "company" ? "companies" : "talents";
    const ext = file.name.split(".").pop() ?? "bin";
    const uniqueFileName = `featured_${role}_${kind}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}.${ext}`;

    const uploadResponse = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (uploadResponse.error) {
      const message = uploadResponse.error.message ?? "Upload failed";
      if (/maximum allowed size|too large|payload too large/i.test(message)) {
        const kindLabel = kind === "videos" ? "Video" : "Image";
        const limitMb = kind === "videos" ? FEATURED_VIDEO_MAX_MB : 15;
        throw new Error(
          `${kindLabel} exceeds the storage limit (${limitMb}MB). Please upload a smaller file or increase the bucket file size limit in Supabase Storage settings.`,
        );
      }
      throw uploadResponse.error;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(uniqueFileName);
    return data.publicUrl;
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFormError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setUploadError(null);
    setSuccessMessage(null);

    const result = opportunityCreatorSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof OpportunityCreatorValues, string>
      > = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof OpportunityCreatorValues] =
            issue.message;
        }
      });
      setErrors(fieldErrors);
      setFormError("Please fix the highlighted fields and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = values.image_url ?? "";
      let videoUrl = values.video_url ?? "";

      if (imageFile) {
        imageUrl = await uploadAsset(imageFile, "images");
      }
      if (videoFile) {
        videoUrl = await uploadAsset(videoFile, "videos");
      }

      const payload = {
        ...result.data,
        image_url: imageUrl || undefined,
        video_url: videoUrl || undefined,
      };

      const endpoint =
        editMode && opportunityId
          ? `/api/featured-opportunities/${opportunityId}`
          : submitUrl;

      const response = await authFetch(endpoint, {
        method: editMode ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          payload?.error ||
          payload?.message ||
          "Unable to submit featured opportunity.";
        throw new Error(message);
      }

      setSuccessMessage(
        editMode
          ? "Featured item updated successfully."
          : role === "company"
            ? "Your featured job or event is now live."
            : "Your showcase is now live for the community.",
      );
      setValues({ ...defaultValues });
      setImageFile(null);
      setVideoFile(null);
      setImagePreview("");
      setVideoPreview("");
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      setFormError(
        error instanceof Error ? error.message : "Unexpected error.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/15 bg-black/80 p-8 shadow-[0_20px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-full bg-[#FEF6EA]/10 p-3 text-[#FEF6EA]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#FEF6EA]/70">
            {editMode
              ? `Edit ${role === "company" ? "Opportunity" : "Showcase"}`
              : `Featured ${role === "company" ? "Opportunity" : "Showcase"}`}
          </p>
          <h2 className="text-3xl font-light text-white mt-2">{titleLabel}</h2>
        </div>
      </div>

      <p className="text-sm text-white/70 mb-8">{ctaText}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-white/80 mb-3" htmlFor="title">
            Headline
          </label>
          <input
            id="title"
            name="title"
            value={values.title}
            onChange={handleChange}
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder:text-white/40 focus:border-[#FEF6EA] focus:outline-none"
            placeholder={
              role === "company"
                ? "Senior Event Manager for our new flagship venue"
                : "Award-winning photography series launch"
            }
            disabled={isSubmitting}
          />
          {errors.title ? (
            <p className="mt-2 text-sm text-rose-400">{errors.title}</p>
          ) : null}
        </div>

        <div>
          <label
            className="block text-sm text-white/80 mb-3"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={5}
            className="w-full resize-none rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder:text-white/40 focus:border-[#FEF6EA] focus:outline-none"
            placeholder={
              role === "company"
                ? "Share the role, experience, and what makes it a can’t-miss opportunity."
                : "Describe the project, its impact, and why it matters to your career narrative."
            }
            disabled={isSubmitting}
          />
          {errors.description ? (
            <p className="mt-2 text-sm text-rose-400">{errors.description}</p>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              className="block text-sm text-white/80 mb-3"
              htmlFor="deadline"
            >
              Deadline
            </label>
            <input
              id="deadline"
              type="datetime-local"
              name="deadline"
              value={values.deadline}
              onChange={handleChange}
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white focus:border-[#FEF6EA] focus:outline-none"
              disabled={isSubmitting}
            />
            {errors.deadline ? (
              <p className="mt-2 text-sm text-rose-400">{errors.deadline}</p>
            ) : null}
          </div>

          <div>
            <label
              className="block text-sm text-white/80 mb-3"
              htmlFor="image_file"
            >
              Featured Image (optional)
            </label>
            <input
              id="image_file"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageFileChange}
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white file:mr-4 file:border-0 file:bg-[#FEF6EA] file:px-4 file:py-2 file:text-black"
              disabled={isSubmitting}
            />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Featured preview"
                className="mt-3 h-28 w-full rounded-xl object-cover grayscale"
              />
            ) : null}
          </div>
        </div>

        <div>
          <label
            className="block text-sm text-white/80 mb-3"
            htmlFor="video_file"
          >
            Featured Video (optional)
          </label>
          <input
            id="video_file"
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleVideoFileChange}
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white file:mr-4 file:border-0 file:bg-[#FEF6EA] file:px-4 file:py-2 file:text-black"
            disabled={isSubmitting}
          />
          <p className="mt-2 text-xs text-white/50">
            Max file size: {FEATURED_VIDEO_MAX_MB}MB.
          </p>
          {videoPreview ? (
            <video
              src={videoPreview}
              className="mt-3 h-28 w-full rounded-xl object-cover"
              muted
              playsInline
              controls
            />
          ) : null}
          {errors.video_url ? (
            <p className="mt-2 text-sm text-rose-400">{errors.video_url}</p>
          ) : null}
          {uploadError ? (
            <p className="mt-2 text-sm text-rose-400">{uploadError}</p>
          ) : null}
        </div>

        {formError ? (
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {formError}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {successMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/60">
              Your featured item will be visible publicly across profiles.
            </p>
          </div>
          <div className="flex gap-3">
            {editMode && onCancelEdit ? (
              <button
                type="button"
                onClick={onCancelEdit}
                className="inline-flex items-center justify-center rounded-3xl border border-white/30 px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#FEF6EA] px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f5e9c8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : modeLabel}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
