import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import { motion } from "framer-motion";

interface PageLayoutProps {
    children: React.ReactNode;
    showFooter?: boolean;
}

export function PageLayout({ children, showFooter = true }: PageLayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex-grow pt-20"
            >
                {children}
            </motion.main>

            {showFooter && <Footer />}
        </div>
    );
}
