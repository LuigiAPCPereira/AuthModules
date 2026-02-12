import { motion } from "framer-motion";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto text-center py-20"
    >
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
        <SettingsIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Configurações</h2>
      <p className="text-muted-foreground">Em breve. Este módulo está em desenvolvimento.</p>
    </motion.div>
  );
};

export default Settings;
