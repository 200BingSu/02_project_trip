import { AnimatePresence, motion } from "framer-motion";
import TitleHeaderTs from "../layout/header/TitleHeaderTs";
import { NotiDetailProps } from "../../pages/userpage/user/PushNotification";

interface NotificationProps {
  notica: {
    category: string;
    txt: string;
    noticedAt: string;
  };
  isVisible: boolean;
  onClose: () => void;
}

const Notification = ({
  notiDetail,
  isVisible,
  onClose,
}: {
  notiDetail: NotiDetailProps;
  isVisible: NotificationProps["isVisible"];
  onClose: NotificationProps["onClose"];
}): JSX.Element => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: "50%", opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 right-1/2  max-w-[768px] w-full h-screen bg-white z-[999]"
        >
          <div className="">
            <TitleHeaderTs icon="close" onClick={onClose} />
            <div className="px-4 text-slate-700 py-4">
              <strong className="text-lg">{notiDetail.title}</strong>
              <p className="text-sm text-slate-400 mt-2 tracking-tight">
                {notiDetail.noticedAt}
              </p>
            </div>
            <div className="px-4 text-slate-700">
              <p>{notiDetail.content}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
