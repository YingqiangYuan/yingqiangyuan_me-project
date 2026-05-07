import { motion } from "framer-motion";
import Image from "next/image";
import { CDN_ASSETS, METADATA } from "@/lib/constants";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.3 }}
    >
      <div className="border-4 border-black dark:border-white bg-white dark:bg-black shadow-bold">
        {/* Content Section */}
        <div className="py-12 px-8 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-24 h-24 border-4 border-black dark:border-white overflow-hidden mb-6">
            <Image
              src={CDN_ASSETS.PROFILE_PHOTO}
              alt="John Doe Profile Photo"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Welcome Text */}
          <h2 className="font-display text-3xl sm:text-4xl text-black dark:text-white mb-4">
            HI! I'M JOHN'S <span className="text-accent">{METADATA.AI_ASSISTANT_NAME}</span>
          </h2>

          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Ask me anything about <span className="font-semibold text-accent">John Doe</span>'s professional background. I'm here to help you understand his unique value proposition!
          </p>
        </div>
      </div>
    </motion.div>
  );
};
