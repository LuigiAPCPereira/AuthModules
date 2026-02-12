import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

const ProfileAvatar = () => {
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Formato inválido", description: "Selecione uma imagem.", variant: "destructive" });
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    updateUser({ avatar: url });
    toast({ title: "Avatar atualizado!" });
  };

  const displaySrc = preview || user.avatar;

  return (
    <div className="auth-card flex flex-col items-center gap-4 py-8">
      <motion.div
        className="relative group cursor-pointer"
        whileHover={{ scale: 1.03 }}
        onClick={() => fileRef.current?.click()}
      >
        <Avatar className="h-24 w-24 border-2 border-border">
          {displaySrc && <AvatarImage src={displaySrc} alt={user.name} />}
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-6 w-6 text-white" />
        </div>
      </motion.div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
};

export default ProfileAvatar;
