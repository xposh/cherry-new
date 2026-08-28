import { Upload, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Logo } from "../../components/Logo";
import { supabase } from "../../util/supabase";
import { useAuth } from "../../context/useAuth";
import { getSetupDraft, setSetupDraft } from "../../util/draftStorage";
import { mapTalentProfileToSetup1 } from "../../util/profileMapping";

interface UploadedImage {
  id: string;
  file?: File;
  preview: string;
  category: string;
  caption: string;
}

interface ProfileImage {
  file: File | null;
  preview: string;
}

export function TalentProfileSetup1() {
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();

  // Zustands-Initialisierung aus dem localStorage (Re-Hydration)
  const [profileImage, setProfileImage] = useState<ProfileImage>(() => {
    try {
      const saved = getSetupDraft("talentSetup1", user?.id);
      if (saved && typeof saved === "object") {
        const parsed = saved as { profileImage?: string };
        if (parsed.profileImage) {
          return { file: null, preview: parsed.profileImage };
        }
      }
    } catch (e) {
      console.error("Fehler beim Laden des Profilbild-Speichers:", e);
    }
    return { file: null, preview: "" };
  });

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(() => {
    try {
      const saved = getSetupDraft("talentSetup1", user?.id);
      if (saved && typeof saved === "object") {
        const parsed = saved as { images?: UploadedImage[] };
        if (parsed.images) {
          return parsed.images;
        }
      }
    } catch (e) {
      console.error("Fehler beim Laden des Galerie-Speichers:", e);
    }
    return [];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("Portfolio");
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [tempCaption, setTempCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function hydrateFromBackend() {
      if (!user?.id) return;
      if (getSetupDraft("talentSetup1", user.id)) return;

      try {
        const res = await authFetch("http://localhost:3000/profile");
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.profile) return;

        const mapped = mapTalentProfileToSetup1(data.profile);
        setProfileImage({ file: null, preview: mapped.profileImage || "" });
        setUploadedImages(mapped.images as UploadedImage[]);
      } catch (err) {
        console.error(
          "Failed to hydrate talent setup step 1 from backend:",
          err,
        );
      }
    }

    hydrateFromBackend();
  }, [authFetch, user?.id]);

  const categories = [
    "Portfolio",
    "Workspace",
    "Projects",
    "Certificates",
    "Others",
  ];

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: UploadedImage[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      category: selectedCategory,
      caption: "",
    }));

    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const removeImage = (id: string) => {
    setUploadedImages(uploadedImages.filter((img) => img.id !== id));
  };

  const updateCaption = (id: string, caption: string) => {
    setUploadedImages(
      uploadedImages.map((img) => (img.id === id ? { ...img, caption } : img)),
    );
  };

  const startEditingCaption = (id: string, currentCaption: string) => {
    setEditingCaption(id);
    setTempCaption(currentCaption);
  };

  const saveCaption = (id: string) => {
    updateCaption(id, tempCaption);
    setEditingCaption(null);
    setTempCaption("");
  };

  const handleNext = async () => {
    try {
      setIsUploading(true);
      let finalProfileImageUrl = profileImage.preview;

      if (profileImage.file) {
        const fileExt = profileImage.file.name.split(".").pop();
        const profileFileName = `${Date.now()}_profile.${fileExt}`;

        const profileUpload = await supabase.storage
          .from("talents")
          .upload(`avatars/${profileFileName}`, profileImage.file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (profileUpload.error) throw profileUpload.error;

        const { data: profileUrlData } = supabase.storage
          .from("talents")
          .getPublicUrl(`avatars/${profileFileName}`);

        finalProfileImageUrl = profileUrlData.publicUrl;
      }

      const uploadedImagesUrls = [];
      for (const img of uploadedImages) {
        if (!img.file) {
          uploadedImagesUrls.push({
            id: img.id,
            preview: img.preview,
            category: img.category,
            caption: img.caption,
          });
          continue;
        }

        const fileExt = img.file.name.split(".").pop();
        const galleryFileName = `${Date.now()}_${Math.random().toString(36).substr(2, 5)}.${fileExt}`;

        const galleryUpload = await supabase.storage
          .from("talents")
          .upload(`gallery/${galleryFileName}`, img.file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (galleryUpload.error) throw galleryUpload.error;

        const { data: galleryUrlData } = supabase.storage
          .from("talents")
          .getPublicUrl(`gallery/${galleryFileName}`);

        uploadedImagesUrls.push({
          id: img.id,
          preview: galleryUrlData.publicUrl,
          category: img.category,
          caption: img.caption,
        });
      }

      setSetupDraft("talentSetup1", user?.id, {
        profileImage: finalProfileImageUrl,
        images: uploadedImagesUrls,
      });

      navigate("/talent-profile-setup-2");
    } catch (err) {
      console.error("Fehler beim Bilder-Upload auf Page 1:", err);
      alert("Fehler beim Hochladen der Bilder. Bitte erneut versuchen.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-auto pb-20">
      <Logo to="/" />

      <div className="fixed top-8 right-8 z-50 flex gap-2">
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white/30 rounded-full"></div>
        <div className="w-12 h-1 bg-white/30 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-32 pb-32">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-white mb-4">
            Visual Profile
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Upload your profile picture and images that showcase your work.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
            Profile Picture
          </h2>
          {!profileImage.preview ? (
            <div
              className={`border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-white/60 transition-colors cursor-pointer max-w-md mx-auto ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
                id="profile-upload"
                disabled={isUploading}
              />
              <label htmlFor="profile-upload" className="cursor-pointer">
                <User className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white font-light mb-2">
                  {isUploading
                    ? "Uploading to Cloud..."
                    : "Upload your profile picture"}
                </p>
                <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
              </label>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="relative group">
                <img
                  src={profileImage.preview}
                  alt="Profile"
                  className="w-full h-80 object-cover rounded-xl"
                />
                <button
                  onClick={() => setProfileImage({ file: null, preview: "" })}
                  disabled={isUploading}
                  className="absolute top-4 right-4 p-2 bg-black/80 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="mb-8">
          <label className="block text-white font-light mb-4 uppercase tracking-[0.2em] text-sm">
            Select Category for Gallery Images
          </label>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                disabled={isUploading}
                className={`px-6 py-3 border rounded-lg transition-all uppercase tracking-[0.2em] text-sm font-light ${
                  selectedCategory === category
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/30 hover:border-white"
                } disabled:opacity-50`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <label className="block text-white font-light mb-4 uppercase tracking-[0.2em] text-sm">
            Upload Gallery Images
          </label>
          <div
            className={`border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-white/60 transition-colors cursor-pointer ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={isUploading}
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white font-light mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>
        </div>

        {uploadedImages.length > 0 && (
          <div className="mb-12">
            <h3 className="text-white font-light mb-6 uppercase tracking-[0.2em] text-sm">
              Uploaded Images ({uploadedImages.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {uploadedImages.map((img) => (
                <div
                  key={img.id}
                  className="relative group border border-white/30 rounded-xl overflow-hidden"
                >
                  <img
                    src={img.preview}
                    alt="Upload preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => removeImage(img.id)}
                      disabled={isUploading}
                      className="p-2 bg-black/80 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="p-4 bg-black/60 backdrop-blur-sm space-y-2">
                    <div>
                      <p className="text-white text-sm font-light italic mb-1">
                        {img.category}
                      </p>
                      {editingCaption === img.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tempCaption}
                            onChange={(e) => setTempCaption(e.target.value)}
                            placeholder="Add a caption..."
                            className="flex-1 px-3 py-2 bg-white/10 border border-white/30 text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors font-light text-sm rounded-lg"
                            autoFocus
                          />
                          <button
                            onClick={() => saveCaption(img.id)}
                            className="px-4 py-2 bg-white text-black hover:bg-gray-200 transition-all text-sm font-light rounded-lg"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <p
                          onClick={() =>
                            !isUploading &&
                            startEditingCaption(img.id, img.caption)
                          }
                          className="text-white text-sm font-light cursor-pointer hover:text-gray-300 transition-colors"
                        >
                          {img.caption
                            ? `"${img.caption}"`
                            : "Click to add caption..."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-8 border-t border-white/20">
          <Link
            to="/"
            className="px-8 py-3 border border-white/30 text-white hover:border-white transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg"
          >
            Back
          </Link>
          <button
            onClick={handleNext}
            disabled={isUploading}
            className="px-8 py-3 bg-white text-black hover:bg-gray-200 transition-all uppercase tracking-[0.2em] text-sm font-light rounded-lg disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}
