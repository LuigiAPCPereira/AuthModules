import { motion } from "framer-motion";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const ProfilePage = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-md mx-auto space-y-6"
    >
      <motion.div variants={item}>
        <ProfileAvatar />
      </motion.div>
      <motion.div variants={item}>
        <ProfileForm />
      </motion.div>
      <motion.div variants={item}>
        <ChangePasswordForm />
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
