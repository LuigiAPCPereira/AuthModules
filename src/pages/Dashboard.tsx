import { motion } from "framer-motion";
import { LayoutDashboard, FolderOpen, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const cards = [
  { title: "Projetos", desc: "Gerencie seus projetos", icon: FolderOpen, url: "/app/projects" },
  { title: "Calendário", desc: "Veja seus eventos", icon: Calendar, url: "/app/calendar" },
];

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {user.name.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">Bem-vindo ao seu painel.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={() => navigate(card.url)}
            className="auth-card flex items-center gap-4 text-left hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <card.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;
