import { useState } from "react";
import { useIdleTimer } from "react-idle-timer";

const useIdleTimeout = ({ onIdle, idleTime = 1, handleIdle }) => {
  const idleTimeout = idleTime;
  const [isIdle, setIsIdle] = useState(false);

  const handleIdleAction = () => {
    handleIdle();
    setIsIdle(true);
  };

  const handleActive = () => {
    if (!isIdle) {
      setIsIdle(false);
      idleTimer.reset();
    }
  };

  const idleTimer = useIdleTimer({
    timeout: idleTimeout,
    promptTimeout: idleTimeout / 2,
    onPrompt: onIdle,
    onIdle: handleIdleAction,
    onActive: handleActive,
    debounce: 500,
  });

  return {
    isIdle,
    setIsIdle,
    idleTimer,
  };
};

export default useIdleTimeout;
